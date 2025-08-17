# 🔧 Environment Variables Setup for Pixaro

## 📋 Local Development (.env file)

You already have a `.env` file created. Here's what you need to add to it:

```env
# Pixaro Environment Variables

# Database Configuration (Local Development)
MONGODB_URI=mongodb://localhost:27017/pixaro

# Session Security
SESSION_SECRET=pixaro-super-secret-development-key-2024

# Application Environment
NODE_ENV=development

# Server Port
PORT=3000
```

## 🚀 For Render Production Deployment

When you deploy to Render, set these environment variables in the Render dashboard:

```env
# Database Configuration (Production - MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pixaro?retryWrites=true&w=majority

# Session Security (Generate a strong random key)
SESSION_SECRET=your-super-secure-random-production-key-here

# Application Environment
NODE_ENV=production

# Server Port (Render uses this)
PORT=10000
```

## 🔑 How to Generate SESSION_SECRET

For production, generate a strong random key:

**Option 1: Using Node.js**
```javascript
require('crypto').randomBytes(64).toString('hex')
```

**Option 2: Using Online Generator**
- Visit: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" or similar

**Option 3: Using PowerShell**
```powershell
[System.Web.Security.Membership]::GeneratePassword(64, 10)
```

## ✅ Verify Setup

Your app should now start without errors:
```bash
npm start
# or
npx nodemon
```

## 🔒 Security Notes

- ✅ `.env` is in `.gitignore` (never commit it!)
- ✅ Use strong SESSION_SECRET in production
- ✅ Use MongoDB Atlas for production database
- ✅ Keep environment variables secure

---

**Your Pixaro app is now ready for both local development and production deployment!** 🎉
