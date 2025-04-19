const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const { Transform } = require('stream');

class EncryptStream extends Transform {
    constructor(key, vector) {
        super();
        this.key = key;
        this.vector = vector;
    }

    _transform(chunk, encoding, callback) {
        const cipher = crypto.createCipheriv("aes-256-cbc", this.key, this.vector);
        const encrypted = Buffer.concat([cipher.update(chunk), cipher.final()]);
        this.push(encrypted);
        callback();
    }
}

const userKey = 'your-32-character-long-encryptio';
if (userKey.length !== 32) {
    throw new Error('The encryption key must be exactly 32 characters long.');
}
const key = Buffer.from(userKey, 'utf-8');
const vector = crypto.randomBytes(16);

console.log("Key: ", key.toString('hex'), "Vector: ", vector.toString('hex'));

const vectorFileName = 'vectorKey.txt';
fs.writeFileSync(vectorFileName, vector.toString('hex'), 'utf-8');
console.log(`Vector has been saved to ${vectorFileName}`);

const inputFileName = 'inp.txt';
const outputFileName = `${inputFileName}.nh`;

const readableStream = fs.createReadStream(inputFileName);
const gzipStream = zlib.createGzip();
const encryptStream = new EncryptStream(key, vector);

const writeStream = fs.createWriteStream(outputFileName);

readableStream
    .pipe(gzipStream)
    .pipe(encryptStream)
    .pipe(writeStream)
    .on('finish', () => {
        fs.unlink(inputFileName, (err) => {
            if (err) {
                console.error('Error deleting the original file:', err);
            } else {
                console.log(`File has been encrypted and saved as ${outputFileName}`);
            }
        });
    });
