# 🚀 Deploy Pixaro on Render - Complete Guide

## 📋 Prerequisites
- GitHub account
- Render account (free at [render.com](https://render.com))
- MongoDB Atlas account (free at [mongodb.com](https://mongodb.com))

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (choose free tier M0)
4. Wait for cluster to be created (2-3 minutes)

### 1.2 Configure Database Access
1. **Database Access** → **Add New Database User**
   - Username: `pixaro-user`
   - Password: Generate secure password (save it!)
   - Database User Privileges: **Read and write to any database**

### 1.3 Configure Network Access
1. **Network Access** → **Add IP Address**
2. Choose **Allow Access from Anywhere** (0.0.0.0/0)
3. Click **Confirm**

### 1.4 Get Connection String
1. **Clusters** → **Connect** → **Connect your application**
2. Copy the connection string (looks like):
   ```
   mongodb+srv://pixaro-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace `<password>` with your actual password
4. Add database name: `pixaro` at the end before the `?`
   ```
   mongodb+srv://pixaro-user:yourpassword@cluster0.xxxxx.mongodb.net/pixaro?retryWrites=true&w=majority
   ```

## 🚀 Step 2: Deploy on Render

### 2.1 Push Code to GitHub
1. **Create GitHub repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Pixaro social media app"
   git branch -M main
   git remote add origin https://github.com/yourusername/pixaro.git
   git push -u origin main
   ```

### 2.2 Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. **Connect GitHub repository**
4. Select your Pixaro repository
5. Configure the service:

**Basic Settings:**
- **Name:** `pixaro-social`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Runtime:** `Node`

**Build & Deploy:**
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 2.3 Set Environment Variables
In the **Environment** section, add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `SESSION_SECRET` | Generate random string (e.g., `pixaro-super-secret-2024-key`) |
| `PORT` | `10000` |

### 2.4 Deploy
1. Click **Create Web Service**
2. Wait for deployment (5-10 minutes)
3. Your app will be live at: `https://pixaro-social-xxxx.onrender.com`

## ✅ Step 3: Verify Deployment

### 3.1 Test Core Features
1. **Visit your live URL**
2. **Register a new account**
3. **Login successfully**
4. **Upload a post**
5. **Test likes and comments**
6. **Test follow/unfollow**
7. **Toggle dark mode**

### 3.2 Check Logs
If anything doesn't work:
1. Go to Render Dashboard
2. Click on your service
3. Check **Logs** tab for errors

## 🔧 Troubleshooting

### Common Issues:

**1. "Cannot connect to MongoDB"**
- ✅ Check MongoDB Atlas connection string
- ✅ Verify database user credentials
- ✅ Ensure network access allows all IPs

**2. "Session errors"**
- ✅ Check SESSION_SECRET is set
- ✅ Verify environment variables

**3. "Static files not loading"**
- ✅ Check public folder is included in repository
- ✅ Verify CSS/JS paths in templates

**4. "File upload errors"**
- ✅ Note: Render's free tier has ephemeral storage
- ✅ Uploaded files may be lost on restart
- ✅ Consider using Cloudinary for production

### Debug Commands:
```bash
# Check environment variables in Render logs
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('Session Secret:', process.env.SESSION_SECRET ? 'Set' : 'Not set');
```

## 🎉 Success!

Your Pixaro social media platform is now live! 🚀

**Features Available:**
- ✅ User registration and authentication
- ✅ Post creation with image uploads
- ✅ Like and comment system
- ✅ Follow/unfollow users
- ✅ Dark mode theme switching
- ✅ Responsive design
- ✅ Real-time interactions

## 🔄 Future Updates

To update your deployed app:
1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push origin main
   ```
3. Render will automatically redeploy!

## 📞 Support

If you need help:
1. Check Render documentation
2. Review MongoDB Atlas guides
3. Check application logs in Render dashboard

---

**🎊 Congratulations! Pixaro is now live on the web!**
