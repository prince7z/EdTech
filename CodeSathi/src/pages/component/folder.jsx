import React, { useState, useEffect } from 'react';
import { FaFolder, FaFolderOpen, FaFile, FaChevronRight, FaChevronDown } from 'react-icons/fa';

function Folder({ onFileClick }) {
    return (
        <>
            <Foldersec onFileClick={onFileClick} />
        </>
    )
}

function Foldersec({ onFileClick }) {
    const [expanded, setExpanded] = useState({});
    const [folderStructure, setFolderStructure] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFolderStructure = async () => {
            try {
                // First test if the server is accessible
                const testResponse = await fetch('http://localhost:5000/test');
                if (!testResponse.ok) {
                    throw new Error('Server is not responding');
                }
                const testData = await testResponse.json();
                console.log('Server test response:', testData);

                // Then fetch the folder structure
                const response = await fetch('http://localhost:5000/folder');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Received folder structure:', data);
                setFolderStructure(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching folder structure:', error);
                setError(error.message);
            }
        };

        fetchFolderStructure();
    }, []);

    const toggleFolder = (path) => {
        setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
    };

    const handleFileClick = async (path) => {
        try {
            console.log('Attempting to open file:', path);
            const response = await fetch(`http://localhost:5000/file-content?path=${encodeURIComponent(path)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            onFileClick(data.content, path);
        } catch (error) {
            console.error('Error fetching file content:', error);
            setError(error.message);
        }
    };

    const renderItem = (item, path = '') => {
        const currentPath = `${path}/${item.name}`;
        const isExpanded = expanded[currentPath];

        return (
            <div key={currentPath}>
                <div 
                    className="folder-item"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px',
                        cursor: 'pointer',
                        gap: '4px'
                    }}
                    onClick={() => {
                        if (item.type === 'folder') {
                            toggleFolder(currentPath);
                        } else {
                            handleFileClick(item.path || currentPath);
                        }
                    }}
                >
                    {item.type === 'folder' && (
                        isExpanded ? <FaChevronDown /> : <FaChevronRight />
                    )}
                    {item.type === 'folder' ? (
                        isExpanded ? <FaFolderOpen color="#dcb67a" /> : <FaFolder color="#dcb67a" />
                    ) : (
                        <FaFile color="#7cb7ff" />
                    )}
                    <span>{item.name}</span>
                </div>
                {item.type === 'folder' && isExpanded && (
                    <div style={{ paddingLeft: '20px' }}>
                        {item.children?.map(child => renderItem(child, currentPath))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{
            backgroundColor: '#131618',
            color: '#ffffff',
            padding: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '13px',
            width: '12vw',
            height: '83.6vh',
            overflow: 'scroll',
            scrollbarWidth: 'none',
        }}>
            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    Error: {error}
                </div>
            )}
            {folderStructure ? (
                renderItem(folderStructure)
            ) : (
                <div>Loading folder structure...</div>
            )}
        </div>
    );
}

export default Folder;