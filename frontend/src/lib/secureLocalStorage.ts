import { decryptData, encryptData } from "@/utils/helper";

type PropSet = string | number | boolean | object;
const SECRET_KEY = import.meta.env.VITE_CRYPTO_SEC_KEY;

type SetLocalStorageProps = {
  key: string;
  value: PropSet;
};

type GetLocalStorageProps = {
  key: string;
};

const setLocalStorage = ({ key, value }: SetLocalStorageProps) => {
  try {
    const encrypted = encryptData({
      data: JSON.stringify(value),
      keyName: key,
      secretKey: SECRET_KEY,
    });

    if (value && encrypted) {
      localStorage.setItem(key, JSON.stringify(encrypted));
    }
  } catch (error) {
    console.error('Error setting localStorage item', error);
  }
};

const getLocalStorage = ({ key }: GetLocalStorageProps) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  try {
    const decryptedData = decryptData({
      encryptedData: JSON.parse(itemStr),
      secretKey: SECRET_KEY,
    });

    const response = decryptedData.split('=;').pop();
    return response ? JSON.parse(response) : null;
  } catch (error) {
    console.error('Error decrypting localStorage item', error);
    return null;
  }
};

const removeLocalStorage = ({ key }: GetLocalStorageProps) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error remove localStorage item', error);
    return null;
  }
};

export { setLocalStorage, getLocalStorage, removeLocalStorage };
