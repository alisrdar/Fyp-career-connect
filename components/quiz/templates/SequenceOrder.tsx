import React, { useState } from 'react';
import { Question } from '@/app/quiz/types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SequenceOrderProps = {
  question: Question;
  onAnswer: (answerId: string) => void;
};

type SortableItemProps = {
  id: string;
  text: string;
};

const SortableItem: React.FC<SortableItemProps> = ({ id, text }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border-2 border-gray-300 
               dark:border-gray-600 cursor-move hover:border-blue-400 shadow-md
               flex items-center gap-2 sm:gap-3 touch-none"
    >
      <span className="text-gray-400 text-lg sm:text-xl">☰</span>
      <span className="text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base flex-1">{text}</span>
    </div>
  );
};

const SequenceOrder: React.FC<SequenceOrderProps> = ({ question, onAnswer }) => {
  const [items, setItems] = useState(question.options || []);
  const [submitted, setSubmitted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Send the ordered IDs as comma-separated string
    const orderedIds = items.map(item => item.id).join(',');
    onAnswer(orderedIds);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 px-2">
        {question.text}
      </h3>

      {question.media_url && (
        <div className="relative w-full max-w-md mx-auto h-40 sm:h-48 rounded-xl overflow-hidden shadow-lg">
          <img
            src={question.media_url}
            alt="Question context"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
        Drag and drop to order these items
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-400 w-8">{index + 1}.</span>
                <SortableItem id={item.id} text={item.text} />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                   rounded-lg transition-colors duration-200 shadow-lg"
        >
          Submit Order
        </button>
      )}
    </div>
  );
};

export default SequenceOrder;
