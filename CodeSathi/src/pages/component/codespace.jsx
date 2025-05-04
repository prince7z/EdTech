import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FaTimes } from 'react-icons/fa';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

function Mid({ openFiles, activeFile, onCloseFile, onTabClick, roomId, socket }) {
    return(
        <>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
        }}>
        <Bar 
            openFiles={openFiles} 
            activeFile={activeFile} 
            onCloseFile={onCloseFile}
            onTabClick={onTabClick}
        />
        <Codespace 
            openFiles={openFiles} 
            activeFile={activeFile} 
            onCloseFile={onCloseFile}
            roomId={roomId}
            socket={socket}
        />
        <Output/>
        </div>
        </>
    )
}

function Bar({ openFiles, activeFile, onCloseFile, onTabClick }) {
    return(
        <>
        <div style={{
            backgroundColor: '#252526',
            width: '65vw',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
            padding: '4px 8px',
            backgroundColor: '#000000',
            borderBottom: '1px solid #3c3c3c',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
        }}>
            {openFiles.map((file) => (
                <div 
                    key={file.path}
                    style={{
                        backgroundColor: activeFile === file.path ? '#1e1e1e' : '#2d2d2d',
                        padding: '5px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginRight: '2px',
                        cursor: 'pointer',
                        borderBottom: activeFile === file.path ? '2px solid rgb(255, 255, 255)' : 'none'
                    }}
                    onClick={() => onTabClick(file.path)}
                >
                    <span style={{ color: '#cccccc' }}>{file.path.split('/').pop()}</span>
                    <FaTimes 
                        style={{ 
                            cursor: 'pointer', 
                            color: '#cccccc',
                            fontSize: '12px',
                            padding: '2px',
                            borderRadius: '50%',
                            '&:hover': {
                                backgroundColor: '#3c3c3c'
                            }
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onCloseFile(file.path);
                        }}
                    />
                </div>
            ))}
        </div>
        </>
    )
}

function Output(){
    const [output,setoutput]=useState("output will be here");

    return(
        <>
         <div style={{
            backgroundColor: '#191f22',
            color: '#ffffff',
            padding: '10px',
            boxSizing: 'border-box',
            width: '65vw',
            height: '16.4vh',
            fontFamily: 'Consolas, monospace',
            overflow: 'scroll',
            scrollbarWidth: 'none',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 0'
            }}>
                <span style={{ color: '#cccccc' }}>Output</span>
            </div>
            <pre style={{ margin: '10px 0' }}>
                {output}
                Program output will appear here...
            </pre>
        </div>
        </>
    )
}

function Codespace({ openFiles, activeFile, onCloseFile, roomId, socket }) {
    const [code, setCode] = useState('//write code here');
    const [fileVersion, setFileVersion] = useState(0);
    
    const handleEditorChange = (value) => {
        setCode(value);
        
        // Update the content in openFiles
        const updatedFiles = openFiles.map(file => 
            file.path === activeFile ? { ...file, content: value } : file
        );
        
        // Emit file change if in collaboration mode
        if (socket && roomId && activeFile) {
            socket.emit('file-change', { 
                roomId, 
                filePath: activeFile, 
                content: value,
                version: fileVersion
            });
        }
    };

    useEffect(() => {
        if (activeFile) {
            const currentFile = openFiles.find(file => file.path === activeFile);
            if (currentFile) {
                setCode(currentFile.content);
                setFileVersion(currentFile.version || 0);
            }
        } else {
            setCode('//write code here');
            setFileVersion(0);
        }
    }, [activeFile, openFiles]);

    useEffect(() => {
        if (!socket) return;

        socket.on('file-update', ({ filePath, content, version, changes }) => {
            if (filePath === activeFile) {
                console.log('Received file update:', { filePath, version, changes });
                setCode(content);
                setFileVersion(version);
            }
        });

        socket.on('file-version-mismatch', ({ filePath, currentVersion, currentContent }) => {
            if (filePath === activeFile) {
                console.log('Version mismatch, updating to current version');
                setCode(currentContent);
                setFileVersion(currentVersion);
            }
        });

        return () => {
            socket.off('file-update');
            socket.off('file-version-mismatch');
        };
    }, [socket, activeFile]);

    return (
        <div style={{
            width: '65vw',
            height: '64.7vh',
            position: 'relative',
            zIndex: 2,
        }}>
            <Editor
                height="100%"
                width="65vw"
                defaultLanguage="javascript"
                value={code}
                theme="vs-dark"
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    formatOnPaste: true,
                    scrollbar: {
                        vertical: 'hidden',
                        horizontal: 'hidden',
                    },
                    formatOnType: true,
                }}
            />
        </div>
    );
}

export { Mid as default };
