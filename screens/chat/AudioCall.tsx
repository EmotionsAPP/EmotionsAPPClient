import React, { useEffect, useRef, useState } from "react"
import { Text, View, StyleSheet } from "react-native"
import { IconButton } from "react-native-paper"
import { mediaDevices, MediaStream, RTCView, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from "react-native-webrtc";
import InCallManager from 'react-native-incall-manager';
import { io } from "socket.io-client";
import { WS } from "../../store/services";

interface AudioCallProps {
    peerConnection: any;
    socketConnection: any;
    otherUser: string;
    roomId: string;
    closeAudioCall: () => void;
}

export const AudioCall: React.FC<AudioCallProps> = (props) => {
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const [localStream, setLocalStream] = useState<MediaStream>();
    const socket = io(WS);
    const peerRef = useRef<any>();
    const socketRef = useRef<any>();
    const otherUser = useRef<any>();

    const remote = new MediaStream(undefined);
    
    useEffect(() => {
        socketRef.current = socket.connect();
        socketRef.current.emit('join room', props.roomId+'Audio');

        socketRef.current.on('other user', (userId: string) => {
            callUser(userId);
            otherUser.current = userId;
        });

        socketRef.current.on('user joined', (userId: string) => {
            otherUser.current = userId;
        });

        socketRef.current.on('offer', handleOffer);

        socketRef.current.on('answer', handleAnswer);

        socketRef.current.on('ice-candidate', handleNewICECandidateMsg);

        props.socketConnection.on('accept audio call', audioCallAccepted);

        props.socketConnection.on('reject audio call', audioCallRejected);
    }, []);

    const callUser = (userId: string) => {
        console.log("Initiated an audio call", socketRef.current.id);
        peerRef.current = Peer(userId);

        mediaDevices.getUserMedia({
            audio: true
        }).then((local: any) => {
            
            peerRef.current.addStream(local);
            setLocalStream(local);
            
            setRemoteStream(remote);
    
            local.getTracks().forEach((track: any) => {             
                peerRef.current.getLocalStreams()[0].addTrack(track);
            });

            peerRef.current.ontrack = handleTrack;
            peerRef.current.onaddstream = handleAddStream;
        });
    }

    const Peer = (userId?: string) => {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:openrelay.metered.ca:80",
                  },
                  {
                    urls: "turn:openrelay.metered.ca:80",
                    username: "openrelayproject",
                    credential: "openrelayproject",
                  },
                  {
                    urls: "turn:openrelay.metered.ca:443",
                    username: "openrelayproject",
                    credential: "openrelayproject",
                  },
                  {
                    urls: "turn:openrelay.metered.ca:443?transport=tcp",
                    username: "openrelayproject",
                    credential: "openrelayproject",
                  },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeeded(userId);

        return peer;
    }

    const handleOffer = (incoming: any) => {
        console.log('Handling offer', socketRef.current.id);
        
        peerRef.current = Peer();
        peerRef.current.ontrack = handleTrack;
        peerRef.current.onaddstream = handleAddStream;

        const desc = new RTCSessionDescription(incoming.sdp);
        
        peerRef.current.setRemoteDescription(desc)
        .then(() => {})
        .then(() => {            
            return peerRef.current.createAnswer()
        }).then((answer: any) => {            
            return peerRef.current.setLocalDescription(answer)
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit('answer', payload);
        })
    }

    const handleAnswer = (message: any) => {
        console.log('Handling answer', socketRef.current.id);
        
        const description = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(description)
        .catch((error: any) => console.log('Error handling answer', error));
    }

    const handleNegotiationNeeded = (userId?: string) => {
        console.log('Handling negotiation needed', socketRef.current.id);
                
        peerRef.current.createOffer()
        .then((offer: any) => {
            return peerRef.current.setLocalDescription(offer)
        })
        .then(() => {
            const payload = {
                target: userId,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };            
            socketRef.current.emit('offer', payload);
        }).catch((error: any) => {
            console.log('Error handling negotiation needed', error);
        });
        
    }

    const handleICECandidateEvent = (event: any) => {
        if(event.candidate){
            const payload = {
                target: otherUser.current,
                candidate: event.candidate
            }
            socketRef.current.emit('ice-candidate', payload);
        }
    }

    const handleNewICECandidateMsg = (incoming: any) => {
        const candidate = new RTCIceCandidate(incoming);
        peerRef.current.addIceCandidate(candidate)
        .catch((error: any) => console.log(error));
    }

    const handleTrack = (event: any) => {
        console.log("Handling Track", socketRef.current.id);
        
        event.streams[0].getTracks().forEach((track: any) => {
            remote.addTrack(track);
        });
    }

    const handleAddStream = (event: any) => {
        console.log("Handling Add Stream", socketRef.current.id);
        setRemoteStream(event.stream);
    }
    
    const audioCallAccepted = () => {
        InCallManager.stopRingback();
    }

    const audioCallRejected = () => {
        InCallManager.stopRingback();
        props.closeAudioCall();
    }

    return (
        <View style={styles.screen}>
            <IconButton
                icon="phone"
                color="#bebebe"
                size={150}
                style={styles.centerButton}
            />
            <View style={styles.footerButtons}>
                <IconButton
                    icon="phone-hangup"
                    color="white"
                    style={styles.hangupButton}
                    size={40}
                />
            </View>

            { localStream && 
            (   <RTCView 
                    streamURL={localStream.toURL()}
                /> 
            ) }
            { remoteStream && 
            (   <RTCView 
                    streamURL={remoteStream.toURL()}
                /> 
            ) }
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%',
        backgroundColor: '#202124',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    centerButton: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#bebebe',
    },
    footerButtons: {
        position: 'absolute',
        bottom: 20,
        left: '42%'
    },
    hangupButton: {
        borderRadius: 100,
        backgroundColor: '#c50707'
    }
})