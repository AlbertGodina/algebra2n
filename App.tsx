import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Exercise from './pages/Exercise';
import Exam from './pages/Exam';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  let Component;
  if (route === '#/') {
    Component = <Home />;
  } else if (route.startsWith('#/exercise/')) {
    const id = route.split('/exercise/')[1];
    Component = <Exercise id={id} />;
  } else if (route === '#/exam') {
    Component = <Exam />;
  } else {
    Component = <Home />;
  }

  // Exam mode takes over full screen, others have navbar
  const isExam = route === '#/exam';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {!isExam && <Navbar />}
      <main>
        {Component}
      </main>
    </div>
  );
};

export default App;
