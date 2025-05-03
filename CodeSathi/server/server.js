const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

// Configure CORS
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = 5000;

// Store room states
const rooms = new Map();

// Middleware
app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
        
        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                code: '',
                users: new Set()
            });
        }
        
        // Add user to room
        rooms.get(roomId).users.add(socket.id);
        
        // Send current code to new user
        socket.emit('code-update', rooms.get(roomId).code);
    });

    socket.on('code-change', ({ roomId, code }) => {
        if (rooms.has(roomId)) {
            // Update room's code
            rooms.get(roomId).code = code;
            // Broadcast to all other users in the room
            socket.to(roomId).emit('code-update', code);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Clean up room if empty
        rooms.forEach((room, roomId) => {
            if (room.users.has(socket.id)) {
                room.users.delete(socket.id);
                if (room.users.size === 0) {
                    rooms.delete(roomId);
                }
            }
        });
    });
});

// Test endpoint
app.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'Server is working!' });
});

// Create room endpoint
app.post('/create-room', (req, res) => {
    try {
        console.log('Create room request received');
        const roomId = Math.random().toString(36).substring(2, 8);
        console.log('Created room:', roomId);
        res.json({ roomId });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
});

// Helper function to get file structure recursively
function getFileStructure(dirPath, basePath = '') {
    try {
        const items = fs.readdirSync(dirPath);
        const result = {
            name: path.basename(dirPath),
            type: 'folder',
            children: []
        };

        items.forEach(item => {
            // Skip node_modules and other hidden directories
            if (item.startsWith('.') || item === 'node_modules') {
                return;
            }

            const fullPath = path.join(dirPath, item);
            const relativePath = path.join(basePath, item);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                result.children.push(getFileStructure(fullPath, relativePath));
            } else {
                result.children.push({
                    name: item,
                    type: 'file',
                    path: relativePath
                });
            }
        });

        return result;
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
        return {
            name: path.basename(dirPath),
            type: 'folder',
            children: []
        };
    }
}

// Endpoint to get folder structure
app.get('/folder', (req, res) => {
    try {
        // Get the absolute path to the project root
        const projectRoot = path.resolve(__dirname, '..');
        console.log('Project root:', projectRoot);
        
        // Verify the directory exists
        if (!fs.existsSync(projectRoot)) {
            console.error('Project root does not exist:', projectRoot);
            return res.status(500).json({ error: 'Project root directory not found' });
        }

        // Get the structure of the entire project
        const structure = getFileStructure(projectRoot);
        console.log('Sending folder structure:', structure);
        res.json(structure);
    } catch (error) {
        console.error('Error getting folder structure:', error);
        res.status(500).json({ error: 'Failed to get folder structure' });
    }
});

// Endpoint to get file content
app.get('/file-content', (req, res) => {
    try {
        const filePath = req.query.path;
        if (!filePath) {
            return res.status(400).json({ error: 'File path is required' });
        }

        // Get the absolute path to the project root
        const projectRoot = path.resolve(__dirname, '..');
        const fullPath = path.join(projectRoot, filePath);
        
        console.log('Attempting to read file:', fullPath);
        
        if (!fs.existsSync(fullPath)) {
            console.error('File not found:', fullPath);
            return res.status(404).json({ error: 'File not found' });
        }

        const content = fs.readFileSync(fullPath, 'utf8');
        res.json({ content });
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Failed to read file' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start the server
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 