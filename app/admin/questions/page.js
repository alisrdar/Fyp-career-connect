'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function AdminQuestions() {
  const { user } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    text: '',
    type: 'scenario_mcq',
    category: 'aptitude',
    difficulty: 0.5,
    demographic: 'all',
    skillVector: {},
    options: [],
    interaction_config: {},
    isActive: true,
    // New v2.1 fields
    media: { url: '', type: '', alt_text: '' },
    tags: { primary: '', secondary: [], demographic_mask: [] },
    weights: { scale: '0-1', mapping: {} },
    time_limit_seconds: null,
    explanation: '',
    meta: { shuffle_options: true, max_attempts: 1, client_renderable: true }
  });

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/questions?page=${page}&limit=20`);
      setQuestions(res.data.questions);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await axios.put(`/api/admin/questions/${editingQuestion._id}`, formData);
      } else {
        await axios.post('/api/admin/questions', formData);
      }
      setShowModal(false);
      setEditingQuestion(null);
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Failed to save question:', error);
      alert(error.response?.data?.error || 'Failed to save question');
    }
  };

  const resetForm = () => {
    setFormData({
      text: '',
      type: 'scenario_mcq',
      category: 'aptitude',
      difficulty: 0.5,
      demographic: 'all',
      skillVector: {},
      options: [],
      interaction_config: {},
      isActive: true,
      media: { url: '', type: '', alt_text: '' },
      tags: { primary: '', secondary: [], demographic_mask: [] },
      weights: { scale: '0-1', mapping: {} },
      time_limit_seconds: null,
      explanation: '',
      meta: { shuffle_options: true, max_attempts: 1, client_renderable: true }
    });
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      type: question.type,
      category: question.category || '',
      difficulty: question.difficulty,
      demographic: question.demographic || 'all',
      skillVector: question.skillVector || {},
      options: question.options || [],
      interaction_config: question.interaction_config || {},
      isActive: question.isActive,
      media: question.media || { url: '', type: '', alt_text: '' },
      tags: question.tags || { primary: '', secondary: [], demographic_mask: [] },
      weights: question.weights || { scale: '0-1', mapping: {} },
      time_limit_seconds: question.time_limit_seconds || null,
      explanation: question.explanation || '',
      meta: question.meta || { shuffle_options: true, max_attempts: 1, client_renderable: true }
    });
    setShowModal(true);
  };

  const handleDelete = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await axios.delete(`/api/admin/questions/${questionId}`);
      fetchQuestions();
    } catch (error) {
      console.error('Failed to delete question:', error);
      alert(error.response?.data?.error || 'Failed to delete question');
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { id: `opt_${Date.now()}`, text: '', correct: false }]
    });
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Question Bank
            </h1>
            <button
              onClick={() => {
                setEditingQuestion(null);
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Questions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {pagination?.total || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {questions.filter(q => q.isActive).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {questions.filter(q => !q.isActive).length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : questions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No questions found
                    </td>
                  </tr>
                ) : (
                  questions.map((q) => (
                    <tr key={q._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-md truncate">
                        {q.text}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {q.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {q.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {q.difficulty.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          q.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {q.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(q)}
                          className="text-primary hover:text-primary/80 mr-3"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {pagination.pages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Question Text
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  >
                    <option value="scenario_mcq">Scenario MCQ</option>
                    <option value="image_choice">Image Choice</option>
                    <option value="sequence_order">Sequence Order</option>
                    <option value="pair_match">Pair Match</option>
                    <option value="budget_slider">Budget Slider</option>
                    <option value="visual_swipe">Visual Swipe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  >
                    <option value="aptitude">Aptitude</option>
                    <option value="personality">Personality</option>
                    <option value="career_interest">Career Interest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty (0.1 - 1.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1.0"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Demographic
                  </label>
                  <select
                    value={formData.demographic}
                    onChange={(e) => setFormData({ ...formData, demographic: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All</option>
                    <option value="middle_school">Middle School</option>
                    <option value="high_school">High School</option>
                    <option value="adult">Adult</option>
                  </select>
                </div>
              </div>

              {/* Options (for MCQ types) */}
              {['scenario_mcq', 'image_choice'].includes(formData.type) && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Options
                    </label>
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      + Add Option
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(index, 'text', e.target.value)}
                          placeholder="Option text"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                        <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg">
                          <input
                            type="checkbox"
                            checked={option.correct || false}
                            onChange={(e) => updateOption(index, 'correct', e.target.checked)}
                          />
                          <span className="text-sm">Correct</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active Question
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
                >
                  {editingQuestion ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
