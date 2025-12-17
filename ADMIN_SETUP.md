# Admin User Setup Guide

This guide will help you create your first admin user for the Career Connect platform.

## Prerequisites

- MongoDB connection string (MONGODB_URI environment variable)
- Node.js installed on your system

## Quick Setup

### Option 1: Using the Seed Script (Recommended)

1. **Configure Admin Credentials**
   
   Open `scripts/seedAdmin.js` and update the `ADMIN_CREDENTIALS` object:

   ```javascript
   const ADMIN_CREDENTIALS = {
     name: 'Your Name',
     email: 'admin@yourdomain.com',
     password: 'YourSecurePassword123!', // Change this!
     isAdmin: true,
     isVerified: true,
     demographic: 'adult'
   };
   ```

2. **Set Environment Variable**

   Make sure your `MONGODB_URI` is set:
   
   **Windows (PowerShell):**
   ```powershell
   $env:MONGODB_URI="your-mongodb-connection-string"
   ```

   **Windows (CMD):**
   ```cmd
   set MONGODB_URI=your-mongodb-connection-string
   ```

   **Or add to `.env.local`:**
   ```
   MONGODB_URI=your-mongodb-connection-string
   ```

3. **Run the Seed Script**

   ```bash
   node scripts/seedAdmin.js
   ```

   You should see output like:
   ```
   🔌 Connecting to MongoDB...
   ✅ Connected to MongoDB
   🔐 Hashing password...
   ✅ Admin user created successfully!
   📧 Email: admin@yourdomain.com
   🔑 Password: YourSecurePassword123!
   ⚠️  IMPORTANT: Change the password after first login!
   ```

### Option 2: Manual Database Update

If you already have a user account and want to make it an admin:

1. **Connect to MongoDB**
   - Use MongoDB Compass, mongosh, or any MongoDB client

2. **Run this query in the `users` collection:**

   ```javascript
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

## Login as Admin

1. **Go to the login page:**
   ```
   http://localhost:3000/login
   ```
   or
   ```
   https://your-domain.vercel.app/login
   ```

2. **Enter your admin credentials**
   - Email: The email you configured
   - Password: The password you set

3. **Access Admin Panel**
   
   After login, navigate to:
   ```
   /admin
   ```

   Or click the Admin link if it appears in your navigation.

## Security Features Implemented

### ✅ Middleware Protection

The [middleware.js](middleware.js) now includes:

- **Route Protection**: `/admin/*` routes are protected
- **Role Verification**: JWT token is decoded to check `isAdmin` field
- **Automatic Redirects**: 
  - Not logged in → redirected to `/login`
  - Logged in but not admin → redirected to `/dashboard`

### ✅ JWT Token Enhancement

The login token now includes `isAdmin` field:

```javascript
const tokenData = {
  id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin || false  // ← Added
}
```

### ✅ API Route Protection

All admin API routes (`/api/admin/*`) check:

1. **Authentication**: Valid JWT token exists
2. **Authorization**: User has `isAdmin: true` in database

Example from `app/api/admin/users/route.js`:

```javascript
async function checkAdminAccess(req) {
  const userId = await getDataFromToken(req);
  if (!userId) {
    return { error: 'Unauthorized', status: 401 };
  }

  await DbCon();
  const user = await User.findById(userId);
  if (!user || !user.isAdmin) {
    return { error: 'Forbidden - Admin access required', status: 403 };
  }

  return { user, userId };
}
```

### ✅ Frontend Protection

Admin pages check user role:

```javascript
const { user } = useAuth();

if (user && !user.isAdmin) {
  router.push('/dashboard');
  return null;
}
```

## Troubleshooting

### Script doesn't connect to database

- Verify `MONGODB_URI` is correct
- Check network connection
- Ensure MongoDB Atlas allows connections from your IP

### "Admin user already exists"

The script will update the existing user to admin status. This is safe.

### Can't access `/admin` after login

1. Check browser console for errors
2. Verify JWT token contains `isAdmin: true`:
   - Open browser DevTools → Application → Cookies
   - Copy the `token` cookie value
   - Decode it at [jwt.io](https://jwt.io)
   - Verify `isAdmin: true` is present

3. If `isAdmin` is missing, log out and log back in

### Still can't access admin panel

1. Verify in database that user has `isAdmin: true`
2. Clear browser cookies and cache
3. Log in again

## Next Steps

After creating your admin account:

1. ✅ Login with admin credentials
2. ✅ Access `/admin` dashboard
3. ✅ Create quiz questions in Admin → Questions
4. ✅ Manage users in Admin → Users
5. ✅ Monitor platform analytics in Admin → Dashboard

## Password Best Practices

⚠️ **IMPORTANT SECURITY NOTES:**

1. **Change default password immediately** after first login
2. Use a strong password with:
   - At least 12 characters
   - Mix of uppercase and lowercase
   - Numbers and special characters
3. Never commit credentials to git
4. Use environment variables for sensitive data
5. Enable 2FA if implementing in the future

## File Changes Summary

### New Files
- ✅ `scripts/seedAdmin.js` - Admin user seed script

### Modified Files
- ✅ `middleware.js` - Added admin route protection
- ✅ `app/api/auth/login/route.js` - Added `isAdmin` to JWT token

### Existing Protection (Already Implemented)
- ✅ `app/api/admin/**/*.js` - All API routes check `user.isAdmin`
- ✅ `app/admin/**/*.js` - All admin pages check `user.isAdmin`
- ✅ `models/User.js` - Has `isAdmin` boolean field

---

**You're all set!** 🚀 The admin system is now fully protected with role-based authentication.
