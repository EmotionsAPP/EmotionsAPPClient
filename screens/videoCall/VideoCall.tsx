import React, { useEffect, useRef, useState } from "react"
import { Text, View, StyleSheet, SafeAreaView, Modal, KeyboardAvoidingView } from "react-native"
import { IconButton, Portal } from "react-native-paper"
import { mediaDevices, MediaStream, RTCView, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from "react-native-webrtc";
import InCallManager from 'react-native-incall-manager';
import { io, Manager } from "socket.io-client";
import { API, WS } from "../../store/services";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { styles } from './style';

interface VideoCallProps {
    peerConnection: any;
    socketConnection: any;
    otherUser: string;
    roomId: string;
    appointment: any;
    closeVideoCall: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = (props) => {
    const appState = useSelector((state: ApplicationState) => state);
    
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const [localStream, setLocalStream] = useState<MediaStream>();
    const manager = new Manager(API+'/socket.io/socket.io.js');
    const socketVideo = manager.socket('/');
    const peerRefVideo = useRef<any>();
    const otherPeer = useRef<any>();
    const socketRefVideo = useRef<any>();
    const otherUserVideo = useRef<any>();
    const called = useRef<boolean>(false);

    const [modal, setModal] = useState(true);
    
    const [counterText, setCounterText] = useState("Llamando...");
    const [counter, setCounter] = useState('00:00');
    const [callStarted, setCallStarted] = useState(false);
    const counterIntervalId = useRef<any>();

    const [muteAudio, setMute] = useState(false);
    const [frontCamera, setFrontCamera] = useState(false);

    
    const remote = new MediaStream(undefined);
    
    useEffect(() => {    
        InCallManager.start({media: 'audio'});
        InCallManager.setForceSpeakerphoneOn(true);
        socketRefVideo.current = socketVideo.connect();
        socketRefVideo.current.emit('join room', props.roomId+'Video');

        socketRefVideo.current.on('other user', (userId: string) => {
            callUser(userId);
            otherUserVideo.current = userId;
            setCounterText('Conectando...');
        });

        socketRefVideo.current.on('user joined', (userId: string) => {
            otherUserVideo.current = userId;
            setCounterText('Conectando...');
        });

        socketRefVideo.current.on('offer', handleOffer);

        socketRefVideo.current.on('answer', handleAnswer);

        socketRefVideo.current.on('offer-other', handleOtherOffer);

        socketRefVideo.current.on('answer-other', handleOtherAnswer);

        socketRefVideo.current.on('ice-candidate', handleNewICECandidateMsg);

        socketRefVideo.current.on('ice-candidate-other', handleOtherNewICECandidateMsg);

        socketRefVideo.current.on('other user left', handleUserLeft);

        props.socketConnection.on('accept video call', videoCallAccepted);

        props.socketConnection.on('reject video call', videoCallRejected);

    }, []);

    useEffect(() => {
        let local = peerRefVideo.current?.getLocalStreams()[0];
        if(!local){
            local = otherPeer.current?.getLocalStreams()[0]
        }

        if(!local) return;

        local.getTracks().find((track: any) => track.kind == 'audio').enabled = !muteAudio;        
    }, [muteAudio]);

    useEffect(() => {
        let local = peerRefVideo.current?.getLocalStreams()[0];
        if(!local){
            local = otherPeer.current?.getLocalStreams()[0]
        }

        if(!local) return;
        
        local.getTracks().find((track: any) => track.kind == 'video')._switchCamera();      
    }, [frontCamera]);

    const callUser = (userId: string) => {
        called.current = true;
        console.log("Initiated an video call", socketRefVideo.current.id);
        peerRefVideo.current = Peer(userId);

        addStream();
    }

    const counterStart = () => {
        let counterSeconds = 0;
        let counterMinutes = 0;
        let counterHours = 0;

        counterIntervalId.current = setInterval(() => {
            setCounter(`${counterHours < 10 ? '0'+counterHours : counterHours}:${counterMinutes < 10 ? '0'+counterMinutes : counterMinutes}:${counterSeconds < 10 ? '0'+counterSeconds : counterSeconds}`);
            counterSeconds++;
            if(Number(counterSeconds) > 59) {
                counterMinutes++
                if(Number(counterMinutes) > 59) {
                    counterHours++
                    counterMinutes = 0;
                }
                counterSeconds = 0;
            }                          
        }, 1000);
        
        setCallStarted(true);
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
        peer.onnegotiationneeded = (props) => handleNegotiationNeeded(props, userId);
        peer.ontrack = handleTrack;
        peer.onaddstream = handleAddStream;

        return peer;
    }

    const OtherPeer = (userId?: string) => {
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

        peer.onicecandidate = handleOtherICECandidateEvent;
        peer.onnegotiationneeded = (props) => handleOtherNegotiationNeeded(props, userId);
        peer.ontrack = handleTrack;
        peer.onaddstream = handleAddStream;

        return peer;
    }

    const addStream = () => {
        mediaDevices.getUserMedia({
            audio: !muteAudio,
            video: true
        }).then((local: any) => {
            setLocalStream(local);

            peerRefVideo.current.addStream(local);

            local?.getTracks().forEach((track: any) => {             
                peerRefVideo.current.getLocalStreams()[0].addTrack(track);
            });
        });
    }

    const addTrack = (userId: string) => {  
        otherPeer.current = OtherPeer(userId);

        mediaDevices.getUserMedia({
            audio: !muteAudio,
            video: true
        }).then((local: any) => {
            setLocalStream(local);

            otherPeer.current.addStream(local);
            
            local?.getTracks().forEach((track: any) => {             
                otherPeer.current.getLocalStreams()[0].addTrack(track);
            });
        });
    }

    const handleOffer = (incoming: any) => {        
        console.log('Handling offer', socketRefVideo.current.id);
            
        peerRefVideo.current = Peer(incoming.caller);

        const desc = new RTCSessionDescription(incoming.sdp);
        
        peerRefVideo.current.setRemoteDescription(desc)
        .then(() => {         
            addTrack(incoming.caller);   
        })
        .then(() => {            
            return peerRefVideo.current.createAnswer()
        }).then((answer: any) => {            
            return peerRefVideo.current.setLocalDescription(answer)
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRefVideo.current.id,
                sdp: peerRefVideo.current.localDescription
            }
            socketRefVideo.current.emit('answer', payload);
        })
    }

    const handleAnswer = (message: any) => {
        console.log('Handling answer', socketRefVideo.current.id);
         
        const description = new RTCSessionDescription(message.sdp);
        peerRefVideo.current.setRemoteDescription(description)
        .then(() => { counterStart() })
        .catch((error: any) => console.log('Error handling answer', error));
    }

    const handleNegotiationNeeded = (props: any, userId?: string) => {
        console.log('Handling negotiation needed', socketRefVideo.current.id);
                
        peerRefVideo.current.createOffer()
        .then((offer: any) => {
            return peerRefVideo.current.setLocalDescription(offer)
        })
        .then(() => {            
            const payload = {
                target: userId,
                caller: socketRefVideo.current.id,
                sdp: peerRefVideo.current.localDescription
            };            
            socketRefVideo.current.emit('offer', payload);
        }).catch((error: any) => {
            console.log('Error handling negotiation needed', error);
        });
        
    }

    const handleICECandidateEvent = (event: any) => {
        if(event.candidate){
            const payload = {
                target: otherUserVideo.current,
                candidate: event.candidate
            }
            socketRefVideo.current.emit('ice-candidate', payload);
        }
    }

    const handleNewICECandidateMsg = (incoming: any) => {
        const candidate = new RTCIceCandidate(incoming);
        peerRefVideo.current.addIceCandidate(candidate)
        .catch((error: any) => console.log(error));
    }

    const handleOtherOffer = (incoming: any) => {        
        console.log('Handling other offer', socketRefVideo.current.id);
            
        otherPeer.current = OtherPeer(incoming.caller);

        const desc = new RTCSessionDescription(incoming.sdp);
        
        otherPeer.current.setRemoteDescription(desc)
        .then(() => {         
        })
        .then(() => {            
            return otherPeer.current.createAnswer()
        }).then((answer: any) => {            
            return otherPeer.current.setLocalDescription(answer)
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRefVideo.current.id,
                sdp: otherPeer.current.localDescription
            }
            socketRefVideo.current.emit('answer-other', payload);
        })
    }

    const handleOtherAnswer = (message: any) => {
        console.log('Handling other answer', socketRefVideo.current.id);
         
        const description = new RTCSessionDescription(message.sdp);
        otherPeer.current.setRemoteDescription(description)
        .then(() => { counterStart() })
        .catch((error: any) => console.log('Error handling answer', error));
    }

    const handleOtherNegotiationNeeded = (props: any, userId?: string) => {
        console.log('Handling other negotiation needed', socketRefVideo.current.id);
                
        otherPeer.current.createOffer()
        .then((offer: any) => {
            return otherPeer.current.setLocalDescription(offer)
        })
        .then(() => {            
            const payload = {
                target: userId,
                caller: socketRefVideo.current.id,
                sdp: otherPeer.current.localDescription
            };            
            socketRefVideo.current.emit('offer-other', payload);
        }).catch((error: any) => {
            console.log('Error handling negotiation needed', error);
        });
        
    }

    const handleOtherICECandidateEvent = (event: any) => {
        if(event.candidate){
            const payload = {
                target: otherUserVideo.current,
                candidate: event.candidate
            }
            socketRefVideo.current.emit('ice-candidate-other', payload);
        }
    }

    const handleOtherNewICECandidateMsg = (incoming: any) => {
        const candidate = new RTCIceCandidate(incoming);
        otherPeer.current.addIceCandidate(candidate)
        .catch((error: any) => console.log(error));
    }

    const handleTrack = (event: any) => {
        console.log("Handling Track", socketRefVideo.current.id);
        
        event.streams[0].getTracks().forEach((track: any) => {
            remote.addTrack(track);
        });
    }

    const handleAddStream = (event: any) => {
        console.log("Handling Add Stream", socketRefVideo.current.id);
        setRemoteStream(event.stream);

    }
    
    const videoCallAccepted = () => {
        InCallManager.stopRingback();
    }

    const videoCallRejected = () => {
        setRemoteStream(undefined);
        setLocalStream(undefined);
        peerRefVideo.current?.close();
        otherPeer.current?.close();
        InCallManager.stopRingback();
        socketRefVideo.current.disconnect();
        otherUserVideo.current = null;
        props.closeVideoCall();
    }

    const handleUserLeft = (event: any) => {
        setCallStarted(false);
        setCounterText("Salió de la llamada")  
        clearInterval(counterIntervalId.current);       
        setTimeout(() => {
            setRemoteStream(undefined);
            setLocalStream(undefined);
            peerRefVideo.current.close();
            otherPeer.current.close();
            InCallManager.stopRingback();
            socketRefVideo.current.disconnect();
            otherUserVideo.current = null;
            props.closeVideoCall();
        }, 500);
    }

    return (
        <Portal>
            <Modal
                visible={modal}
                onDismiss={() => setModal(false)}
            >
                <SafeAreaView>
                    {remoteStream && (
                        <RTCView
                            streamURL={remoteStream?.toURL()}
                            style={styles.stream}
                            objectFit="cover"
                            mirror
                        />
                    )}
                    {localStream && (
                        <RTCView
                            streamURL={localStream?.toURL()}
                            style={styles.stream}
                            objectFit="cover"
                            mirror
                        />
                    )}
                </SafeAreaView>
                <View style={styles.footerButtons}>
                    <IconButton
                        icon="microphone-off"
                        color="white"
                        style={muteAudio ? styles.middleButtonActive : styles.middleButton}
                        size={40}
                        onPress={() => setMute(!muteAudio)}
                    />
                    <IconButton
                        icon="phone-hangup-outline"
                        color="white"
                        style={styles.hangupButton}
                        size={40}
                        onPress={() => videoCallRejected()}
                    />
                    <IconButton
                        icon="camera-flip-outline"
                        color="white"
                        style={frontCamera ? styles.middleButtonActive : styles.middleButton}
                        size={40}
                        onPress={() => setFrontCamera(!frontCamera)}
                    />
                </View>
            </Modal>
        </Portal>
    )
}

