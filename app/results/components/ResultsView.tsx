'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatchCard from './MatchCard';
import SkillRadar from './SkillRadar';
import { Sparkles, TrendingUp, Save, MapPin, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { formatRIASECDescription } from '@/lib/riasecUtils';

interface CareerRecommendation {
  career_title: string;
  match_score: number;
  career_code?: string;
  personality_fit?: number;
  aptitude_score?: number;
  salary_range?: string;
  job_outlook?: string;
  description?: string;
  skills_matched?: string[];
  personality_alignment?: {
    analytical: number;
    creative: number;
    social: number;
    independent: number;
    structured: number;
    flexible: number;
  };
  reasoning?: string;
}

interface RecommendationData {
  top_recommendation: CareerRecommendation;
  alternative_careers: CareerRecommendation[];
  user_profile?: {
    dominant_traits?: string[];
    skill_strengths?: string[];
  };
  personality_data?: {
    hasPersonality: boolean;
    traitScores?: {
      Openness: number;
      Conscientiousness: number;
      Extraversion: number;
      Agreeableness: number;
      Neuroticism: number;
    };
  };
}

interface ResultsViewProps {
  initialData: RecommendationData;
}

export default function ResultsView({ initialData }: ResultsViewProps) {
  const [showHero, setShowHero] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const hasPersonality = initialData.personality_data?.hasPersonality ?? false;

  useEffect(() => {
    // Staggered reveal animation
    setTimeout(() => setShowHero(true), 500);
    setTimeout(() => setShowAlternatives(true), 1200);
  }, []);

  const handleSaveResults = async () => {
    try {
      // Save to database via API
      const response = await fetch('/api/results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          recommendations: initialData,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Also save to localStorage as backup
        localStorage.setItem('career_results', JSON.stringify({
          timestamp: new Date().toISOString(),
          recommendations: initialData
        }));
        
        setIsSaved(true);
        
        // Reset after 3 seconds
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        throw new Error(data.error || 'Failed to save results');
      }
    } catch (error) {
      console.error('Failed to save results:', error);
      
      // Fallback to localStorage only
      try {
        localStorage.setItem('career_results', JSON.stringify({
          timestamp: new Date().toISOString(),
          recommendations: initialData
        }));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } catch (storageError) {
        alert('Failed to save results. Please try again.');
      }
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true);
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Helper function to add new page if needed
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Header with gradient background effect
      doc.setFillColor(59, 130, 246); // Blue
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text('Career Assessment Results', pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 35, { align: 'center' });
      
      yPosition = 60;

      // Top Match Section
      doc.setFillColor(240, 253, 244); // Light green background
      doc.rect(margin, yPosition, contentWidth, 15, 'F');
      
      doc.setTextColor(22, 163, 74); // Green
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('YOUR TOP CAREER MATCH', margin + 5, yPosition + 10);
      
      yPosition += 20;

      // Top Career Details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      const topCareer = initialData.top_recommendation;
      doc.text(topCareer.career_title, margin, yPosition);
      
      yPosition += 8;

      // Career Code
      if (topCareer.career_code) {
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128);
        doc.setFont('helvetica', 'normal');
        doc.text(`Code: ${topCareer.career_code}`, margin, yPosition);
        yPosition += 8;
      }

      // Match Score Details
      doc.setFontSize(14);
      doc.setTextColor(34, 197, 94); // Green
      doc.setFont('helvetica', 'bold');
      const matchScore = Math.round(topCareer.match_score * 100);
      doc.text(`Overall Match: ${matchScore}%`, margin, yPosition);
      
      yPosition += 6;

      // Aptitude and Personality Scores
      if (topCareer.aptitude_score !== undefined || topCareer.personality_fit !== undefined) {
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        doc.setFont('helvetica', 'normal');
        let scoresText = '';
        if (topCareer.aptitude_score !== undefined) {
          scoresText += `Aptitude: ${Math.round(topCareer.aptitude_score)}%`;
        }
        if (topCareer.personality_fit !== undefined) {
          if (scoresText) scoresText += ' | ';
          scoresText += `Personality Fit: ${Math.round(topCareer.personality_fit)}%`;
        }
        doc.text(scoresText, margin, yPosition);
        yPosition += 8;
      }
      
      yPosition += 2;

      // Description
      if (topCareer.description) {
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99); // Gray
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(formatRIASECDescription(topCareer.description), contentWidth);
        doc.text(descLines, margin, yPosition);
        yPosition += descLines.length * 5 + 5;
      }

      // Reasoning
      if (topCareer.reasoning) {
        checkPageBreak(30);
        doc.setFontSize(10);
        doc.setTextColor(55, 65, 81);
        const reasoningLines = doc.splitTextToSize(formatRIASECDescription(topCareer.reasoning), contentWidth);
        doc.text(reasoningLines, margin, yPosition);
        yPosition += reasoningLines.length * 5 + 5;
      }

      // Skills Matched
      if (topCareer.skills_matched && topCareer.skills_matched.length > 0) {
        checkPageBreak(40);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Matching Skills:', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(59, 130, 246); // Blue
        
        topCareer.skills_matched.forEach((skill, idx) => {
          if (checkPageBreak(8)) {
            doc.setTextColor(59, 130, 246);
          }
          doc.text(`• ${formatRIASECDescription(skill)}`, margin + 5, yPosition);
          yPosition += 6;
        });
        
        yPosition += 5;
      }

      // Personality Profile (if available)
      if (hasPersonality && initialData.personality_data?.traitScores) {
        checkPageBreak(50);
        
        doc.setFillColor(243, 232, 255); // Light purple
        doc.rect(margin, yPosition, contentWidth, 15, 'F');
        
        doc.setTextColor(126, 34, 206); // Purple
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('YOUR PERSONALITY PROFILE', margin + 5, yPosition + 10);
        
        yPosition += 20;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        
        Object.entries(initialData.personality_data.traitScores).forEach(([trait, score]) => {
          if (checkPageBreak(8)) {
            doc.setTextColor(0, 0, 0);
          }
          doc.text(`${trait}: ${Math.round(score as number)}%`, margin + 5, yPosition);
          yPosition += 6;
        });
        
        yPosition += 8;
      }

      // Alternative Careers Section
      if (initialData.alternative_careers && initialData.alternative_careers.length > 0) {
        checkPageBreak(40);
        
        doc.setFillColor(239, 246, 255); // Light blue background
        doc.rect(margin, yPosition, contentWidth, 15, 'F');
        
        doc.setTextColor(37, 99, 235); // Blue
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('OTHER GREAT MATCHES', margin + 5, yPosition + 10);
        
        yPosition += 20;

        initialData.alternative_careers.forEach((career, idx) => {
          checkPageBreak(35);
          
          // Career title with match score
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`${idx + 2}. ${career.career_title}`, margin, yPosition);
          yPosition += 7;

          // Match score
          const altMatchScore = Math.round(career.match_score * 100);
          doc.setFontSize(10);
          doc.setTextColor(59, 130, 246);
          doc.text(`${altMatchScore}% Match`, margin + 5, yPosition);
          yPosition += 6;

          // Description
          if (career.description) {
            doc.setFontSize(9);
            doc.setTextColor(107, 114, 128);
            doc.setFont('helvetica', 'normal');
            const altDescLines = doc.splitTextToSize(formatRIASECDescription(career.description), contentWidth - 10);
            doc.text(altDescLines, margin + 5, yPosition);
            yPosition += altDescLines.length * 4 + 8;
          }
        });
      }

      // Footer
      checkPageBreak(30);
      yPosition = pageHeight - 30;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.setFont('helvetica', 'italic');
      doc.text('Career Connect - Your Path to Success', pageWidth / 2, yPosition + 10, { align: 'center' });
      doc.text('This report is based on your personality and aptitude assessment.', pageWidth / 2, yPosition + 15, { align: 'center' });

      // Save the PDF
      doc.save(`Career-Assessment-Results-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-32">
      {/* Header - The Hook */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-12 pb-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-block mb-4"
        >
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Analysis Complete!</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
          Your Career Matches
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
          Based on your personality, skills, and preferences, we've found the perfect career paths for you!
        </p>
      </motion.div>

      {/* Hero Match - The Top Pick */}
      <AnimatePresence>
        {showHero && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="container mx-auto px-4 mb-12"
          >
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-4"
              >
                <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Top Match</span>
                </div>
              </motion.div>

              <MatchCard
                career={initialData.top_recommendation}
                isHero={true}
                onClick={() => setSelectedCareer(initialData.top_recommendation)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skill Breakdown */}
      {showHero && initialData.top_recommendation.personality_alignment && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="container mx-auto px-4 mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Why This Match?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Skill Chips */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Matching Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {initialData.top_recommendation.skills_matched?.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + idx * 0.1 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium shadow-md"
                    >
                      {formatRIASECDescription(skill)}
                    </motion.span>
                  ))}
                </div>
                
                {initialData.top_recommendation.reasoning && (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    {formatRIASECDescription(initialData.top_recommendation.reasoning)}
                  </p>
                )}
              </div>

              {/* Personality Radar */}
              <SkillRadar 
                alignment={initialData.top_recommendation.personality_alignment} 
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Alternative Careers */}
      <AnimatePresence>
        {showAlternatives && initialData.alternative_careers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 mb-16"
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Other Great Matches
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialData.alternative_careers.map((career, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                  >
                    <MatchCard
                      career={career}
                      isHero={false}
                      onClick={() => setSelectedCareer(career)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Footer with Mascot */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 100 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Mascot */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut" 
                }}
                className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center text-3xl shadow-lg"
              >
                🎓
              </motion.div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Great job completing the quiz!
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  - Micah, your career guide
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className={`px-6 py-3 ${
                  isExportingPDF 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-xl hover:scale-105'
                } text-white rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center gap-2`}
              >
                <Download className="w-5 h-5" />
                {isExportingPDF ? 'Exporting...' : 'Export PDF'}
              </button>
              <button
                onClick={handleSaveResults}
                disabled={isSaved}
                className={`px-6 py-3 ${
                  isSaved 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl hover:scale-105'
                } text-white rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center gap-2`}
              >
                <Save className="w-5 h-5" />
                {isSaved ? 'Saved!' : 'Save Results'}
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/recommendations'}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Full Report
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Career Detail Modal */}
      <AnimatePresence>
        {selectedCareer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCareer(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-8"
            >
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedCareer.career_title}
                </h2>
                {selectedCareer.career_code && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Code: {selectedCareer.career_code}
                  </p>
                )}
              </div>

              {/* Match Score Banner */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overall Match Score</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {Math.round(selectedCareer.match_score * 100)}%
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedCareer.aptitude_score !== undefined && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Aptitude</p>
                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {Math.round(selectedCareer.aptitude_score)}%
                        </p>
                      </div>
                    )}
                    {selectedCareer.personality_fit !== undefined && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Personality</p>
                        <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                          {Math.round(selectedCareer.personality_fit)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Personality Survey Prompt */}
              {!hasPersonality && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        Get More Precise Results!
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                        Take our personality survey to unlock detailed personality-career matching and more accurate recommendations.
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = '/survey';
                        }}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition"
                      >
                        Take Personality Survey
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Description */}
              {selectedCareer.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {formatRIASECDescription(selectedCareer.description)}
                  </p>
                </div>
              )}

              {/* Reasoning */}
              {selectedCareer.reasoning && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Why This Match?</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {formatRIASECDescription(selectedCareer.reasoning)}
                  </p>
                </div>
              )}

              {/* Skills Matched */}
              {selectedCareer.skills_matched && selectedCareer.skills_matched.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Matching Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.skills_matched.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {formatRIASECDescription(skill)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Stats Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {selectedCareer.salary_range && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">💰 Salary Range</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedCareer.salary_range}
                    </p>
                  </div>
                )}

                {selectedCareer.job_outlook && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">📈 Job Outlook</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedCareer.job_outlook}
                    </p>
                  </div>
                )}
              </div>

              {/* Personality Traits (if available) */}
              {hasPersonality && initialData.personality_data?.traitScores && (
                <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🧠 Your Personality Profile</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(initialData.personality_data.traitScores).map(([trait, score]) => (
                      <div key={trait} className="text-center">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{trait}</div>
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {Math.round(score)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Close
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://www.onetonline.org/link/summary/${selectedCareer.career_code}`, '_blank');
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Learn More (O*NET)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
