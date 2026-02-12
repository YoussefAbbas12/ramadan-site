import { Routes , Route } from 'react-router-dom';
import NotFound from './pages/not-found';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div dir='rtl' className='min-h-screen bg-[#050510] text-white selection:bg-yellow-500/30'>
      <Routes>
        <Route path='/' element={<Dashboard />}/>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;