import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { AuthProvider } from './context/AuthContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Kundali from './pages/Kundali';
import Matching from './pages/Matching';
import Tarot from './pages/Tarot';
import Numerology from './pages/Numerology';
import KP from './pages/KP';
import DivisionalCharts from './pages/DivisionalCharts';
import DoshasYogas from './pages/DoshasYogas';
import Summary from './pages/Summary';
import Chat from './pages/Chat';
import Login from './pages/Login';
import './styles/global.css';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

export default function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <AuthProvider>
        <BrowserRouter>
          <Nav />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kundali" element={<Kundali />} />
              <Route path="/matching" element={<Matching />} />
              <Route path="/tarot" element={<Tarot />} />
              <Route path="/numerology" element={<Numerology />} />
              <Route path="/kp" element={<KP />} />
            <Route path="/divisional-charts" element={<DivisionalCharts />} />
            <Route path="/doshas-yogas" element={<DoshasYogas />} />
            <Route path="/summary" element={<Summary />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </GoogleReCaptchaProvider>
  );
}
