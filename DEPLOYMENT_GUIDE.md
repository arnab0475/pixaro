# 🚀 Pixaro Deployment Guide

Pixaro is a full-stack Node.js/Express application with MongoDB. Here are the best deployment options:

## 🎯 Recommended Deployment Options

### Option 1: Railway (Easiest - Recommended)
**Perfect for Node.js apps with databases**

1. **Sign up at [Railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Add MongoDB service** (Railway provides free MongoDB)
4. **Deploy automatically** - Railway detects Node.js apps

**Environment Variables to set in Railway:**
```
NODE_ENV=production
MONGODB_URI=<railway-mongodb-connection-string>
SESSION_SECRET=your-secret-key-here
PORT=3000
```

### Option 2: Render (Free Tier Available)
**Great for full-stack applications**

1. **Sign up at [Render.com](https://render.com)**
2. **Create Web Service** from GitHub repo
3. **Add MongoDB Atlas** (free tier)
4. **Set environment variables**

**Build Command:** `npm install`
**Start Command:** `npm start`

### Option 3: Heroku (Classic Choice)
**Reliable platform for Node.js apps**

1. **Install Heroku CLI**
2. **Create Heroku app:** `heroku create pixaro-social`
3. **Add MongoDB Atlas addon:** `heroku addons:create mongolab`
4. **Deploy:** `git push heroku main`

### Option 4: DigitalOcean App Platform
**Scalable cloud platform**

1. **Sign up at DigitalOcean**
2. **Create App** from GitHub
3. **Add MongoDB database**
4. **Configure environment variables**

## 🔧 Pre-Deployment Setup

### 1. Environment Variables
Create `.env` file (don't commit to git):
```
MONGODB_URI=mongodb://localhost:27017/pixaro
SESSION_SECRET=your-super-secret-session-key
NODE_ENV=development
PORT=3000
```

### 2. Update app.js for Production
Add this to your app.js:
```javascript
// Production MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pixaro';
mongoose.connect(mongoUri);

// Production session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

### 3. Static File Serving
Ensure this is in your app.js:
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

## 🗄️ Database Options

### MongoDB Atlas (Recommended)
- **Free tier:** 512MB storage
- **Global clusters**
- **Automatic backups**
- **Easy connection strings**

### Railway MongoDB
- **Integrated with Railway**
- **Easy setup**
- **Good for development**

## 📁 File Upload Considerations

For production, consider using:
- **Cloudinary** for image hosting
- **AWS S3** for file storage
- **Railway volumes** for persistent storage

## 🔒 Security Checklist

- [ ] Set strong SESSION_SECRET
- [ ] Use HTTPS in production
- [ ] Validate all user inputs
- [ ] Rate limit API endpoints
- [ ] Use helmet.js for security headers
- [ ] Keep dependencies updated

## 🚀 Quick Deploy Commands

### Railway
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Render
```bash
# Connect GitHub repo in Render dashboard
# Set environment variables
# Deploy automatically
```

### Heroku
```bash
npm install -g heroku
heroku login
heroku create pixaro-social
heroku config:set MONGODB_URI=your-connection-string
heroku config:set SESSION_SECRET=your-secret
git push heroku main
```

## 🎉 Post-Deployment

1. **Test all features:**
   - User registration/login
   - Post creation
   - Likes and comments
   - Follow/unfollow
   - Dark mode toggle

2. **Monitor logs** for any errors
3. **Set up custom domain** (optional)
4. **Configure SSL certificate**

## 🆘 Troubleshooting

### Common Issues:
- **MongoDB connection errors:** Check connection string
- **File upload issues:** Check storage configuration
- **Session problems:** Verify SESSION_SECRET
- **Static files not loading:** Check public folder path

### Debug Commands:
```bash
# Check logs
railway logs
heroku logs --tail
render logs

# Test locally
npm start
```

## 📞 Support

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test database connection
4. Check file permissions

---

**Pixaro is ready for production!** 🎊
Choose your preferred platform and follow the steps above.
