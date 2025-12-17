// app/api/admin/questions/[id]/route.js
import { NextResponse } from 'next/server';
import { DbCon } from '@/lib/dbCon';
import QuizQuestion from '@/models/QuizQuestion';
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

// GET - Get single question
export async function GET(req, { params }) {
  try {
    const adminCheck = await checkAdminAccess(req);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;
    const question = await QuizQuestion.findById(id).populate('createdBy', 'name email');

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ question }, { status: 200 });
  } catch (error) {
    console.error('Get question error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update question
export async function PUT(req, { params }) {
  try {
    const adminCheck = await checkAdminAccess(req);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;
    const body = await req.json();

    const question = await QuizQuestion.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ question }, { status: 200 });
  } catch (error) {
    console.error('Update question error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete question
export async function DELETE(req, { params }) {
  try {
    const adminCheck = await checkAdminAccess(req);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;
    const question = await QuizQuestion.findByIdAndDelete(id);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Question deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete question error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
