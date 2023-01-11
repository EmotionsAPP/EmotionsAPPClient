import React, {useState, useRef, useEffect} from 'react';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc'
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import io from "socket.io-client";
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ShellNavigatorParamList } from '../../navigation';
import { WS } from '../../store/services';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';
import InCallManager from 'react-native-incall-manager';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { RequestModal } from './RequestCallModal';
import { AudioCall } from '../audioCall/AudioCall';
import { IconButton, Menu, Modal, Portal } from 'react-native-paper';
import { MessageBubble } from './MessageBubble';
import { useIsFocused } from '@react-navigation/native';
import { styles } from './style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VideoCall } from '../videoCall/VideoCall';
import { traduct } from '../../App';

interface ChatProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'Chat'>;
    route: any;
}

export const Chat: React.FC<ChatProps> = (props) => {    
    const appState = useSelector((state: ApplicationState) => state);

    const peerRef = useRef<any>();
    const socketRef = useRef<any>();
    const otherUser = useRef<any>();
    const sendChannel = useRef<any>(); // Data channel
    const roomId = props.route.params.roomId;
    const [messages, setMessages] = useState<any>([]); // Chats between the peers will be stored here
    
    const [requestModal, setRequestModal] = useState(false);
    const [requestModalText, setRequestModalText] = useState("");
    const [requestModalButtons, setRequestModalButtons] = useState<string[]>([]);
    const [requestModalCanDismiss, setRequestModalCanDismiss] = useState(false);
    const [requestModalOnOk, setRequestModalOnOk] = useState<() => void>(() => () => {});
    const [requestModalOnCancel, setRequestModalOnCancel] = useState<() => void>(() => () => {});
    const [requestModalOnAccept, setRequestModalOnAccept] = useState<() => void>(() => () => {});

    const [waitingModal, setWaitingModalVisible] = useState(false);
    const [waitingModalText, setWaitingModalText] = useState(traduct("waitingForSomebody")+"...");
    
    const [audioCallStarted, setAudioCallStarted] = useState(false);
    const [videoCallStarted, setVideoCallStarted] = useState(false);
    
    const[callMenu, setCallMenuVisible] = useState(false);
    const openCallMenu = () => setCallMenuVisible(true);
    const closeCallMenu = () => setCallMenuVisible(false);

    const isFocused = useIsFocused();

    useEffect(() => {
        props.navigation.addListener('beforeRemove', (e: any) => {
            e.preventDefault();

            if(otherUser.current) {
                setRequestModalButtons(['cancel', 'accept']);
                setRequestModalText(traduct("wantEndMeeting"));
                setRequestModalCanDismiss(false);
        
                const cancel = () => () => {            
                    setRequestModal(false);
                }

                const accept = () => () => {            
                    setRequestModal(false);
                    socketRef.current.disconnect();
                    props.navigation.dispatch(e.data.action);
                }
        
                setRequestModalOnCancel(cancel);
                setRequestModalOnAccept(accept);
                setRequestModal(true);
            }else{
                props.navigation.dispatch(e.data.action);
            }

        });
    }, [])
    
    useEffect(() => {
        if(isFocused) {
            const socket = io(WS);
    
            socketRef.current = socket.connect();
    
            socketRef.current.emit('join room', roomId);

            setWaitingModalVisible(true);
            setWaitingModalText(traduct("waitingForSomebody")+"...");

            socketRef.current.on('other user', (userId: string) => {
                callUser(userId);
                setWaitingModalText(traduct("connecting")+'...');
                otherUser.current = userId;
            });
    
            socketRef.current.on('user joined', (userId: string) => {
                setWaitingModalText(traduct("connecting")+'...');
                otherUser.current = userId;
            });
    
            socketRef.current.on('offer', handleOffer);
    
            socketRef.current.on('answer', handleAnswer);
    
            socketRef.current.on('ice-candidate', handleNewICECandidateMsg);
    
            socketRef.current.on('request audio call', requestingAudioCall);

            socketRef.current.on('request video call', requestingVideoCall);
    
            socketRef.current.on('other user left', handleUserLeft);
    
            setRequestModal(false);
            setMessages([]);
    
            const msg = {
                _id: 1,
                text: traduct("chatAdvice"),
                createdAt: new Date(),
                system: true,
                user: {
                    _id: 'system'
                }
            }
            setMessages((previousMessages: any) => GiftedChat.append(previousMessages, [msg]));
        }

    }, [isFocused])

    const callUser = (userId: string) => {
        console.log("Initiated a call", socketRef.current.id);
        peerRef.current = Peer(userId);
        
        sendChannel.current = peerRef.current.createDataChannel('sendChannel');
        sendChannel.current.onmessage = handleReceiveMessage;        
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

    const handleOffer = (incoming: any) => {
        console.log('Handling offer', socketRef.current.id);
        
        peerRef.current = Peer();
        peerRef.current.ondatachannel = (event: any) => {
            sendChannel.current = event.channel;
            sendChannel.current.onmessage = handleReceiveMessage;
            setWaitingModalVisible(false);
            console.log('Connection established');
        }

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
        .then(() => {
            setWaitingModalVisible(false);
        })
        .catch((error: any) => {
            setWaitingModalVisible(true);
            console.log('Error handling answer', error)
        });
    }

    const handleReceiveMessage = (event: any) => {
        console.log('Message received from peer', event.data);
        const msg = [{
            _id: Math.random().toString(),
            text: event.data,
            createdAt: new Date(),
            user: {
                _id: 2
            }
        }];
        setMessages((previousMessages: any) => GiftedChat.append(previousMessages, msg));
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

    const sendMessage = (messages: any) => {
        sendChannel.current.send(messages[0].text);
        setMessages((previousMessages: any) => GiftedChat.append(previousMessages, messages));
    }

    const requestAudioCall = () => {
        InCallManager.startRingback('_BUNDLE_');
        closeCallMenu();

        const payload = {
            target: otherUser.current,
            caller: socketRef.current.id
        }
        socketRef.current.emit('request audio call', payload);
        setAudioCallStarted(true);
    }

    const requestVideoCall = () => {
        closeCallMenu();

        const payload = {
            target: otherUser.current,
            caller: socketRef.current.id
        }
        socketRef.current.emit('request video call', payload);
        setVideoCallStarted(true);
    }

    const requestingAudioCall = () => {
        InCallManager.startRingtone('_BUNDLE_');
        InCallManager.setForceSpeakerphoneOn(true);
        InCallManager.setSpeakerphoneOn(true);

        setRequestModalButtons(['cancel', 'accept']);
        setRequestModalText(traduct("incomingAudiocall"));
        setRequestModalCanDismiss(false);

        const cancel = () => () => {    
            rejectAudioCall();        
        }

        const accept = () => () => {            
            acceptAudioCall(); 
        }

        setRequestModalOnCancel(cancel);
        setRequestModalOnAccept(accept);
        setRequestModal(true);
    }

    const requestingVideoCall = () => {
        InCallManager.startRingtone('_BUNDLE_');
        InCallManager.setForceSpeakerphoneOn(true);
        InCallManager.setSpeakerphoneOn(true);

        setRequestModalButtons(['cancel', 'accept']);
        setRequestModalText(traduct("incomingVideocall"));
        setRequestModalCanDismiss(false);

        const cancel = () => () => {    
            rejectVideoCall();        
        }

        const accept = () => () => {            
            acceptVideoCall();
        }

        setRequestModalOnCancel(cancel);
        setRequestModalOnAccept(accept);
        setRequestModal(true);
    }

    const acceptAudioCall = () => {
        InCallManager.stopRingtone();
        InCallManager.start({media: 'audio'});
        const payload = {
            target: otherUser.current,
            caller: socketRef.current.id
        }
        socketRef.current.emit('accept audio call', payload);
        setAudioCallStarted(true);
        setRequestModal(false);
    }

    const rejectAudioCall = () => {
        InCallManager.stopRingtone();
        const payload = {
            target: otherUser.current,
            caller: socketRef.current.id
        }
        socketRef.current.emit('reject audio call', payload);
        setAudioCallStarted(false);
        setRequestModal(false);
    }

    const acceptVideoCall = () => {
        InCallManager.stopRingtone();
        InCallManager.start({media: 'audio'});
        const payload = {
            target: otherUser.current,
            caller: socketRef.current.id
        }
        socketRef.current.emit('accept video call', payload);
        setVideoCallStarted(true);
        setRequestModal(false);
    }

    const rejectVideoCall = () => {
        InCallManager.stopRingtone();
        const payload = {
            target: otherUser.current,
            caller: socketRef.current.id
        }
        socketRef.current.emit('reject video call', payload);
        setVideoCallStarted(false);
        setRequestModal(false);
    }

    const handleUserLeft = (event: any) => {
        setRequestModalButtons(['ok']);
        setRequestModalText(traduct("otherUserGotOut"));
        setRequestModalCanDismiss(false);

        const ok = () => () => {            
            setRequestModal(false);
            socketRef.current.disconnect()
            otherUser.current = null;
            props.navigation.goBack();
        }

        setRequestModalOnOk(ok);
        setRequestModal(true);
    }

    const cancelJoin = () => {
        setRequestModal(false);
        socketRef.current.disconnect();
        otherUser.current = null;
        props.navigation.goBack();
        setWaitingModalVisible(false);
    }

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <IconButton 
                    icon='chevron-left'
                    onPress={() => props.navigation.goBack()}
                    size={30}
                />
                <View style={styles.headerTitle}>
                    <IconButton
                        icon="account-circle-outline"
                        color="#F38673"
                        size={40}
                    />
                    <Text style={styles.headerName}>{ appState.auth?.user?.hasOwnProperty('patient') ? `${props.route.params.appointment.psychologist.firstName} ${props.route.params.appointment.psychologist.lastName}` : `${props.route.params.appointment.patient.firstName} ${props.route.params.appointment.patient.lastName}` }</Text>
                </View>
            </View>
            <GiftedChat 
                messages={messages}
                onSend={messages => sendMessage(messages)}
                alignTop={true}
                alwaysShowSend={true}
                renderBubble={(props) => {
                    return <MessageBubble {...props} />
                }}
                renderSend={(props) => {
                    return <Send {...props} containerStyle={styles.sendButton}>
                            <IconButton
                                icon="send"
                                color="#DB6551"
                            />
                        </Send>
                }}
                renderAvatar={() => null}
                placeholder={traduct("writeAMessage")+"..."}
                showAvatarForEveryMessage={true}
                textInputProps={
                    {
                        placeholderTextColor: '#DB6551',
                        style: styles.textInput
                    }
                }
                renderSystemMessage={(props) => {
                    return (
                        <View style={styles.systemMessageView}>
                            <IconButton 
                                icon="lock"
                                size={35}
                                color="#6b6b6b"
                            />
                            <Text style={{width: '80%', color: '#6b6b6b', textAlign: 'center'}}>{props.currentMessage?.text}</Text>
                        </View>
                    )
                }}
                renderActions={(props) => {
                    return (
                        <Menu
                            visible={callMenu}
                            onDismiss={closeCallMenu}
                            anchor={
                                <View style={styles.sendButton}>
                                    <IconButton 
                                        icon="phone"
                                        onPress={openCallMenu}
                                        color="#DB6551"
                                        />
                                </View>
                            }
                            style={{paddingBottom: 90}}
                        >
                            <Menu.Item 
                                icon={({ color, size }) => (
                                    <MaterialCommunityIcons
                                        name="phone"
                                        color="#DB6551"
                                        size={size}
                                    />
                                )}
                                title={traduct("audiocall")} 
                                titleStyle={{color: '#DB6551'}}
                                onPress={() => requestAudioCall()}
                            ></Menu.Item>
                            <Menu.Item 
                                icon={({ color, size }) => (
                                    <MaterialCommunityIcons
                                        name="video"
                                        color="#DB6551"
                                        size={size}
                                    />
                                )} 
                                title={traduct("videocall")} 
                                titleStyle={{color: '#DB6551'}}
                                onPress={() => requestVideoCall()}
                            ></Menu.Item>
                        </Menu>
                    )
                }}
                renderInputToolbar={(props) => {
                    return (
                        <InputToolbar {...props} containerStyle={styles.composerView}/>
                    )
                }}
                user={{
                    _id: appState.auth?.user ?? ''
                }}
            />
            {
                audioCallStarted ? <AudioCall
                    peerConnection={peerRef.current}
                    socketConnection={socketRef.current}
                    otherUser={otherUser.current}
                    appointment={props.route.params.appointment}
                    roomId={roomId}
                    closeAudioCall={() => setAudioCallStarted(false)}
                />
                : null
            }
            {
                videoCallStarted ? <VideoCall
                    peerConnection={peerRef.current}
                    socketConnection={socketRef.current}
                    otherUser={otherUser.current}
                    appointment={props.route.params.appointment}
                    roomId={roomId}
                    closeVideoCall={() => setVideoCallStarted(false)}
                />
                : null
            }
            <RequestModal 
                text={requestModalText}
                visible={requestModal}
                onAccept={requestModalOnAccept}
                onCancel={requestModalOnCancel}
                onOk={requestModalOnOk}
                closeModal={() => setRequestModal(false)}
                canDismiss={requestModalCanDismiss}
                buttons={requestModalButtons}
            /> 

            <Portal>
                <Modal 
                    visible={waitingModal}
                    dismissable={false}
                    style={styles.waitingModal}
                    contentContainerStyle={styles.waitingModalContainer}
                >
                    <View style={styles.waitingModalView}>
                        <ActivityIndicator size="small" color="#DB6551" />
                        <Text style={styles.waitingModalText}>{waitingModalText}</Text>
                    </View>
                    <Pressable 
                        onPress={() => {cancelJoin()}}
                        style={styles.okButton}
                    >
                        <Text style={styles.okButtonText}>{traduct("cancel")}</Text>
                    </Pressable>
                </Modal>
            </Portal>
        </View>
    )
}
