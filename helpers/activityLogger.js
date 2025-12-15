/**
 * Activity Logger
 * Centralized system for tracking user activities across the app
 */

export const ActivityTypes = {
  QUIZ_STARTED: { action: 'Started Career Quiz', icon: 'PlayCircle', color: 'purple' },
  QUIZ_COMPLETED: { action: 'Completed Career Quiz', icon: 'CheckCircle', color: 'green' },
  SURVEY_STARTED: { action: 'Started Personality Survey', icon: 'FileText', color: 'orange' },
  SURVEY_COMPLETED: { action: 'Completed Personality Survey', icon: 'CheckCircle', color: 'green' },
  PROFILE_UPDATED: { action: 'Updated Profile', icon: 'User', color: 'blue' },
  RESOURCES_VISITED: { action: 'Explored Resources', icon: 'BookOpen', color: 'cyan' },
  ACHIEVEMENT_UNLOCKED: { action: 'Unlocked Achievement', icon: 'Trophy', color: 'yellow' },
  LOGIN: { action: 'Logged In', icon: 'User', color: 'blue' },
};

/**
 * Log a user activity
 * @param {string} userId - The user's ID
 * @param {object} activityType - Activity type from ActivityTypes
 */
export const logActivity = (userId, activityType) => {
  if (!userId || !activityType) return;

  const newActivity = {
    id: Date.now(),
    action: activityType.action,
    icon: activityType.icon,
    color: activityType.color,
    timestamp: new Date().toISOString(),
    userId
  };

  try {
    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
    const updatedActivities = [newActivity, ...activities].slice(0, 50); // Keep last 50
    localStorage.setItem('userActivities', JSON.stringify(updatedActivities));
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

/**
 * Get recent activities for a user
 * @param {string} userId - The user's ID
 * @param {number} limit - Number of activities to return (default: 5)
 * @returns {Array} Array of activities
 */
export const getRecentActivities = (userId, limit = 5) => {
  if (!userId) return [];

  try {
    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
    return activities
      .filter(a => a.userId === userId)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to get activities:', error);
    return [];
  }
};

/**
 * Clear all activities for a user
 * @param {string} userId - The user's ID
 */
export const clearActivities = (userId) => {
  if (!userId) return;

  try {
    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
    const filtered = activities.filter(a => a.userId !== userId);
    localStorage.setItem('userActivities', JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to clear activities:', error);
  }
};
