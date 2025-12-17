// app/api/admin/questions/route.js
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

// GET - Get all questions with filters
export async function GET(req) {
  try {
    const adminCheck = await checkAdminAccess(req);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const demographic = searchParams.get('demographic');
    const isActive = searchParams.get('isActive');

    const query = {};
    if (category) query.category = category;
    if (type) query.type = type;
    if (demographic) query.demographic = demographic;
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      QuizQuestion.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      QuizQuestion.countDocuments(query)
    ]);

    return NextResponse.json({
      questions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Get questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new question
export async function POST(req) {
  try {
    const adminCheck = await checkAdminAccess(req);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await req.json();
    
    const question = await QuizQuestion.create({
      ...body,
      createdBy: adminCheck.userId
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
