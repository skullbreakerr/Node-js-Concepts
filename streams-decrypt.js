const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const { Transform } = require('stream');

class DecryptStream extends Transform {
    constructor(key, vector) {
        super();
        this.key = key;
        this.vector = vector;
    }

    _transform(chunk, encoding, callback) {
        try {
            const decipher = crypto.createDecipheriv("aes-256-cbc", this.key, this.vector);
            const decrypted = Buffer.concat([decipher.update(chunk), decipher.final()]);
            this.push(decrypted);
            callback();
        } catch (err) {
            callback(err);
        }
    }
}

const userKey = 'your-32-character-long-encryptio';
if (userKey.length !== 32) {
    throw new Error('The decryption key must be exactly 32 characters long.');
}
const key = Buffer.from(userKey, 'utf-8');

try {
    // const vectorHex = fs.readFileSync('vectorKey.txt', 'utf-8').trim();
    const vector = Buffer.from("25f802b65f07af172772526ae693842a", 'hex');

    const inputFileName = 'inp.txt.nh'; 
    const outputFileName = 'inp.txt'; 

    const readableStream = fs.createReadStream(inputFileName);
    const decryptStream = new DecryptStream(key, vector);
    const gunzipStream = zlib.createGunzip();
    const writeStream = fs.createWriteStream(outputFileName);

    readableStream
        .pipe(gunzipStream)
        .pipe(decryptStream)
        .pipe(writeStream)
        .on('finish', () => {
            console.log(`File has been decrypted and saved as ${outputFileName}`);
        })
        .on('error', (err) => {
            console.error('An error occurred during decryption:', err.message);
        });
} catch (err) {
    console.error('Error:', err.message);
}
