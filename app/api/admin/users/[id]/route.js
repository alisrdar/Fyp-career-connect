// app/api/admin/users/[id]/route.js
import { NextResponse } from 'next/server';
import { DbCon } from '@/lib/dbCon';
import User from '@/models/User';
import { getDataFromToken } from '@/helpers/getDataFromToken';

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

// GET - Get single user
export async function GET(req, { params }) {
  try {
    const adminCheck = await checkAdminAccess(req);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;
    const user = await User.findById(id).select('-password -forgotPasswordToken -verifyToken');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update user
export async function PUT(req, { params }) {
  try {
    const adminCheck = await checkAdminAccess(req);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;
    const body = await req.json();
    
    // Don't allow password updates through this endpoint
    delete body.password;
    delete body.forgotPasswordToken;
    delete body.verifyToken;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).select('-password -forgotPasswordToken -verifyToken');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(req, { params }) {
  try {
    const adminCheck = await checkAdminAccess(req);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;
    
    // Prevent deleting yourself
    if (id === adminCheck.userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
