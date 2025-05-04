import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { IconButton, Button, TextField, Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';

// Mock code snippets for simulation
const mockCodeSnippets = [
    '// Hello from collaborator!\nconsole.log("Let\'s build something amazing!");',
    'function greet() {\n  return "Hello from the other side!";\n}',
    '// Adding some new features\nconst newFeature = () => {\n  console.log("Feature added!");\n};',
    '// Bug fix\nconst fixBug = () => {\n  console.log("Bug fixed!");\n};'
];

// Mock socket for prototype
const mockSocket = {
    emit: (event, data) => {
        console.log(`Mock socket emit: ${event}`, data);
        // Simulate code changes from collaborator when host makes changes
        if (event === 'code-change' && data.roomId) {
            setTimeout(() => {
                const randomSnippet = mockCodeSnippets[Math.floor(Math.random() * mockCodeSnippets.length)];
                mockSocket.on('code-update')(randomSnippet);
            }, 2000);
        }
    },
    on: (event, callback) => {
        console.log(`Mock socket on: ${event}`);
        // Simulate other user joining
        if (event === 'user-joined') {
            setTimeout(() => {
                callback({ userId: 'user2', username: 'Collaborator' });
            }, 7000); // Increased to 7 seconds
        }
        // Simulate code updates
        if (event === 'code-update') {
            // Store the callback for later use
            mockSocket.codeUpdateCallback = callback;
        }
    },
    off: () => {},
    codeUpdateCallback: null
};

// Use mock socket for prototype
const socket = mockSocket;

function Collaboration({ onCodeUpdate, roomId: propRoomId }) {
    const [roomId, setRoomId] = useState(propRoomId || '');
    const [isHost, setIsHost] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState('');

    useEffect(() => {
        if (propRoomId) {
            joinRoom(propRoomId);
        }
    }, [propRoomId]);

    const createRoom = async () => {
        try {
            // Simulate room creation
            const mockRoomId = Math.random().toString(36).substring(7);
            setRoomId(mockRoomId);
            setIsHost(true);
            setShareLink(`${window.location.origin}/collaborate/${mockRoomId}`);
            socket.emit('join-room', mockRoomId);
            setIsConnected(true);
            
            // Add host to connected users
            setConnectedUsers([{ userId: 'host', username: 'You' }]);
            
            // Simulate other user joining after 7 seconds
            setTimeout(() => {
                setConnectedUsers(prev => [...prev, { userId: 'user2', username: 'Collaborator' }]);
                setLastUpdate('Collaborator joined the room');
                
                // Simulate initial code update from collaborator
                setTimeout(() => {
                    const initialCode = mockCodeSnippets[0];
                    onCodeUpdate(initialCode);
                    setLastUpdate('Collaborator made changes to the code');
                }, 1000);
            }, 7000);
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const joinRoom = (id) => {
        setRoomId(id);
        socket.emit('join-room', id);
        setIsConnected(true);
        setConnectedUsers([{ userId: 'user2', username: 'You' }]);
    };

    const handleCodeChange = (code) => {
        if (roomId) {
            socket.emit('code-change', { roomId, code });
            setLastUpdate('You made changes to the code');
        }
    };

    useEffect(() => {
        socket.on('code-update', (code) => {
            onCodeUpdate(code);
            setLastUpdate('Collaborator made changes to the code');
        });

        return () => {
            socket.off('code-update');
        };
    }, [onCodeUpdate]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
    };

    return (
        <Box sx={{ p: 2, minWidth: '300px' }}>
            {!roomId ? (
                <Button
                    variant="contained"
                    startIcon={<ShareIcon />}
                    onClick={createRoom}
                >
                    Start Collaboration
                </Button>
            ) : (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Collaboration Room
                        {isConnected && (
                            <CheckCircleIcon 
                                sx={{ 
                                    color: green[500], 
                                    fontSize: 20, 
                                    ml: 1,
                                    verticalAlign: 'middle'
                                }} 
                            />
                        )}
                    </Typography>
                    
                    {isHost && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                            <TextField
                                value={shareLink}
                                fullWidth
                                disabled
                                size="small"
                                label="Share Link"
                            />
                            <IconButton onClick={copyToClipboard} sx={{ ml: 1 }}>
                                <ContentCopyIcon />
                            </IconButton>
                        </Box>
                    )}

                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        Connected Users
                    </Typography>
                    <List dense>
                        {connectedUsers.map((user) => (
                            <ListItem key={user.userId}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={user.username}
                                    secondary={user.userId === 'host' ? 'Host' : 'Collaborator'}
                                />
                            </ListItem>
                        ))}
                    </List>

                    {lastUpdate && (
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                mt: 2, 
                                color: 'text.secondary',
                                fontStyle: 'italic'
                            }}
                        >
                            {lastUpdate}
                        </Typography>
                    )}

                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        {isHost 
                            ? 'Share the link above with others to start collaborating'
                            : 'You are connected to the collaboration room'}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default Collaboration; 