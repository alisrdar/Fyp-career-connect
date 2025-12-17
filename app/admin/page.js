'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, FileText, BarChart3, TrendingUp, Activity, CheckCircle, XCircle, Clock, LogOut } from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiQuestions, setAiQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/analytics');
      setAnalytics(res.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const res = await axios.get('/api/proxy/debug/all-questions');
      console.log('AI Questions Response:', res.data);
      
      // Convert object to array since the response is an object with question IDs as keys
      const questions = res.data.questions 
        ? (Array.isArray(res.data.questions) ? res.data.questions : Object.values(res.data.questions))
        : Object.values(res.data);
      
      console.log('Extracted questions array:', questions);
      console.log('Number of questions:', questions.length);
      setAiQuestions(questions);
    } catch (error) {
      console.error('Failed to fetch AI questions:', error);
      setAiQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Access Denied</p>
      </div>
    );
  }

  if (loading || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Platform overview and management
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'questions', label: 'Questions', icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Users */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                      {analytics.users.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  {analytics.users.verified} verified
                </p>
              </div>

              {/* Completed Sessions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Completed Quizzes
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                      {analytics.sessions.completed}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  {analytics.sessions.completionRate}% completion rate
                </p>
              </div>

              {/* Total Questions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Quiz Questions
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                      {analytics.questions.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  {analytics.questions.active} active
                </p>
              </div>

              {/* In Progress */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      In Progress
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                      {analytics.sessions.inProgress}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  {analytics.sessions.abandoned} abandoned
                </p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users by Demographic */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Users by Demographic
                </h3>
                <div className="space-y-3">
                  {analytics.users.byDemographic.map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {item._id || 'Not Set'}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(item.count / analytics.users.total) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-12 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions by Category */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Questions by Category
                </h3>
                <div className="space-y-3">
                  {analytics.questions.byCategory.map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {item._id}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-secondary h-2 rounded-full"
                            style={{
                              width: `${(item.count / analytics.questions.total) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-12 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Recent Quiz Sessions
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        XP
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {analytics.sessions.recent.map((session) => (
                      <tr key={session._id}>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {session.userId?.name || 'Unknown'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`
                            inline-flex px-2 py-1 text-xs font-semibold rounded-full
                            ${session.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : session.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                            }
                          `}>
                            {session.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {session.questionCount}/{session.maxQuestions}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {session.xp}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                User Management
              </h2>
              <button
                onClick={() => router.push('/admin/users')}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
              >
                Manage Users
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all platform users. Click "Manage Users" for full CRUD operations.
            </p>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Question Management Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Question Bank
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    View questions from AI Engine and manage quiz questions
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={fetchAIQuestions}
                    disabled={loadingQuestions}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors"
                  >
                    {loadingQuestions ? 'Loading...' : 'Load AI Questions'}
                  </button>
                  <button
                    onClick={() => router.push('/admin/questions')}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
                  >
                    Manage Questions
                  </button>
                </div>
              </div>
            </div>

            {/* AI Engine Questions */}
            {loadingQuestions && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-gray-600 dark:text-gray-400">Loading AI questions...</p>
              </div>
            )}
            
            {!loadingQuestions && aiQuestions.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-gray-600 dark:text-gray-400">
                  No questions loaded. Click "Load AI Questions" to fetch questions from the AI engine.
                </p>
              </div>
            )}
            
            {!loadingQuestions && aiQuestions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  AI Engine Questions ({aiQuestions.length})
                </h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {aiQuestions.map((question, index) => (
                    <div
                      key={question.id || index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Question {index + 1}
                        </span>
                        {question.category && (
                          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded">
                            {question.category}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 dark:text-gray-100 font-medium mb-3">
                        {question.text || question.question}
                      </p>
                      {question.options && question.options.length > 0 && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                            >
                              <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span>{option.text || option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
