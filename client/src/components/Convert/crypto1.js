//  get crypto module
const crypto = require("crypto-browserify");

// our secret message
const text = "Hello There, i should be a secret";
const iv = "f9c31a6e7b6d0729";
// secret key
const key = "12345678123456781234567812345678";

// encrypt(text);
// decrypt(
//     "bb7bb728c75f9226f2ca14ca1d218d19b667d242bed7e84cee172b45ff639d8bf39a655962bd0b01ab70d0e85344fd9b"
// );

function encrypt(message) {
    // generate 16 bytes of random data
    // const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);

    // make the encrypter function
    const encrypter = crypto.createCipheriv("aes-256-cbc", key, iv);

    // encrypt the message
    // set the input encoding
    // and the output encoding
    let encryptedMsg = encrypter.update(message, "utf-8", "hex");

    // stop the encryption using
    // the final method and set
    // output encoding to hex
    encryptedMsg += encrypter.final("hex");
    return encryptedMsg;
    console.log("Encrypted message: " + encryptedMsg);
}

function decrypt(encryptedMsg) {
    // make the decrypter function
    const decrypter = crypto.createDecipheriv("aes-256-cbc", key, iv);

    // decrypt the message
    // set the input encoding
    // and the output encoding
    let decryptedMsg = decrypter.update(encryptedMsg, "hex", "utf8");

    // stop the decryption using
    // the final method and set
    // output encoding to utf8
    decryptedMsg += decrypter.final("utf-8");
    return decryptedMsg;
    console.log("Decrypted message: " + decryptedMsg);
}

module.exports = {
    encrypt,
    decrypt,
};
