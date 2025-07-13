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
Run:
```bash
cd client
npx expo start
```

In line 53 of `pages/Upload.js` modify to add your ip address:
```js
const res = await axios.post("http://[YOUR_IP_ADDRESS]//preview", formData, {
```

Make sure your device has Expo Go app installed. Scan the QR in the cli to run the app.