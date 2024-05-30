const fs = require('fs');
const path = require('path');

class Model {
    constructor(fileName = 'data.json') {
        this.fileName = fileName;
        this.filePath = path.join(__dirname, '..', 'data', fileName);
    }
    
    read() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading data:', error);
            return [];
        }
    }
}

module.exports = Model;
