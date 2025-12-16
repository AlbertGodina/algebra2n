import React, { useState, useEffect } from 'react';
import { generators } from '../utils/generators';
import { Difficulty, QuestionData, ExerciseResult } from '../types';
import { ArrowLeft, Lightbulb, Check, RefreshCw, AlertCircle, X } from 'lucide-react';

interface Props {
  id: string;
}

const Exercise: React.FC<Props> = ({ id }) => {
  const generator = generators.find(g => g.id === id);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [input, setInput] = useState<string>('');
  const [multiInput, setMultiInput] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (generator) {
      newQuestion();
    }
  }, [generator, difficulty]);

  const newQuestion = () => {
    if (!generator) return;
    setQuestion(generator.generate(difficulty));
    setInput('');
    setMultiInput({});
    setResult(null);
    setShowHint(false);
  };

  const handleCheck = () => {
    if (!generator || !question) return;
    
    let res: ExerciseResult;
    if (question.type === 'monomis-parts') {
       res = generator.checkAnswer(question, multiInput);
    } else {
       res = generator.checkAnswer(question, input);
    }
    
    setResult(res);
    if (res.isCorrect) setStreak(s => s + 1);
    else setStreak(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleCheck();
  };

  if (!generator) return <div className="p-8 text-center">Exercici no trobat</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="#/" className="flex items-center text-slate-500 hover:text-brand-600 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-medium">Tornar</span>
          </a>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  difficulty === d 
                    ? 'bg-brand-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {d === 'easy' ? 'Fàcil' : d === 'medium' ? 'Mitjà' : 'Difícil'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{generator.title}</h1>
          <p className="text-slate-500">{generator.description}</p>
          {streak > 2 && (
            <div className="mt-4 inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold animate-bounce">
              🔥 Ratxa de {streak}!
            </div>
          )}
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          <div className="bg-slate-50 border-b border-slate-100 p-8 flex items-center justify-center min-h-[160px]">
            {question && (
              <div className="text-4xl md:text-5xl font-mono font-bold text-slate-800 tracking-tight text-center">
                {question.display}
              </div>
            )}
          </div>

          <div className="p-8">
             {/* Variable info for eval */}
             {question?.metadata?.xVal !== undefined && (
                 <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-xl text-center font-mono text-lg">
                    Per a <strong>x = {question.metadata.xVal}</strong>
                 </div>
             )}

            {/* Input Area */}
            {question?.type === 'monomis-parts' ? (
              <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Coeficient</label>
                   <input 
                      type="text" 
                      className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-brand-500 outline-none font-mono text-lg transition-colors"
                      value={multiInput.coef || ''}
                      onChange={e => setMultiInput({...multiInput, coef: e.target.value})}
                      disabled={!!result}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Part Literal</label>
                   <input 
                      type="text" 
                      className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-brand-500 outline-none font-mono text-lg transition-colors"
                      value={multiInput.literal || ''}
                      onChange={e => setMultiInput({...multiInput, literal: e.target.value})}
                      disabled={!!result}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Grau</label>
                   <input 
                      type="text" 
                      className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-brand-500 outline-none font-mono text-lg transition-colors"
                      value={multiInput.degree || ''}
                      onChange={e => setMultiInput({...multiInput, degree: e.target.value})}
                      disabled={!!result}
                   />
                 </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Escriu la teva resposta..."
                  className={`w-full p-4 text-center text-2xl font-mono rounded-xl border-2 outline-none transition-all ${
                    result 
                      ? result.isCorrect 
                        ? 'border-green-500 bg-green-50 text-green-900' 
                        : 'border-red-500 bg-red-50 text-red-900'
                      : 'border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                  }`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!!result}
                  autoFocus
                />
              </div>
            )}

            {/* Hints */}
            {question?.hint && !result && (
               <div className="mt-4">
                  {showHint ? (
                    <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm border border-amber-100">
                       <p className="font-bold mb-1 flex items-center gap-2"><Lightbulb size={16}/> Pista:</p>
                       <ul className="list-disc list-inside space-y-1">
                          {question.hint.map((h, i) => <li key={i}>{h}</li>)}
                       </ul>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowHint(true)}
                      className="text-amber-600 text-sm font-semibold hover:underline flex items-center gap-1"
                    >
                      <Lightbulb size={16}/> Necessito una pista
                    </button>
                  )}
               </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              {!result ? (
                <button 
                  onClick={handleCheck}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  Comprovar
                </button>
              ) : (
                <button 
                  onClick={newQuestion}
                  className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} /> Següent Pregunta
                </button>
              )}
            </div>

            {/* Feedback */}
            {result && (
              <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className={`mt-1 p-1 rounded-full ${result.isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
                  {result.isCorrect ? <Check size={16} /> : <X size={16} />}
                </div>
                <div>
                  <p className="font-bold text-lg">{result.isCorrect ? 'Correcte!' : 'Incorrecte'}</p>
                  {result.feedback && <p className="text-sm mt-1">{result.feedback}</p>}
                  {!result.isCorrect && (
                    <div className="mt-2 text-sm">
                      <p className="opacity-80">Solució:</p>
                      <p className="font-mono font-bold text-lg mt-1">{result.correctAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
