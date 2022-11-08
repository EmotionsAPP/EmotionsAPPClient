import React, { useEffect, useRef, useState } from "react"
import { Text, View, StyleSheet, SafeAreaView, Modal } from "react-native"
import { IconButton, Portal } from "react-native-paper"
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
    const socketAudio = io(WS);
    const peerRefAudio = useRef<any>();
    const socketRefAudio = useRef<any>();
    const otherUserAudio = useRef<any>();
    const [called, setCalled] = useState(false);

    const [modal, setModal] = useState(true);

    const remote = new MediaStream(undefined);
    
    useEffect(() => {    
        socketRefAudio.current = socketAudio.connect();
        socketRefAudio.current.emit('join room', props.roomId+'Audio');

        socketRefAudio.current.on('other user', (userId: string) => {
            callUser(userId);
            otherUserAudio.current = userId;
        });

        socketRefAudio.current.on('user joined', (userId: string) => {
            otherUserAudio.current = userId;
        });

        socketRefAudio.current.on('offer', handleOffer);

        socketRefAudio.current.on('answer', handleAnswer);

        socketRefAudio.current.on('ice-candidate', handleNewICECandidateMsg);

        props.socketConnection.on('accept audio call', audioCallAccepted);

        props.socketConnection.on('reject audio call', audioCallRejected);
    }, []);

    const callUser = (userId: string) => {
        console.log("Initiated an audio call", socketRefAudio.current.id);
        peerRefAudio.current = Peer(userId);

        mediaDevices.getUserMedia({
            audio: true
        }).then((local: any) => {
            setLocalStream(local);
            setRemoteStream(remote);
            peerRefAudio.current.addStream(local);

            local?.getTracks().forEach((track: any) => {             
                peerRefAudio.current.getLocalStreams()[0].addTrack(track);
            });
        });

        setCalled(true);

        peerRefAudio.current.ontrack = handleTrack;
        peerRefAudio.current.onaddstream = handleAddStream;
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
        console.log('Handling offer', socketRefAudio.current.id);
        
        peerRefAudio.current = Peer();

        if(!called) mediaDevices.getUserMedia({
            audio: true
        }).then((local: any) => {
            setLocalStream(local);
            setRemoteStream(remote);
            peerRefAudio.current.addStream(local);

            local?.getTracks().forEach((track: any) => {             
                peerRefAudio.current.getLocalStreams()[0].addTrack(track);
            });
        });

        peerRefAudio.current.ontrack = handleTrack;
        peerRefAudio.current.onaddstream = handleAddStream;

        const desc = new RTCSessionDescription(incoming.sdp);
        
        peerRefAudio.current.setRemoteDescription(desc)
        .then(() => {})
        .then(() => {            
            return peerRefAudio.current.createAnswer()
        }).then((answer: any) => {            
            return peerRefAudio.current.setLocalDescription(answer)
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRefAudio.current.id,
                sdp: peerRefAudio.current.localDescription
            }
            socketRefAudio.current.emit('answer', payload);
        })
    }

    const handleAnswer = (message: any) => {
        console.log('Handling answer', socketRefAudio.current.id);
        
        const description = new RTCSessionDescription(message.sdp);
        peerRefAudio.current.setRemoteDescription(description)
        .catch((error: any) => console.log('Error handling answer', error));
    }

    const handleNegotiationNeeded = (userId?: string) => {
        console.log('Handling negotiation needed', socketRefAudio.current.id);
                
        peerRefAudio.current.createOffer()
        .then((offer: any) => {
            return peerRefAudio.current.setLocalDescription(offer)
        })
        .then(() => {
            const payload = {
                target: userId,
                caller: socketRefAudio.current.id,
                sdp: peerRefAudio.current.localDescription
            };            
            socketRefAudio.current.emit('offer', payload);
        }).catch((error: any) => {
            console.log('Error handling negotiation needed', error);
        });
        
    }

    const handleICECandidateEvent = (event: any) => {
        if(event.candidate){
            const payload = {
                target: otherUserAudio.current,
                candidate: event.candidate
            }
            socketRefAudio.current.emit('ice-candidate', payload);
        }
    }

    const handleNewICECandidateMsg = (incoming: any) => {
        const candidate = new RTCIceCandidate(incoming);
        peerRefAudio.current.addIceCandidate(candidate)
        .catch((error: any) => console.log(error));
    }

    const handleTrack = (event: any) => {
        console.log("Handling Track", socketRefAudio.current.id);
        
        event.streams[0].getTracks().forEach((track: any) => {
            remote.addTrack(track);
        });
    }

    const handleAddStream = (event: any) => {
        console.log("Handling Add Stream", socketRefAudio.current.id);
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
        <Portal>
            <Modal
                visible={modal}
                onDismiss={() => setModal(false)}
            >
                <SafeAreaView>
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
                </SafeAreaView>
            </Modal>
        </Portal>
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