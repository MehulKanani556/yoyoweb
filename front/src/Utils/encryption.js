import CryptoJS from 'crypto-js';

const FIXED_IV = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
const SECRET_KEY = CryptoJS.enc.Utf8.parse("hyujilkopskj%%&&&202020029999hdsyusfryhu");


export function encryptData(data) {
  const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY, {
    iv: FIXED_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString(); // base64

}

export function decryptData(ciphertext) {

  if (!ciphertext) return "";
  try {
    // If ciphertext is already a string, try to decode from base64
    const decrypted = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY, {
      iv: FIXED_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    // If decryption fails, plaintext will be empty string
    return plaintext || "";
  } catch (e) {
    // If decryption throws, return empty string or original ciphertext for debugging
    return "";
  }
}