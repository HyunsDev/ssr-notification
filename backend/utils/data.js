const fs = require('fs')

exports.load = (fileName) => {
    const data = fs.readFileSync(fileName, { encoding: 'utf-8' });
    const json = JSON.parse(data)
    return json
}

exports.save = (fileName, originalData) => {
    const data = JSON.stringify(originalData, null, 4)
    fs.writeFileSync(fileName, data)
}