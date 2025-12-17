// app/api/admin/analytics/route.js
import { NextResponse } from 'next/server';
import { DbCon } from '@/lib/dbCon';
import User from '@/models/User';
import QuizSession from '@/models/QuizSession';
import QuizQuestion from '@/models/QuizQuestion';
import UserAIProfile from '@/models/UserAIProfile';
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

// GET - Get platform analytics
export async function GET(req) {
  try {
    const adminCheck = await checkAdminAccess(req);
    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    // User Statistics
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });

    // Get users by demographic
    const usersByDemographic = await User.aggregate([
      {
        $group: {
          _id: '$demographic',
          count: { $sum: 1 }
        }
      }
    ]);

    // Quiz Session Statistics
    const totalSessions = await QuizSession.countDocuments();
    const completedSessions = await QuizSession.countDocuments({ status: 'completed' });
    const inProgressSessions = await QuizSession.countDocuments({ status: 'in_progress' });
    const abandonedSessions = await QuizSession.countDocuments({ status: 'abandoned' });

    // Average completion rate
    const completionRate = totalSessions > 0 
      ? ((completedSessions / totalSessions) * 100).toFixed(2)
      : 0;

    // Question Statistics
    const totalQuestions = await QuizQuestion.countDocuments();
    const activeQuestions = await QuizQuestion.countDocuments({ isActive: true });

    const questionsByCategory = await QuizQuestion.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const questionsByType = await QuizQuestion.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent Activity
    const recentUsers = await User.find()
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentSessions = await QuizSession.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Average XP and Streak
    const sessionStats = await QuizSession.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: null,
          avgXp: { $avg: '$xp' },
          avgStreak: { $avg: '$streak' },
          maxXp: { $max: '$xp' },
          maxStreak: { $max: '$streak' }
        }
      }
    ]);

    // Top Skills (from UserAIProfiles)
    const skillsData = await UserAIProfile.aggregate([
      {
        $project: {
          skills: { $objectToArray: '$aptitudeScores' }
        }
      },
      {
        $unwind: '$skills'
      },
      {
        $group: {
          _id: '$skills.k',
          avgMu: { $avg: '$skills.v.mu' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { avgMu: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return NextResponse.json({
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        admins: adminUsers,
        byDemographic: usersByDemographic,
        recent: recentUsers
      },
      sessions: {
        total: totalSessions,
        completed: completedSessions,
        inProgress: inProgressSessions,
        abandoned: abandonedSessions,
        completionRate: parseFloat(completionRate),
        recent: recentSessions,
        stats: sessionStats[0] || {
          avgXp: 0,
          avgStreak: 0,
          maxXp: 0,
          maxStreak: 0
        }
      },
      questions: {
        total: totalQuestions,
        active: activeQuestions,
        byCategory: questionsByCategory,
        byType: questionsByType
      },
      skills: skillsData
    }, { status: 200 });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
