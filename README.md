# SmartSheets
Mobile App for Data Analysis.

# Running the App Locally
## 1. Server
Setup:
```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 2. Client App

Update API URL in `client/.env`:
```
API_BASE_URL='http://[YOUR_IP_ADDRESS]:5000'
```

Run:
```bash
cd client
npm install
npx expo start
```

Make sure your device has Expo Go app installed. Scan the QR in the cli to run the app.