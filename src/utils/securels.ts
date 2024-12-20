import SecureLS from 'secure-ls';

// Initialize SecureLS 
const secureLS = new SecureLS({ encodingType: 'aes', isCompression: true });

// Store Access Token 
export const storeToken = (accessToken: string, refreshToken: string) => {
    try {
        secureLS.set('accessToken', accessToken);
        secureLS.set('refreshToken', refreshToken);
    } catch (error) {
        console.error('Error storing tokens:', error);
        removeTokens();
    }
};

// Retrieve Tokens 
export const getToken = (key: string) => {
    try {
        const token = secureLS.get(key);
        return token || null;
    } catch (error) {
        console.error(`Error retrieving token for key ${key}:`, error);
        return null;
    }
};

// Retrieve Data From Local Storage 
export const getDataFromLocalStorage = (key: string) => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(`Error retrieving data for key ${key}:`, error);
        return null;
    }
};

// Remove Specific Tokens and User Info
export const removeTokens = () => {
    try {
        // Remove from SecureLS
        secureLS.remove('accessToken');
        secureLS.remove('refreshToken');
        console.log('Remove Token Area Error removing tokens and user info:');

        // Remove from localStorage
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
    } catch (error) {
        console.error('Error removing tokens and user info:', error);
    }
};