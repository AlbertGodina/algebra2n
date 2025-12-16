export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ExerciseResult {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  feedback?: string;
}

export interface QuestionData {
  id: string;
  type: string; // The specific exercise type ID
  display: string; // The math expression to render
  answer: string | string[]; // Correct answer(s)
  hint?: string[]; // Step-by-step hints
  // For multiple input questions (like identifying parts)
  multiAnswer?: Record<string, string | number>;
  // For classification/selection questions
  options?: string[];
  correctOption?: string;
  // Metadata for rendering
  metadata?: any;
}

export interface ExerciseGenerator {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'monomis' | 'polinomis' | 'identitats';
  generate: (difficulty: Difficulty) => QuestionData;
  checkAnswer: (question: QuestionData, userInput: string | Record<string, string>) => ExerciseResult;
}

export interface ExamQuestion extends QuestionData {
  userAnswer?: string;
  isCorrect?: boolean;
}
