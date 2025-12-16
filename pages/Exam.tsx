import React, { useState, useEffect } from 'react';
import { generators } from '../utils/generators';
import { QuestionData, ExamQuestion } from '../types';
import { Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const Exam: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [finished, setFinished] = useState(false);
  const [input, setInput] = useState('');

  // Timer
  useEffect(() => {
    if (started && !finished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !finished) {
      finishExam();
    }
  }, [started, finished, timeLeft]);

  const startExam = () => {
    // Generate 10 random questions
    const qs: ExamQuestion[] = [];
    for (let i = 0; i < 10; i++) {
       const gen = generators[Math.floor(Math.random() * generators.length)];
       const q = gen.generate('medium'); // Default medium for exam
       // Skip multi-input types for now to simplify exam UI
       if (q.type === 'monomis-parts') {
         i--; 
         continue;
       }
       qs.push(q);
    }
    setQuestions(qs);
    setStarted(true);
    setFinished(false);
    setTimeLeft(15 * 60);
    setCurrentIdx(0);
  };

  const handleNext = () => {
    // Save answer
    const updatedQs = [...questions];
    updatedQs[currentIdx].userAnswer = input;
    setQuestions(updatedQs);
    setInput('');

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    // Calculate results
    const finalQs = questions.map(q => {
        const gen = generators.find(g => g.generate('easy').type === q.type); // Find generator by type logic
        if (!gen) return { ...q, isCorrect: false };
        
        const check = gen.checkAnswer(q, q.userAnswer || '');
        return { ...q, isCorrect: check.isCorrect };
    });
    setQuestions(finalQs);
    setFinished(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <Clock size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mode Examen</h1>
          <p className="text-slate-500 mb-8">
            Tens 15 minuts per resoldre 10 problemes aleatoris. 
            Els resultats es mostraran al final.
          </p>
          <button 
            onClick={startExam}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-100 shadow-lg shadow-brand-500/30"
          >
            Començar Examen
          </button>
          <a href="#/" className="block mt-4 text-slate-400 hover:text-slate-600 font-medium">Torna a l'inici</a>
        </div>
      </div>
    );
  }

  if (finished) {
    const score = questions.filter(q => q.isCorrect).length;
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
             <div className="bg-brand-600 text-white p-8 text-center">
                <h1 className="text-2xl font-bold opacity-90 mb-2">Resultats de l'Examen</h1>
                <div className="text-6xl font-black mb-2">{score}/10</div>
                <p className="text-brand-100 font-medium">
                  {score >= 9 ? 'Excel·lent!' : score >= 7 ? 'Molt bé!' : score >= 5 ? 'Aprovat' : 'Cal repassar'}
                </p>
             </div>
             <div className="p-8">
                <div className="space-y-6">
                   {questions.map((q, i) => (
                      <div key={i} className={`p-4 rounded-xl border-l-4 ${q.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                         <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-700 text-sm uppercase">Pregunta {i+1}</span>
                            {q.isCorrect ? <CheckCircle className="text-green-600" size={20}/> : <XCircle className="text-red-500" size={20}/>}
                         </div>
                         <div className="font-mono text-xl font-bold text-slate-800 mb-2">{q.display}</div>
                         <div className="text-sm">
                            <span className="text-slate-500">La teva resposta: </span>
                            <span className={`font-mono font-medium ${q.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                               {q.userAnswer || '(buit)'}
                            </span>
                         </div>
                         {!q.isCorrect && (
                             <div className="text-sm mt-1">
                                <span className="text-slate-500">Correcte: </span>
                                <span className="font-mono font-medium text-slate-800">{q.answer}</span>
                             </div>
                         )}
                      </div>
                   ))}
                </div>
                <div className="mt-8 flex gap-4">
                   <button onClick={startExam} className="flex-1 py-3 rounded-xl font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors">Repetir Examen</button>
                   <a href="#/" className="flex-1 py-3 rounded-xl font-bold text-center bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Sortir</a>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
         {/* Progress Header */}
         <div className="flex items-center justify-between mb-6">
            <div className="text-slate-500 font-medium">Pregunta {currentIdx + 1} de 10</div>
            <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
               <Clock size={20} /> {formatTime(timeLeft)}
            </div>
         </div>

         {/* Question Card */}
         <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 border border-slate-200">
             <div className="text-center py-8">
                 <div className="text-4xl font-mono font-bold text-slate-800 mb-8">{currentQ.display}</div>
                 <input 
                    type="text" 
                    className="w-full text-center text-2xl p-4 border-b-2 border-slate-200 focus:border-brand-600 outline-none bg-transparent font-mono transition-colors placeholder:text-slate-300"
                    placeholder="Escriu la resposta..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' ? handleNext() : null}
                    autoFocus
                 />
             </div>
         </div>

         {/* Navigation */}
         <div className="mt-8 flex justify-end">
            <button 
               onClick={handleNext}
               className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
            >
               {currentIdx === 9 ? 'Finalitzar' : 'Següent'} <ArrowRight size={20} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default Exam;
