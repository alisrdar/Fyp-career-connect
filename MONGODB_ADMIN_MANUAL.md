# MongoDB Manual Admin Creation Guide

## Problem

The seed script failed with error:
```
❌ Error seeding admin: user is not allowed to do action [find] on [careerconnect.users]
```

This means your MongoDB user doesn't have proper read/write permissions on the database.

## Solution: Create Admin Manually via MongoDB Atlas

Follow these steps to create an admin user directly in your MongoDB database.

---

## Option 1: Using MongoDB Atlas Web Interface (Easiest)

### Step 1: Login to MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login with your credentials
3. Select your cluster (`sardarcluster`)

### Step 2: Browse Collections

1. Click **"Browse Collections"** button on your cluster
2. Select database: `careerconnect`
3. Select collection: `users`

### Step 3: Find Your User Account

1. If you already have an account created via signup:
   - Find your user by email in the `users` collection
   - Click the **Edit** button (pencil icon)
   - Add or modify the field `isAdmin` to `true`
   - Add or modify the field `isVerified` to `true`
   - Click **Update**

2. If you don't have an account yet:
   - Click **"INSERT DOCUMENT"**
   - Copy the JSON template below and paste it
   - **IMPORTANT:** Update the email and password hash

### Step 4: Create New Admin Document

Use this JSON template (modify the values):

```json
{
  "name": "Admin User",
  "email": "admin@careerconnect.com",
  "password": "$2a$10$REPLACE_THIS_WITH_BCRYPT_HASH",
  "isVerified": true,
  "isAdmin": true,
  "forgotPasswordToken": "",
  "forgotPasswordTokenExpiry": null,
  "verifyToken": "",
  "verifyTokenExpiry": null,
  "age": null,
  "demographic": "adult",
  "gender": "",
  "phone": "",
  "address": "",
  "currentAbility": 0,
  "createdAt": { "$date": { "$numberLong": "1734393600000" } },
  "updatedAt": { "$date": { "$numberLong": "1734393600000" } }
}
```

### Step 5: Generate Password Hash

You need to hash your password before adding it. Use one of these methods:

#### Method A: Online Bcrypt Generator (Quick)
1. Go to [bcrypt-generator.com](https://bcrypt-generator.com/)
2. Enter your desired password (e.g., `Admin@123456`)
3. Set rounds to `10`
4. Click **Generate Hash**
5. Copy the hash (starts with `$2a$10$...`)
6. Replace `$2a$10$REPLACE_THIS_WITH_BCRYPT_HASH` with your hash

#### Method B: Node.js Script (More Secure)
Run this in your terminal:

```powershell
node -e "console.log(require('bcryptjs').hashSync('Admin@123456', 10))"
```

Copy the output and use it as the password value.

---

## Option 2: Using MongoDB Compass (Desktop App)

### Step 1: Download MongoDB Compass
- Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass)

### Step 2: Connect to Your Database

1. Open MongoDB Compass
2. Click **"New Connection"**
3. Paste your connection string:
   ```
   mongodb+srv://<username>:<password>@sardarcluster.heu2hii.mongodb.net/careerconnect
   ```
4. Replace `<username>` and `<password>` with your MongoDB credentials
5. Click **Connect**

### Step 3: Navigate to Users Collection

1. In the left sidebar: `careerconnect` → `users`
2. Click **"ADD DATA"** → **"Insert Document"**

### Step 4: Insert Admin Document

Paste the JSON template from Option 1 (with your password hash)

---

## Option 3: Using mongosh (Command Line)

### Step 1: Install mongosh
Download from [mongodb.com/docs/mongodb-shell/install](https://www.mongodb.com/docs/mongodb-shell/install/)

### Step 2: Connect to Database

```bash
mongosh "mongodb+srv://sardarcluster.heu2hii.mongodb.net/careerconnect" --username YOUR_USERNAME
```

Enter your password when prompted.

### Step 3: Update Existing User

If you have an account already:

```javascript
use careerconnect

db.users.updateOne(
  { email: "your@email.com" },
  { 
    $set: { 
      isAdmin: true,
      isVerified: true 
    } 
  }
)
```

### Step 4: Create New Admin User

```javascript
use careerconnect

db.users.insertOne({
  name: "Admin User",
  email: "admin@careerconnect.com",
  password: "$2a$10$YOUR_BCRYPT_HASH_HERE",
  isVerified: true,
  isAdmin: true,
  demographic: "adult",
  currentAbility: 0,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## Verify Admin Access

After creating the admin user:

### 1. Login to Your App

Navigate to:
```
http://localhost:3000/login
```
or your deployed URL

### 2. Use Admin Credentials

- **Email:** The email you set (e.g., `admin@careerconnect.com`)
- **Password:** The password you hashed (e.g., `Admin@123456`)

### 3. Access Admin Panel

After successful login, navigate to:
```
http://localhost:3000/admin
```

If you're redirected to `/dashboard`, it means `isAdmin` is not set correctly. Go back to MongoDB and verify:
```javascript
db.users.findOne({ email: "admin@careerconnect.com" })
```

Should show:
```json
{
  ...
  "isAdmin": true,
  "isVerified": true
}
```

---

## Troubleshooting

### Issue: "Invalid credentials" when logging in

**Cause:** Password hash is incorrect or password doesn't match

**Solution:**
1. Generate a new bcrypt hash
2. Update the user's password field in MongoDB
3. Try logging in again

### Issue: Still redirected to dashboard after login

**Cause:** JWT token doesn't contain `isAdmin` field

**Solution:**
1. Verify `isAdmin: true` in MongoDB
2. Log out completely
3. Clear browser cookies
4. Log in again (new JWT will be generated with `isAdmin: true`)

### Issue: Can't connect to MongoDB

**Cause:** IP whitelist or connection string issues

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Add your current IP or use `0.0.0.0/0` (allow all) for testing
3. Verify connection string is correct

---

## Database Permissions (For Future Reference)

If you want to fix the permissions issue to use the seed script:

### Step 1: Go to MongoDB Atlas

1. Cluster → **Database Access**
2. Find your database user

### Step 2: Edit User Permissions

1. Click **Edit** on your user
2. Change **Database User Privileges** to:
   - **Built-in Role:** `Atlas admin` (full access)
   - Or **Custom Role:** Read and write to all databases

3. Click **Update User**

### Step 3: Run Seed Script Again

```bash
node scripts/seedAdmin.js
```

---

## Security Best Practices

⚠️ **IMPORTANT REMINDERS:**

1. **Change Default Password** after first login
2. **Don't use simple passwords** - use strong, complex passwords
3. **Never commit** real passwords or hashes to git
4. **Limit MongoDB access** to specific IPs in production
5. **Use environment variables** for sensitive data

---

## Quick Reference

### MongoDB Atlas Dashboard
- URL: https://cloud.mongodb.com/
- Navigate: Cluster → Browse Collections → careerconnect → users

### Required Fields for Admin
```
isAdmin: true
isVerified: true
password: <bcrypt hash>
email: <your admin email>
```

### Bcrypt Hash Generation
```bash
# Online: https://bcrypt-generator.com/
# Command: node -e "console.log(require('bcryptjs').hashSync('YourPassword', 10))"
```

---

You're all set! After creating the admin user, you can login and access the admin panel at `/admin`. 🎉
