const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

function getDirectoryStructure(dir) {
    const structure = {
        name: path.basename(dir),
        type: 'folder',
        children: []
    };

    const items = fs.readdirSync(dir);
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!item.startsWith('.') && item !== 'node_modules') {
                structure.children.push(getDirectoryStructure(fullPath));
            }
        } else {
            structure.children.push({
                name: item,
                type: 'file'
            });
        }
    });

    return structure;
}

app.get('/folder', (req, res) => {
    const projectRoot = "D:\\VS\\next path";
    const structure = getDirectoryStructure(projectRoot);
    res.json(structure);
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});