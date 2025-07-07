import { decryptData, encryptData } from '@/utils/helper';

const SECRET_KEY = import.meta.env.VITE_CRYPTO_SEC_KEY;

// Detects if app is running in production or local
const cookiesConfig =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? 'SameSite=None; Secure;'
    : 'SameSite=lax; Secure; ';

interface CookieOptions {
  key: string;
  value?: string | object | number | boolean;
  expiresInMinutes?: number;
  domain?: string;
}

// Function to set an encrypted cookie with optional expiration
const setCookie = ({ key, value, expiresInMinutes }: CookieOptions): void => {
  try {
    if (value === undefined) {
      console.error('Value is required to set a cookie.');
      return;
    }

    // Encrypt the value
    const encrypted = encryptData({
      data: JSON.stringify(value),
      keyName: key,
      secretKey: SECRET_KEY,
    });

    if (encrypted) {
      let cookieString = `${key}=${encodeURIComponent(
        JSON.stringify(encrypted)
      )};path=/; ${cookiesConfig}`;

      // Calculate expiration date if expiresInMinutes is provided
      if (expiresInMinutes) {
        const expires = new Date(
          Date.now() + expiresInMinutes * 60 * 1000
        ).toUTCString();
        cookieString += `;expires=${expires}`;
      }

      // Set the cookie
      document.cookie = cookieString;
    }
  } catch (error) {
    console.error('Error setting cookie', error);
  }
};

// Function to get and decrypt a cookie
const getCookie = ({ key }: Pick<CookieOptions, 'key'>) => {
  const name = `${key}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (const cookie of cookieArray) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(name)) {
      const encryptedData = JSON.parse(trimmedCookie.substring(name.length));
      try {
        // Decrypt the data
        const decryptedData = decryptData({
          encryptedData,
          secretKey: SECRET_KEY,
        });
        const response = decryptedData.split('=;').pop();

        return response ? JSON.parse(response) : null;
      } catch (error) {
        console.error('Error decrypting cookie', error);
        return null;
      }
    }
  }
  return null;
};

// Function to remove a cookie
const removeCookie = ({ key }: Pick<CookieOptions, 'key'>): void => {
  try {
    // Set the cookie's expiration date to the past to remove it
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/; ${cookiesConfig}`;
  } catch (error) {
    console.error('Error removing cookie', error);
  }
};

export { setCookie, getCookie, removeCookie };
