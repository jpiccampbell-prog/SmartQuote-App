# SmartQuote - AI Quote Generator for Contractors

## Deployment Instructions

### 1. Create GitHub Repository

1. Go to https://github.com
2. Click "New Repository"
3. Name it: `smartquote-app`
4. Make it Public
5. Don't initialize with README
6. Click "Create Repository"

### 2. Upload Files to GitHub

Upload these files to your new repository:
- `index.html` (main app)
- `netlify.toml` (Netlify config)
- `netlify/functions/generate-quote.js` (backend function)

### 3. Deploy on Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Select your `smartquote-app` repository
5. Click "Deploy site"

### 4. Add API Key as Environment Variable

**IMPORTANT:** Your API key must be stored securely!

1. In Netlify, go to your site
2. Click "Site configuration" → "Environment variables"
3. Click "Add a variable"
4. Key: `ANTHROPIC_API_KEY`
5. Value: `[YOUR API KEY - I'll tell you in chat]`
6. Click "Create variable"
7. Click "Trigger deploy" to redeploy with the new variable

### 5. Test Your App!

Your app will be live at: `https://YOUR-SITE-NAME.netlify.app`

## How It Works

1. User fills out quote form
2. Frontend sends job details to Netlify Function
3. Netlify Function calls Anthropic API (with secure API key)
4. AI generates professional quote
5. Quote is displayed and can be downloaded as PDF

## Cost

- **Netlify Hosting:** FREE (125,000 function calls/month)
- **Anthropic API:** ~$0.02-0.05 per quote
- **100 quotes:** ~$3-5
- **1000 quotes:** ~$30-50

## Security

✅ API key stored in environment variables (not in code)
✅ Backend validates requests
✅ CORS handled properly
✅ No sensitive data exposed to users
