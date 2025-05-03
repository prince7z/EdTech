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

    useEffect(() => {
        if (roomId) {
            const newSocket = io('http://localhost:5000');
            setSocket(newSocket);
            newSocket.emit('join-room', roomId);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [roomId]);

    const handleFileClick = (content, filePath) => {
        // Check if file is already open
        const existingFileIndex = openFiles.findIndex(file => file.path === filePath);
        
        if (existingFileIndex === -1) {
            // Add new file to open files
            setOpenFiles(prev => [...prev, { content, path: filePath }]);
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
                />                      
            </div>
            
            <Right/>
        </div>
        </>
    )
}

export default Workspace