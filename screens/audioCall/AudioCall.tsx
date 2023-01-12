import React, { useEffect, useRef, useState } from "react"
import { Text, View, StyleSheet, SafeAreaView, Modal } from "react-native"
import { IconButton, Portal } from "react-native-paper"
import { mediaDevices, MediaStream, RTCView, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from "react-native-webrtc";
import InCallManager from 'react-native-incall-manager';
import { io, Manager } from "socket.io-client";
import { API, WS } from "../../store/services";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { styles } from './style';

interface AudioCallProps {
    peerConnection: any;
    socketConnection: any;
    otherUser: string;
    roomId: string;
    appointment: any;
    closeAudioCall: () => void;
}

export const AudioCall: React.FC<AudioCallProps> = (props) => {
    const appState = useSelector((state: ApplicationState) => state);
    
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const [localStream, setLocalStream] = useState<MediaStream>();
    const manager = new Manager(API+'/socket.io/socket.io.js');
    const socketAudio = manager.socket('/');
    const peerRefAudio = useRef<any>();
    const otherPeer = useRef<any>();
    const socketRefAudio = useRef<any>();
    const otherUserAudio = useRef<any>();
    const called = useRef<boolean>(false);

    const [modal, setModal] = useState(true);
    
    const [counterText, setCounterText] = useState("Llamando...");
    const [counter, setCounter] = useState('00:00');
    const [callStarted, setCallStarted] = useState(false);
    const counterIntervalId = useRef<any>();

    const [muteAudio, setMute] = useState(false);
    const [speaker, setSpeaker] = useState(false);
    
    const remote = new MediaStream(undefined);
    
    useEffect(() => {    

        InCallManager.start({media: 'audio'})
        socketRefAudio.current = socketAudio.connect();
        socketRefAudio.current.emit('join room', props.roomId+'Audio');

        socketRefAudio.current.on('other user', (userId: string) => {
            callUser(userId);
            otherUserAudio.current = userId;
            setCounterText('Conectando...');
        });

        socketRefAudio.current.on('user joined', (userId: string) => {
            otherUserAudio.current = userId;
            setCounterText('Conectando...');
        });

        socketRefAudio.current.on('offer', handleOffer);

        socketRefAudio.current.on('answer', handleAnswer);

        socketRefAudio.current.on('offer-other', handleOtherOffer);

        socketRefAudio.current.on('answer-other', handleOtherAnswer);

        socketRefAudio.current.on('ice-candidate', handleNewICECandidateMsg);

        socketRefAudio.current.on('ice-candidate-other', handleOtherNewICECandidateMsg);

        socketRefAudio.current.on('other user left', handleUserLeft);

        props.socketConnection.on('accept audio call', audioCallAccepted);

        props.socketConnection.on('reject audio call', audioCallRejected);

    }, []);

    useEffect(() => {
        let local = peerRefAudio.current?.getLocalStreams()[0];
        if(!local){
            local = otherPeer.current?.getLocalStreams()[0]
        }

        if(!local) return;

        local.getTracks()[0].enabled = !muteAudio;        
    }, [muteAudio]);

    useEffect(() => {
        InCallManager.setForceSpeakerphoneOn(speaker);
    }, [speaker]);

    const callUser = (userId: string) => {
        called.current = true;
        console.log("Initiated an audio call", socketRefAudio.current.id);
        peerRefAudio.current = Peer(userId);

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
        }).then((local: any) => {
            setLocalStream(local);

            peerRefAudio.current.addStream(local);

            local?.getTracks().forEach((track: any) => {             
                peerRefAudio.current.getLocalStreams()[0].addTrack(track);
            });
        });
    }

    const addTrack = (userId: string) => {  
        otherPeer.current = OtherPeer(userId);

        mediaDevices.getUserMedia({
            audio: !muteAudio,
        }).then((local: any) => {
            setLocalStream(local);

            otherPeer.current.addStream(local);
            
            local?.getTracks().forEach((track: any) => {             
                otherPeer.current.getLocalStreams()[0].addTrack(track);
            });
        });
    }

    const handleOffer = (incoming: any) => {        
        console.log('Handling offer', socketRefAudio.current.id);
            
        peerRefAudio.current = Peer(incoming.caller);

        const desc = new RTCSessionDescription(incoming.sdp);
        
        peerRefAudio.current.setRemoteDescription(desc)
        .then(() => {         
            addTrack(incoming.caller);   
        })
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
        .then(() => { counterStart() })
        .catch((error: any) => console.log('Error handling answer', error));
    }

    const handleNegotiationNeeded = (props: any, userId?: string) => {
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

    const handleOtherOffer = (incoming: any) => {        
        console.log('Handling other offer', socketRefAudio.current.id);
            
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
                caller: socketRefAudio.current.id,
                sdp: otherPeer.current.localDescription
            }
            socketRefAudio.current.emit('answer-other', payload);
        })
    }

    const handleOtherAnswer = (message: any) => {
        console.log('Handling other answer', socketRefAudio.current.id);
         
        const description = new RTCSessionDescription(message.sdp);
        otherPeer.current.setRemoteDescription(description)
        .then(() => { counterStart() })
        .catch((error: any) => console.log('Error handling answer', error));
    }

    const handleOtherNegotiationNeeded = (props: any, userId?: string) => {
        console.log('Handling other negotiation needed', socketRefAudio.current.id);
                
        otherPeer.current.createOffer()
        .then((offer: any) => {
            return otherPeer.current.setLocalDescription(offer)
        })
        .then(() => {            
            const payload = {
                target: userId,
                caller: socketRefAudio.current.id,
                sdp: otherPeer.current.localDescription
            };            
            socketRefAudio.current.emit('offer-other', payload);
        }).catch((error: any) => {
            console.log('Error handling negotiation needed', error);
        });
        
    }

    const handleOtherICECandidateEvent = (event: any) => {
        if(event.candidate){
            const payload = {
                target: otherUserAudio.current,
                candidate: event.candidate
            }
            socketRefAudio.current.emit('ice-candidate-other', payload);
        }
    }

    const handleOtherNewICECandidateMsg = (incoming: any) => {
        const candidate = new RTCIceCandidate(incoming);
        otherPeer.current.addIceCandidate(candidate)
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
        setRemoteStream(undefined);
        setLocalStream(undefined);
        peerRefAudio.current?.close();
        otherPeer.current?.close();
        InCallManager.stopRingback();
        socketRefAudio.current.disconnect();
        otherUserAudio.current = null;
        props.closeAudioCall();
    }

    const handleUserLeft = (event: any) => {
        setCallStarted(false);
        setCounterText("Salió de la llamada")  
        clearInterval(counterIntervalId.current);       
        setTimeout(() => {
            setRemoteStream(undefined);
            setLocalStream(undefined);
            peerRefAudio.current.close();
            otherPeer.current.close();
            InCallManager.stopRingback();
            socketRefAudio.current.disconnect();
            otherUserAudio.current = null;
            props.closeAudioCall();
        }, 500);
    }

    return (
        <Portal>
            <Modal
                visible={modal}
                onDismiss={() => setModal(false)}
            >
                <SafeAreaView>
                    <View style={styles.screen}>
                        <View>
                            <IconButton
                                icon="account-circle-outline"
                                color="#F38673"
                                size={150}
                                style={styles.centerButton}
                            />
                            <Text style={styles.personName}>{ appState.auth?.user?.hasOwnProperty('patient') ? `${props.appointment.psychologist.firstName} ${props.appointment.psychologist.lastName}` : `${props.appointment.patient.firstName} ${props.appointment.patient.lastName}` }</Text>
                            <Text style={{textAlign: 'center', paddingTop: 10}}>{ callStarted ? counter : counterText}</Text>
                        </View>
                        <View style={styles.middleButtons}>
                            <View style={styles.middleButtonView}>
                                <IconButton
                                    icon="microphone-off"
                                    color="white"
                                    style={muteAudio ? styles.middleButtonActive : styles.middleButton}
                                    size={40}
                                    onPress={() => setMute(!muteAudio)}
                                />
                                <Text style={styles.middleButtonText}>Mute</Text>
                            </View>
                            <View style={styles.middleButtonView}>
                                <IconButton
                                    icon="volume-high"
                                    color="white"
                                    style={speaker ? styles.middleButtonActive : styles.middleButton}
                                    size={40}
                                    onPress={() => setSpeaker(!speaker)}
                                />
                                <Text style={styles.middleButtonText}>Speaker</Text>
                            </View>
                            <View style={styles.middleButtonView}>
                                <IconButton
                                    icon="video-outline"
                                    color="white"
                                    style={styles.middleButton}
                                    size={40}
                                />
                                <Text style={styles.middleButtonText}>Video Call</Text>
                            </View>
                        </View>
                        <View style={styles.footerButtons}>
                            <IconButton
                                icon="phone-hangup-outline"
                                color="white"
                                style={styles.hangupButton}
                                size={40}
                                onPress={() => audioCallRejected()}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </Portal>
    )
}

