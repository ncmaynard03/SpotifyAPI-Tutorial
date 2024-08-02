import axios from 'axios';
import express from 'express';
import crypto from 'crypto';
import querystring from 'querystring';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = 8080;

const clientId = process.env.SPOTIFY_CLIENT_ID;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

// Helper function to generate random string
const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
};

// Generate Code Verifier and Code Challenge
const codeVerifier = generateRandomString(64);
const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest();
const base64urlencode = (buffer) => buffer.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
const codeChallenge = base64urlencode(sha256(codeVerifier));

let accessToken = ''; // Store the access token

app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email user-read-playback-state';
  const authUrl = 'https://accounts.spotify.com/authorize';
  const params = querystring.stringify({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  res.redirect(`${authUrl}?${params}`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    res.send('Error: No code provided');
    return;
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  try {
    const response = await axios.post(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    accessToken = response.data.access_token; // Store the access token
    var str = 'Access Token: ' + accessToken
    console.log(str);
    res.send(str);
  } catch (error) {
    console.error('Error getting token:', error);
    res.send('Error getting token');
  }
});

// New route to fetch user profile information
app.get('/profile', async (req, res) => {
  if (!accessToken) {
    res.send('Error: No access token available');
    return;
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('User Profile:', response.data);
    res.json(response.data); // Send the user profile information as JSON
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.send('Error fetching user profile');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Open http://localhost:8080/login in your browser to start the authorization flow');
});
