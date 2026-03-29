# FINS - Fish Information System

Fish database search application for Mediterranean species.

## Live Demo

**Production:** http://62.217.127.153:5173/FINS/fins

---

## Deployment Configuration

### Environment Variables

The application requires proper configuration based on the deployment environment.

#### `.env` File:

Create a `.env` file in the project root with the following:

**For Local Development:**

```bash
VITE_PUBLIC_BUILDER_KEY=7baa390e7355426b981f979273f033f1
VITE_PROXY_URL=http://localhost:3001/api
```

**For ITE VM Production:**

```bash
VITE_PUBLIC_BUILDER_KEY=7baa390e7355426b981f979273f033f1
VITE_PROXY_URL=http://62.217.127.153:3001/api
```

**IMPORTANT:** When deploying to a different environment, always update `VITE_PROXY_URL` to point to the correct proxy server URL.

---

## Proxy Server Setup

The application requires a proxy server to bypass CORS restrictions when accessing the FORTH API.

### Why is a proxy needed?

The frontend cannot directly access `https://demos.isl.ics.forth.gr/semantyfish-api` due to CORS policy. The proxy server acts as an intermediary:

```
Frontend → Proxy Server → FORTH API
```

### Proxy Configuration:

The proxy server must allow requests from the frontend origin.

**`proxy-server.js` - Update `allowedOrigins`:**

```javascript
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://localhost:5137", // Alternative local port
  "http://62.217.127.153:5173", // ITE VM production
];
```

## Local Development

### Prerequisites:

- Node.js 18+
- npm

### Setup:

1. **Clone repository:**

```bash
git clone https://github.com/YOUR-USERNAME/fins-project
cd fins-project
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment:**

```bash
# Create .env file
echo "VITE_PUBLIC_BUILDER_KEY=7baa390e7355426b981f979273f033f1" > .env
echo "VITE_PROXY_URL=http://localhost:3001/api" >> .env
```

4. **Start proxy server (Terminal 1):**

```bash
node proxy-server.js
```

Expected output:

```
CORS Proxy running on http://localhost:3001
Forwarding to: https://demos.isl.ics.forth.gr/semantyfish-api
```

5. **Start frontend (Terminal 2):**

```bash
npm run dev
```

6. **Open browser:**

```
http://localhost:5173/FINS/
```

---

## Production Deployment (ITE VM)

### On the VM:

1. **Clone repository:**

```bash
git clone https://github.com/kathy222/fins-project
cd fins-project
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure for production:**

```bash
# Update .env
nano .env
```

Set:

```bash
VITE_PUBLIC_BUILDER_KEY=7baa390e7355426b981f979273f033f1
VITE_PROXY_URL=http://62.217.127.153:3001/api
```

4. **Build application:**

```bash
npm run build
```

5. **Start proxy server:**

```bash
# Option A: Direct run
node proxy-server.js

# Option B: Using PM2 (recommended for production)
npm install -g pm2
pm2 start proxy-server.js --name fins-proxy
pm2 save
pm2 startup
```

6. **Serve frontend:**

```bash
# Using Vite preview
npm run preview -- --port 5173 --host

# Or use a static file server
npx serve dist -p 5173
```

---

## Updating Deployment

When updating code on the VM:

```bash
cd fins-project

# Pull latest changes
git pull origin main

# Rebuild if .env or code changed
npm run build

# Restart services
pm2 restart fins-proxy
# Restart frontend server
```

---

## Features

- **Search by common names** (English & Greek)
  - English: Grouper, Seabass, Tuna, Shark, etc.
  - Greek: Τσιπούρα, Σαργός, Φαγκρί, etc.
- **Search by scientific names** (Sparus aurata, Epinephelus, etc.)
- **Search by genus**
- **Advanced filtering**
- **Species details with images**

---

## Technology Stack

- **Frontend:** React + TypeScript, Vite, TailwindCSS
- **Proxy:** Node.js Express server
- **API:** FORTH Semantyfish API

---

## Troubleshooting

### CORS Errors:

If you see CORS errors in the browser console:

1. Check `.env` file has correct `VITE_PROXY_URL`
2. Verify proxy server is running
3. Check proxy `allowedOrigins` includes your frontend URL

### Connection Refused Errors:

If you see `ERR_CONNECTION_REFUSED`:

1. Verify proxy server is running: `curl http://localhost:3001/api/species/1`
2. Check firewall isn't blocking port 3001
3. Verify `.env` points to correct proxy URL

### After Deployment, App Shows Localhost Errors:

This means the app was built with wrong `.env` configuration:

1. Update `.env` with production proxy URL
2. Rebuild: `npm run build`
3. Restart frontend server
