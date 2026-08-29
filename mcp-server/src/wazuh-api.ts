import axios from 'axios';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const WAZUH_API_URL = process.env.WAZUH_API_URL || 'https://localhost:55000';
const WAZUH_USER = process.env.WAZUH_API_USER || 'wazuh-wui';
const WAZUH_PASSWORD = process.env.WAZUH_API_PASSWORD || 'wazuh';

// Allow self-signed certs for lab environments
const httpsAgent = new https.Agent({
    rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0'
});

const client = axios.create({
    baseURL: WAZUH_API_URL,
    httpsAgent
});

let authToken = '';

export async function authenticate() {
    const token = Buffer.from(`${WAZUH_USER}:${WAZUH_PASSWORD}`).toString('base64');
    const response = await client.post('/security/user/authenticate', {}, {
        headers: { Authorization: `Basic ${token}` }
    });
    authToken = response.data.data.token;
    return authToken;
}

export async function apiRequest(method: string, endpoint: string, params: any = {}) {
    if (!authToken) await authenticate();
    
    try {
        const res = await client.request({
            method,
            url: endpoint,
            headers: { Authorization: `Bearer ${authToken}` },
            params
        });
        return res.data;
    } catch (error: any) {
        // If token expired, re-authenticate and retry once
        if (error.response?.status === 401) {
            await authenticate();
            const res = await client.request({
                method,
                url: endpoint,
                headers: { Authorization: `Bearer ${authToken}` },
                params
            });
            return res.data;
        }
        throw error;
    }
}
