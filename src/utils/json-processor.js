const fs = require("fs");

async function _generateFileName() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const fileName = `data/${year}-${month}-${day}.json`;
    return fileName;
}

async function save(data) {
    const fileName = await _generateFileName();

    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFile(fileName, jsonData, (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log(`JSON file has been saved as ${fileName}.`);
        }
    });
}

async function open() {
    // 파일 열기 로직 구현
}

module.exports = { save, open };
