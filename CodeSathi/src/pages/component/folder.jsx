import React, { useState, useEffect } from 'react';
import { FaFolder, FaFolderOpen, FaFile, FaChevronRight, FaChevronDown } from 'react-icons/fa';

function Folder() {
    return (
        <>
            <Foldersec />
        </>
    )
}

function Foldersec() {
    const [expanded, setExpanded] = useState({});
    const [folderStructure, setFolderStructure] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/folder')
            .then(response => response.json())
            .then(data => setFolderStructure(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const toggleFolder = (path) => {
        setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
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
                    onClick={() => item.type === 'folder' && toggleFolder(currentPath)}
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
            backgroundColor: '#1e1e1e',
            color: '#ffffff',
            padding: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px'
        }}>
            {folderStructure && renderItem(folderStructure)}
        </div>
    );
}

export default Folder;