import React from 'react';
import * as Icons from 'lucide-react';
import { ExerciseGenerator } from '../types';

interface Props {
  exercise: ExerciseGenerator;
}

const ExerciseCard: React.FC<Props> = ({ exercise }) => {
  // Dynamic icon rendering
  const IconComponent = (Icons as any)[exercise.icon] || Icons.HelpCircle;

  return (
    <a href={`#/exercise/${exercise.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 hover:border-brand-200">
        <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
          <IconComponent size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-brand-600 transition-colors">
          {exercise.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed">
          {exercise.description}
        </p>
        <div className="mt-4 flex items-center text-sm font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          Començar <Icons.ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </a>
  );
};

export default ExerciseCard;
