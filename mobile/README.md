# Budget-Friendly (Mobile)

## Setup

1. Install dependencies:
   - `npm install`

2. Configure the backend base URL:
   - Copy `.env.example` to `.env`
   - Set `EXPO_PUBLIC_API_BASE_URL` to your backend base URL (no trailing `/v1`)

   Examples:
   - Deployed backend (Vercel): `https://your-deployment.vercel.app`
   - Local `vercel dev`:
     - Android emulator: `http://10.0.2.2:3000`
     - iOS simulator: `http://localhost:3000`
     - Physical device: `http://<YOUR_LAN_IP>:3000`

3. Start Expo:
   - `npm run start`

## Notes

- The mobile app calls the backend under `/v1/*`.
- If `EXPO_PUBLIC_API_BASE_URL` is empty, login and data loading will fail.
