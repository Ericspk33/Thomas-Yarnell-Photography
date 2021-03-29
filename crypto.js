// basic imports
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

// using aes-256-ctr algorithm w/ a secretkey 
const algorithm = 'aes-256-ctr';
const secretKey = process.env.SECRETKEY;
const iv = crypto.randomBytes(16);

// creates a random string
var secretRandoKey = '';
var stringValues = 'ABCDEFGHIJKLMNOabcdefghijklmnopqrstuvwxyzPQRSTUVWXYZabcedfghijklmnopqrstuvwxyz1234567890';  
var sizeOfCharacter = stringValues.length;  
for (var i = 0; i < 32; i++) {
    secretRandoKey = secretRandoKey+stringValues.charAt(Math.floor(Math.random() * sizeOfCharacter));
} 

// encrypts text
const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

// decrypts text (uses the unique iv)
const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrypted.toString();
};

// encrypts with a random key for more protection
const encryptRando = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretRandoKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

// decrypts with a random key for more protection
const decryptRando = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretRandoKey, Buffer.from(hash.iv, 'hex'));

    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrypted.toString();
};

module.exports = {
    encrypt,
    decrypt,
    encryptRando,
    decryptRando,
};