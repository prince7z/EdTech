import React, { useEffect, useState } from 'react'
import Bar2 from './component/appbar1.jsx'
import Menu from './component/menu.jsx'
import Mid from './component/codespace.jsx'
import Folder from './component/folder.jsx'
import Right from './component/right.jsx'
import { RecoilRoot } from 'recoil'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

function Workspace(){
    const { roomId } = useParams();
    const [openFiles, setOpenFiles] = useState([]);
    const [activeFile, setActiveFile] = useState(null);
    const [socket, setSocket] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    // Poll for file updates
    useEffect(() => {
        if (!roomId) return;

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`http://localhost:5000/file-updates?roomId=${roomId}`);
                if (!response.ok) throw new Error('Failed to fetch updates');
                
                const data = await response.json();
                const newFiles = data.files.map(([path, content]) => ({
                    path,
                    content
                }));

                // Only update if files have changed
                if (JSON.stringify(newFiles) !== JSON.stringify(openFiles)) {
                    console.log('Polling found updates:', newFiles);
                    setOpenFiles(newFiles);
                    setLastUpdate(Date.now());
                }
            } catch (error) {
                console.error('Error polling for updates:', error);
            }
        }, 1000); // Poll every second

        return () => clearInterval(pollInterval);
    }, [roomId, openFiles]);

    useEffect(() => {
        if (roomId) {
            const newSocket = io('http://localhost:5000');
            setSocket(newSocket);
            newSocket.emit('join-room', roomId);

            // Handle initial files update
            newSocket.on('files-update', (files) => {
                console.log('Received files update:', files);
                const newOpenFiles = files.map(([path, content]) => ({
                    path,
                    content
                }));
                setOpenFiles(newOpenFiles);
                if (newOpenFiles.length > 0 && !activeFile) {
                    setActiveFile(newOpenFiles[0].path);
                }
            });

            // Handle file updates from other users
            newSocket.on('file-update', ({ filePath, content }) => {
                console.log('Received file update:', filePath, content);
                setOpenFiles(prevFiles => {
                    const existingFileIndex = prevFiles.findIndex(file => file.path === filePath);
                    if (existingFileIndex !== -1) {
                        const newFiles = [...prevFiles];
                        newFiles[existingFileIndex] = { ...newFiles[existingFileIndex], content };
                        return newFiles;
                    }
                    return [...prevFiles, { path: filePath, content }];
                });
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [roomId]);

    const handleFileClick = (content, filePath) => {
        console.log('File clicked:', filePath, content);
        // Check if file is already open
        const existingFileIndex = openFiles.findIndex(file => file.path === filePath);
        
        if (existingFileIndex === -1) {
            // Add new file to open files
            const newFiles = [...openFiles, { content, path: filePath }];
            setOpenFiles(newFiles);
            
            // Emit file change to other users
            if (socket && roomId) {
                console.log('Emitting file change:', { roomId, filePath, content });
                socket.emit('file-change', { roomId, filePath, content });
            }
        }
        
        // Set as active file
        setActiveFile(filePath);
    };

    const handleCloseFile = (filePath) => {
        setOpenFiles(prev => prev.filter(file => file.path !== filePath));
        
        // If we're closing the active file, set a new active file
        if (activeFile === filePath) {
            const remainingFiles = openFiles.filter(file => file.path !== filePath);
            setActiveFile(remainingFiles.length > 0 ? remainingFiles[remainingFiles.length - 1].path : null);
        }
    };

    const handleTabClick = (filePath) => {
        setActiveFile(filePath);
    };

    return(
        <>
        <Bar2></Bar2>
    
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        }}>
            <div style={{
                display:'flex',
                flexDirection:'row',
            }}>
                <Menu roomId={roomId} />
                <Folder onFileClick={handleFileClick} />
                <Mid 
                    openFiles={openFiles}
                    activeFile={activeFile}
                    onCloseFile={handleCloseFile}
                    onTabClick={handleTabClick}
                    roomId={roomId}
                    socket={socket}
                />                      
            </div>
            
            <Right/>
        </div>
        </>
    )
}

export default Workspace