// app/api/admin/users/route.js
import { NextResponse } from 'next/server';
import { DbCon } from '@/lib/dbCon';
import User from '@/models/User';
import { getDataFromToken } from '@/helpers/getDataFromToken';

// Middleware to check admin access
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

// GET - Get all users with pagination
export async function GET(req) {
  try {
    const adminCheck = await checkAdminAccess(req);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -forgotPasswordToken -verifyToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new user (admin)
export async function POST(req) {
  try {
    const adminCheck = await checkAdminAccess(req);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await req.json();
    const { name, email, password, isAdmin, demographic, age } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      isVerified: true, // Admin-created users are auto-verified
      demographic,
      age
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json({ user: userResponse }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
