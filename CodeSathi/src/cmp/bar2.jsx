// Add these new imports
import ImportExportIcon from '@mui/icons-material/ImportExport';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ChatIcon from '@mui/icons-material/Chat';
import { IconButton } from '@mui/material';
import React from 'react';




function Bar2() {
    return (

        <div style={{
            height:"10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "15px",
            backgroundColor: "white",
        }}>

            <div style={{
                display: "flex",
                gap: "20px",
                alignItems: "center"
            }}>
                 <IconButton onClick={() => console.log('Import/Export clicked')}>
                    <ImportExportIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <IconButton onClick={() => console.log('Upload clicked')}>
                    <CloudUploadIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <IconButton onClick={() => console.log('Dark mode clicked')}>
                    <DarkModeIcon sx={{ fontSize: 30 }} />
                </IconButton>

            </div>

            <div style={{
                display: "flex",
                gap: "20px",
                alignItems: "center"
            }}>
                <IconButton onClick={() => console.log('AI clicked')}>
                    <SmartToyIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <IconButton onClick={() => console.log('Mentor clicked')}>
                    <SupervisorAccountIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <IconButton onClick={() => console.log('Chat clicked')}>
                    <ChatIcon sx={{ fontSize: 30 }} />
                </IconButton>
            </div>

        </div>
    )
}

export default Bar2;