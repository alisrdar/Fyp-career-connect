import { NextResponse } from 'next/server';
import { DbCon } from '@/lib/dbCon';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import User from '@/models/User';

export async function POST(request) {
  try {
    await DbCon();

    // Get user from token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { recommendations, timestamp } = body;

    if (!recommendations) {
      return NextResponse.json(
        { error: 'Missing recommendations data' },
        { status: 400 }
      );
    }

    // Update user with career recommendations
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'careerRecommendations': {
            topRecommendation: recommendations.top_recommendation,
            alternativeCareers: recommendations.alternative_careers,
            userProfile: recommendations.user_profile,
            timestamp: timestamp || new Date().toISOString(),
            lastUpdated: new Date()
          }
        }
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Career recommendations saved successfully',
      data: user.careerRecommendations
    });

  } catch (error) {
    console.error('Error saving career recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to save recommendations', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve saved recommendations
export async function GET(request) {
  try {
    await DbCon();

    // Get user from token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).select('careerRecommendations');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.careerRecommendations) {
      return NextResponse.json(
        { success: true, data: null, message: 'No saved recommendations found' }
      );
    }

    return NextResponse.json({
      success: true,
      data: user.careerRecommendations
    });

  } catch (error) {
    console.error('Error fetching career recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations', details: error.message },
      { status: 500 }
    );
  }
}
