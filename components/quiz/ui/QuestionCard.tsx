import React from 'react';
import { Question } from '@/app/quiz/types';
import ScenarioMcq from '../templates/ScenarioMcq';
import LikertScale from '../templates/LikertScale';
import ImageChoice from '../templates/ImageChoice';
import VisualSwipe from '../templates/VisualSwipe';
import BudgetSlider from '../templates/BudgetSlider';
import SequenceOrder from '../templates/SequenceOrder';
import PairMatch from '../templates/PairMatch';

type QuestionCardProps = {
  question: Question;
  onAnswer: (answerId: string) => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  // Factory pattern: Route to the appropriate template based on question type
  const renderTemplate = () => {
    switch (question.type) {
      case 'scenario_mcq':
        return <ScenarioMcq question={question} onAnswer={onAnswer} />;
      
      case 'likert_5':
        return <LikertScale question={question} onAnswer={onAnswer} />;
      
      case 'image_choice':
        return <ImageChoice question={question} onAnswer={onAnswer} />;
      
      case 'visual_swipe':
        return <VisualSwipe question={question} onAnswer={onAnswer} />;
      
      case 'budget_slider':
        return <BudgetSlider question={question} onAnswer={onAnswer} />;
      
      case 'sequence_order':
        return <SequenceOrder question={question} onAnswer={onAnswer} />;
      
      case 'pair_match':
        return <PairMatch question={question} onAnswer={onAnswer} />;
      
      default:
        return (
          <div className="text-center text-red-500">
            <p>Unknown question type: {question.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 min-h-[400px] flex items-center justify-center">
      {renderTemplate()}
    </div>
  );
};

export default QuestionCard;
