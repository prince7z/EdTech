import React, { useState, useRef } from 'react';
import Collaboration from './Collaboration';
import menu from './menu.jsx';
// import menu from menu.jsx

const styles = {
    messageBubble: {
        width: 'fit-content',
        // maxWidth: '80%',
        backgroundColor: '#4CAF50',  // Change the background color if needed
        padding: '8px',
        marginBottom: '2px',
        borderRadius: '6px',
        fontSize: '13px',
        wordBreak: 'break-word',
        color: 'white',
        marginLeft: '10px',
        position: 'relative',
        right: '2px',
        marginBottom: '5px',
        // overflowWrap: 'break-word',
    },
};

function Right() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messageContainerRef = useRef(null); // Reference to the message container to scroll
    const [showCollaboration, setShowCollaboration] = React.useState(false);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && message.trim() !== '') {
            // Add new message to the state
            setMessages((prevMessages) => [...prevMessages, message]);
            setMessage(''); // Clear input field after sending message
        }
    };

    // Automatically scroll to the bottom whenever the messages change
    React.useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div style={{
            width: '22.1vw',
            height: '82.5vh',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            fontSize: '25px',
            backgroundColor: '#1e1e1e',
            borderLeft: '1px solid gray',
        }}>
            <div style={{
                width: '100%',
                height: '45vh',
                display: 'flex',
                alignContent: 'start',
                justifyContent: 'end',
                flexDirection: 'column',
                boxSizing: 'border-box',
                padding: '5px',
                backgroundColor: '#131618',
                borderBottom: '1px solid gray',
            }}>
                <div
                    id="message-container"
                    ref={messageContainerRef} // Attach the ref here
                    style={{
                        maxWidth: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        overflow: 'scroll',
                        scrollbarWidth: 'none',
                        // padding: '4px',
                        gap: '4px',
                        
                    }}
                >
                    {/* Render messages from state */}
                    {messages.map((msg, index) => (
                        <div key={index} style={styles.messageBubble}>
                            {msg}
                        </div>
                    ))}
                </div>
                <div style={{
                    width: '100%',
                    height: '4.5vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left',
                    boxSizing: 'border-box',
                    borderRadius: '4px',
                    border: '1px solid gray',
                    // margin: '4px',
                    padding: '6px',
                    backgroundColor: '#191f22',
                    alignSelf: 'end',
                    marginTop: '5px',
                    marginBottom: '4px',
                }}>
                    <img
                        src="/paperclip-solid.svg"
                        alt="paperclip icon"
                        style={{
                            width: '14px',
                            height: '14px',
                            paddingLeft: '2px',
                            marginRight: '2px',
                            justifySelf: 'left'
                        }}
                    />
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            border: 'none',
                            outline: 'none',
                            width: '82%',
                            paddingLeft: '10px',
                            paddingRight: '4px',
                            backgroundColor: '#191f22',
                            color: 'white',
                        }}
                        placeholder="Type a message"
                    />
                    <img
                        src="/paper-plane-solid.svg"
                        alt="send icon"
                        style={{
                            width: '14px',
                            height: '14px',
                            paddingLeft: '2px'
                        }}
                    />
                </div>
            </div>

            <div style={{
                backgroundColor: '#131618',
                width: '100%',
                height: '19vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '4px',
                // alignItems: 'center',
                boxSizing: 'border-box',
                borderBottom: '1px solid gray',
            }}>
            <span style={{
                fontSize: '16px',
                letterSpacing: '0.5px',
                color: 'white',
                paddingLeft: '6px',
                paddingTop: '8px',
                paddingBottom: '8px',
                textAlign: 'left',
                fontFamily: 'sans-serif',
                }}>
                People Active
            </span>
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '4px',
                flexWrap: 'wrap',
                boxSizing: 'border-box',
                overflow: 'scroll',
                scrollbarWidth: 'none',
                padding: '4px 8px 8px 8px',
            }}>
                <button onClick={() => setShowCollaboration(!showCollaboration)} style={{ all: 'unset', textDecoration: 'none' }}>
                    <img src='/user-plus-solid.svg' alt='user' style={{
                        width: '45px',
                        height: '45px',
                        padding: '2px',
                        borderRadius: '50%',
                        marginRight: '8px',
                        marginBottom: '8px',
                        backgroundColor: '#d0d0d0',
                        cursor: 'pointer',
                    }} />
                </button>
                <img src='/user-solid.svg' alt='user' style={{
                    width: '45px',
                    height: '45px',
                    padding: '2px',
                    borderRadius: '50%',
                    marginRight: '8px',
                    marginBottom: '8px',
                    backgroundColor: '#d0d0d0',
                }}>  
                </img>

                <img src='/user-solid.svg' alt='user' style={{
                    width: '45px',
                    height: '45px',
                    padding: '2px',
                    borderRadius: '50%',
                    marginRight: '8px',
                    marginBottom: '8px',
                    backgroundColor: '#d0d0d0',
                }}>  
                </img>
                <img src='/user-solid.svg' alt='user' style={{
                    width: '45px',
                    height: '45px',
                    padding: '2px',
                    borderRadius: '50%',
                    marginRight: '8px',
                    marginBottom: '8px',
                    backgroundColor: '#d0d0d0',
                }}>  
                </img>          </div>
            </div>

            <div style={{
                backgroundColor: '#131618',
                width: '100%',
                height: '22.6vh',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                overflow: 'scroll',
                scrollbarWidth: 'none',
                borderBottom: '1px solid rgb(244, 245, 238)',
                justifyContent: 'center',
            }}>
                <div style={{
                    width: '40vh',
                    height: '20vh',
                    borderRadius: '4px',
                    border: '1px solid gray',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                }}>
                    <span style={{
                        fontSize: '16px',
                        letterSpacing: '0.5px',
                        color: 'white',
                        paddingLeft: '6px',
                        paddingTop: '8px',
                        position: 'absolute',
                        // left: '0',
                        top: '0',
                        textAlign: 'center',
                    }}>
                        Video Conference
                    </span>
                    <img src="/video-slash-solid.svg" alt="whiteboard" style={{
                        width: '25%',
                        height: '25%',
                        borderRadius: '4px',
                        backgroundColor: '#131618',
                    }} />
                     <img src="/volume-high-solid.svg" alt="whiteboard" style={{
                        width: '25%',
                        height: '25%',
                        borderRadius: '4px',
                        backgroundColor: '#131618',
                        position: 'relative',
                        left: '0',
                        bottom: '0',
                    }} />
                    <img src="/play-solid.svg" alt="whiteboard" style={{
                        width: '25%',
                        height: '25%',
                        borderRadius: '4px',
                        backgroundColor: '#131618',
                        position: 'relative',
                        left: '0',
                        bottom: '0',
                    }} />
                   
                </div>
            </div>
            {showCollaboration && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px gray',
                    zIndex: 1000,
                    minWidth: '260px'
                }}>
                    <Collaboration onCodeUpdate={(code) => {
                        // Handle code updates from collaboration
                        console.log('Code updated:', code);
                    }} />
                </div>
            )}
        </div>
        
    );
}

export default Right;
