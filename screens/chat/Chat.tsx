import React, {useState, useRef, useEffect, useCallback} from 'react';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc'
import { GiftedChat } from 'react-native-gifted-chat';
import io from "socket.io-client";
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ShellNavigatorParamList } from '../../navigation';
import { WS } from '../../store/services';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';
import InCallManager from 'react-native-incall-manager';
import { View, StyleSheet } from 'react-native';
import { RequestCallModal } from './RequestCallModal';
import { AudioCall } from './AudioCall';
import { IconButton } from 'react-native-paper';

interface ChatProps {
    navigation: DrawerNavigationProp<ShellNavigatorParamList, 'Chat'>;
    route: any
}

export const Chat: React.FC<ChatProps> = (props) => {    
    const appState = useSelector((state: ApplicationState) => state);

    const peerRef = useRef<any>();
    const socketRef = useRef<any>();
    const otherUser = useRef<any>();
    const sendChannel = useRef<any>(); // Data channel
    const roomId = props.route.params.roomId;
    const [messages, setMessages] = useState<any>([]); // Chats between the peers will be stored here
    const socket = io(WS);
    
    const [requestModal, setRequestModal] = useState(false);
    const [requestModalText, setRequestModalText] = useState("");
    const [audioCallStarted, setAudioCallStarted] = useState(false);

    useEffect(() => {
        socketRef.current = socket.connect();
        socketRef.current.emit('join room', roomId);

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

        socketRef.current.on('request audio call', requestingAudioCall);
    }, [])

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
        .catch((error: any) => console.log('Error handling answer', error));
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
        InCallManager.start({media: 'audio', ringback: '_BUNDLE_'});
        InCallManager.setForceSpeakerphoneOn(true);
        InCallManager.setSpeakerphoneOn(true);

        const payload = {
            target: otherUser.current,
            caller: socketRef.current.id
        }
        socketRef.current.emit('request audio call', payload);
        setAudioCallStarted(true);
    }

    const requestingAudioCall = () => {
        InCallManager.startRingtone('_BUNDLE_');
        InCallManager.setForceSpeakerphoneOn(true);
        InCallManager.setSpeakerphoneOn(true);

        setRequestModal(true);
    }

    const acceptAudioCall = () => {
        InCallManager.stopRingtone();
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

    return (
        <View style={styles.screen}>
            <IconButton 
                icon="phone"
                onPress={requestAudioCall}
            />
            <GiftedChat 
                messages={messages}
                onSend={messages => sendMessage(messages)}
                user={{
                    _id: appState.auth?.user ?? ''
                }}
            />
            {
                audioCallStarted ? <AudioCall
                    peerConnection={peerRef.current}
                    socketConnection={socketRef.current}
                    otherUser={otherUser.current}
                    roomId={roomId}
                    closeAudioCall={() => setAudioCallStarted(false)}
                />
                : null
            }
            <RequestCallModal 
                text={requestModalText}
                visible={requestModal}
                onAccept={acceptAudioCall}
                onCancel={rejectAudioCall}
                closeModal={() => setRequestModal(false)}
            />    
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%',
    }
})