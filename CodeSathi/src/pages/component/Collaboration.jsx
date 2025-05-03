import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { IconButton, Button, TextField, Box, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';

const socket = io('http://localhost:5000');

function Collaboration({ onCodeUpdate, roomId: propRoomId }) {
    const [roomId, setRoomId] = useState(propRoomId || '');
    const [isHost, setIsHost] = useState(false);
    const [shareLink, setShareLink] = useState('');

    useEffect(() => {
        if (propRoomId) {
            // If we have a roomId from props (URL), join that room
            joinRoom(propRoomId);
        }
    }, [propRoomId]);

    const createRoom = async () => {
        try {
            const response = await fetch('http://localhost:5000/create-room', {
                method: 'POST'
            });
            const data = await response.json();
            setRoomId(data.roomId);
            setIsHost(true);
            setShareLink(`${window.location.origin}/collaborate/${data.roomId}`);
            socket.emit('join-room', data.roomId);
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const joinRoom = (id) => {
        setRoomId(id);
        socket.emit('join-room', id);
    };

    const handleCodeChange = (code) => {
        if (roomId) {
            socket.emit('code-change', { roomId, code });
        }
    };

    useEffect(() => {
        socket.on('code-update', (code) => {
            onCodeUpdate(code);
        });

        return () => {
            socket.off('code-update');
        };
    }, [onCodeUpdate]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
    };

    return (
        <Box sx={{ p: 2 }}>
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
                    <Typography variant="h6">Collaboration Room</Typography>
                    {isHost && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <TextField
                                value={shareLink}
                                fullWidth
                                disabled
                                size="small"
                            />
                            <IconButton onClick={copyToClipboard}>
                                <ContentCopyIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default Collaboration; 