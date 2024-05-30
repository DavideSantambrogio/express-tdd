const path = require('path');
const fs = require('fs');



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

    add(newData) {
        try {
            const allData = this.read();
            allData.push(newData);
            fs.writeFileSync(this.filePath, JSON.stringify(allData, null, 2));
            return allData;
        } catch (error) {
            console.error('Error adding data:', error);
            return [];
        }
    }
}

module.exports = Model;
