# MyFuckingFrenchSite

A password-protected French learning website with audio recording capabilities.

## Deployment Instructions

### Option 1: Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Push your code to the repository
3. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
4. Add these scripts to package.json:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
5. Add homepage to package.json:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name"
   }
   ```
6. Deploy:
   ```bash
   npm run deploy
   ```

### Option 2: Deploy to VPS

1. Install Node.js and nginx on your VPS
2. Clone your repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Configure nginx:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /path/to/your/project/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
6. Start nginx:
   ```bash
   sudo service nginx restart
   ```

## Security Note

The password (9a9) is hardcoded in the usePasswordProtection.ts file. For production, consider:
1. Using environment variables
2. Implementing proper authentication
3. Using HTTPS
4. Adding rate limiting

## Features

- Password-protected editing (type '9a9' to unlock)
- Audio recording
- Persistent storage
- Responsive design
- Edit and delete functionality