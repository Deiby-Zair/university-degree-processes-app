import { AES, SHA256, enc } from 'crypto-ts';

export const cyph = (message: string) => {
    const password = SHA256(process.env.PRIVATE_INFORMATION_KEY as string);
    const encryptedMessage = AES.encrypt(message, password).toString();
    console.log("Encrypted message");
    return encryptedMessage;
}

export const decyph = (message: string) => {
    const password = SHA256(process.env.PRIVATE_INFORMATION_KEY as string);
    const decryptedMessage = AES.decrypt(message, password).toString(enc.Utf8);
    console.log("Decrypted message");
    return decryptedMessage;
}