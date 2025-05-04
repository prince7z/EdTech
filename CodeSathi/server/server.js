const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const diff = require('diff');

const app = express();
const httpServer = createServer(app);

// Mock code snippets for simulation
const mockCodeSnippets = [
    '// Hello from collaborator!\nconsole.log("Let\'s build something amazing!");',
    'function greet() {\n  return "Hello from the other side!";\n}',
    '// Adding some new features\nconst newFeature = () => {\n  console.log("Feature added!");\n};',
    '// Bug fix\nconst fixBug = () => {\n  console.log("Bug fixed!");\n};'
];

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
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e8
});

const PORT = 5000;

// Store room states with version tracking
const rooms = new Map();

// Middleware
app.use(express.json());

// Mock function to simulate collaborator changes
const simulateCollaboratorChanges = (roomId, filePath) => {
    if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        const currentContent = room.files.get(filePath) || '';
        const randomSnippet = mockCodeSnippets[Math.floor(Math.random() * mockCodeSnippets.length)];
        const newContent = currentContent + '\n\n' + randomSnippet;
        
        // Update file content and version
        room.files.set(filePath, newContent);
        const currentVersion = room.versions.get(filePath) || 0;
        room.versions.set(filePath, currentVersion + 1);
        
        // Broadcast changes to all users in the room
        io.to(roomId).emit('file-update', {
            filePath,
            content: newContent,
            version: currentVersion + 1,
            source: 'collaborator'
        });
    }
};

// Endpoint to get file updates
app.get('/file-updates', (req, res) => {
    const { roomId } = req.query;
    if (!roomId) {
        return res.status(400).json({ error: 'Room ID is required' });
    }

    if (!rooms.has(roomId)) {
        return res.status(404).json({ error: 'Room not found' });
    }

    const room = rooms.get(roomId);
    res.json({
        files: Array.from(room.files.entries())
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
        
        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                files: new Map(),
                versions: new Map(),
                users: new Set()
            });
        }
        
        // Add user to room
        const room = rooms.get(roomId);
        room.users.add(socket.id);
        
        // Send current files to new user
        const filesState = Array.from(room.files.entries()).map(([path, content]) => ({
            path,
            content,
            version: room.versions.get(path) || 0
        }));
        socket.emit('files-update', filesState);

        // Simulate collaborator joining after 7 seconds
        setTimeout(() => {
            io.to(roomId).emit('user-joined', { userId: 'collaborator', username: 'Collaborator' });
            
            // Simulate initial code changes from collaborator
            setTimeout(() => {
                const filePath = 'server.js'; // Default file to modify
                simulateCollaboratorChanges(roomId, filePath);
            }, 1000);
        }, 7000);
    });

    socket.on('file-change', ({ roomId, filePath, content, version }) => {
        console.log('Received file change:', { roomId, filePath, content, version });
        if (rooms.has(roomId)) {
            const room = rooms.get(roomId);
            const currentVersion = room.versions.get(filePath) || 0;
            
            if (version >= currentVersion) {
                // Update file content and version
                room.files.set(filePath, content);
                room.versions.set(filePath, version + 1);
                
                // Broadcast changes to all users in the room
                io.to(roomId).emit('file-update', {
                    filePath,
                    content,
                    version: version + 1,
                    source: 'user'
                });

                // Simulate collaborator changes after 2 seconds
                setTimeout(() => {
                    simulateCollaboratorChanges(roomId, filePath);
                }, 2000);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Remove user from all rooms
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