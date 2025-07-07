import CryptoJS from 'crypto-js';
export const encryptData = ({
  keyName,
  data,
  secretKey,
}: {
  keyName: string;
  data: string;
  secretKey: string;
}): string => {
  try {
    const dataToEncrypt = `${keyName}=;${data}`;
    return CryptoJS.AES.encrypt(dataToEncrypt, secretKey).toString();
  } catch (error) {
    console.error('Error during data encryption:', error);
    throw new Error('Data encryption failed');
  }
};

export const decryptData = ({
  encryptedData,
  secretKey,
}: {
  encryptedData: string;
  secretKey: string;
}): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error during data decryption:', error);
    throw new Error('Data decryption failed');
  }
};
