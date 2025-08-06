import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Footer from './footer/Footer';
import Header from './header/Header';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow pt-16">
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
