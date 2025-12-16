import React from 'react';
import ExerciseCard from '../components/ExerciseCard';
import { generators } from '../utils/generators';

const Home: React.FC = () => {
  const categories = {
    monomis: generators.filter(g => g.category === 'monomis'),
    identitats: generators.filter(g => g.category === 'identitats'),
    polinomis: generators.filter(g => g.category === 'polinomis'),
  };

  return (
    <div className="pb-20">
      <div className="bg-brand-600 text-white py-16 px-4 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Domina l'Àlgebra
          </h1>
          <p className="text-brand-100 text-lg md:text-xl max-w-2xl mx-auto">
            Recursos interactius i autocorrectius de Matemàtiques per a 2n d'ESO.
            Practica al teu ritme i prepara't per l'examen.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📐</span>
            <h2 className="text-2xl font-bold text-slate-800">Monomis</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.monomis.map(g => <ExerciseCard key={g.id} exercise={g} />)}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">⭐</span>
            <h2 className="text-2xl font-bold text-slate-800">Identitats Notables</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.identitats.map(g => <ExerciseCard key={g.id} exercise={g} />)}
          </div>
        </section>
        
        <section>
           <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📊</span>
            <h2 className="text-2xl font-bold text-slate-800">Polinomis</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.polinomis.map(g => <ExerciseCard key={g.id} exercise={g} />)}
          </div>
        </section>
      </div>
      
      <footer className="mt-24 text-center text-slate-400 py-8 border-t border-slate-200">
        <p>Creat per a l'alumnat de 2n d'ESO</p>
      </footer>
    </div>
  );
};

export default Home;
