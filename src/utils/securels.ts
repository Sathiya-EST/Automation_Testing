import SecureLS from 'secure-ls';

// Initialize SecureLS
const secureLS = new SecureLS({ encodingType: 'aes', isCompression: true });

// Store Access Token
export const storeToken = (accessToken: string, refreshToken: string) => {
    secureLS.set('accessToken', accessToken);
    secureLS.set('refreshToken', refreshToken);
};

// Retrieve Tokens
export const getToken = (key: string) => secureLS.get(key);

// Remove Tokens
export const removeTokens = () => {
    secureLS.remove('accessToken');
    secureLS.remove('refreshToken');
};
