import { useState, useEffect } from 'react';
import { GameId, ConversionProfile } from './types';
import Header from './components/Header';
import SensitivityConverter from './components/SensitivityConverter';
import SupportedGames from './components/SupportedGames';
import SavedProfiles from './components/SavedProfiles';
import FAQ from './components/FAQ';
import { Gamepad2, Zap } from 'lucide-react';

export default function App() {
  // Main states for the active calculator session
  const [sourceGameId, setSourceGameId] = useState<GameId>('valorant');
  const [targetGameId, setTargetGameId] = useState<GameId>('cs2');
  const [sourceSens, setSourceSens] = useState<number>(0.4);
  const [sourceDpi, setSourceDpi] = useState<number>(800);
  const [targetDpi, setTargetDpi] = useState<number>(800);

  // Profile history stored in localStorage
  const [profiles, setProfiles] = useState<ConversionProfile[]>([]);
  const [activeSection, setActiveSection] = useState<string>('converter');

  const createProfileId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  // Load profiles from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sensshift_profiles');
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setProfiles(parsed);
      }
    } catch (e) {
      console.error('Falha ao parsear os perfis salvos', e);
    }
  }, []);

  // Save profile helper
  const handleSaveProfile = (newProfileData: Omit<ConversionProfile, 'id' | 'createdAt'>) => {
    const newProfile: ConversionProfile = {
      ...newProfileData,
      id: createProfileId(),
      createdAt: new Date().toISOString(),
    };

    setProfiles((prevProfiles) => {
      const updated = [newProfile, ...prevProfiles];
      localStorage.setItem('sensshift_profiles', JSON.stringify(updated));
      return updated;
    });
  };

  // Delete profile helper
  const handleDeleteProfile = (id: string) => {
    setProfiles((prevProfiles) => {
      const updated = prevProfiles.filter((profile) => profile.id !== id);
      localStorage.setItem('sensshift_profiles', JSON.stringify(updated));
      return updated;
    });
  };

  // Apply profile helper to inject saved values back into active states
  const handleApplyProfile = (profile: ConversionProfile) => {
    setSourceGameId(profile.sourceGameId);
    setTargetGameId(profile.targetGameId);
    setSourceSens(profile.sourceSens);
    setSourceDpi(profile.sourceDpi);
    setTargetDpi(profile.targetDpi);

    // Scroll back to top converter visually with smooth animation
    const element = document.getElementById('converter');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Trigger quick choices from main games grid
  const handleSelectAsSource = (id: GameId) => {
    setSourceGameId(id);
    const element = document.getElementById('converter');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSelectAsTarget = (id: GameId) => {
    setTargetGameId(id);
    const element = document.getElementById('converter');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Smooth scroll routing helper
  const handleScrollTo = (elementId: string) => {
    setActiveSection(elementId);
    const element = document.getElementById(elementId);
    if (element) {
      const offset = 120; // accounting for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Monitor scroll height to set correct link highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['converter', 'games', 'profiles', 'faq'];
      const scrollPos = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col font-sans antialiased">
      {/* Dynamic Header navbar */}
      <Header onScrollTo={handleScrollTo} activeSection={activeSection} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 space-y-20">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-4 max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#191c1e] tracking-tight leading-tight">
            Ajuste sua mira <span className="text-[#006398] relative">com precisão<span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#bbdefb]/60 -z-10 rounded"></span></span>.
          </h1>
          <p className="text-base md:text-lg text-[#42474c] leading-relaxed max-w-2xl mx-auto font-medium">
            Converta instantaneamente sua sensibilidade de mouse e DPI entre os principais títulos de FPS em segundos de forma cientificamente precisa.
          </p>
        </section>

        {/* SECTION 1: CONVERTER ROW */}
        <div id="converter" className="scroll-mt-32">
          <SensitivityConverter
            sourceGameId={sourceGameId}
            targetGameId={targetGameId}
            sourceSens={sourceSens}
            sourceDpi={sourceDpi}
            targetDpi={targetDpi}
            onSourceGameChange={setSourceGameId}
            onTargetGameChange={setTargetGameId}
            onSourceSensChange={setSourceSens}
            onSourceDpiChange={setSourceDpi}
            onTargetDpiChange={setTargetDpi}
            onSaveProfile={handleSaveProfile}
          />
        </div>

        {/* SECTION 2: SUPPORTED GAMES */}
        <div id="games" className="scroll-mt-32 bg-white rounded-2xl shadow-[0px_10px_30px_rgba(187,222,251,0.08)] p-6 md:p-8">
          <SupportedGames
            onSelectAsSource={handleSelectAsSource}
            onSelectAsTarget={handleSelectAsTarget}
            currentSourceId={sourceGameId}
            currentTargetId={targetGameId}
          />
        </div>

        {/* DECORATIVE BRANDING BANNER AS IN PREVIEW */}
        <section className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl group border border-slate-200">
          <img
            alt="Setup gamer com teclado e mouse"
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
            src="/banner.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191c1e]/90 via-[#191c1e]/40 to-transparent flex items-end p-8 md:p-12">
            <div className="text-white space-y-2 max-w-xl animate-fade-in-up">
              <span className="text-[11px] font-bold text-[#6cbdfe] tracking-widest uppercase">
                SEU PRINCIPAL PORTAL DE SENSIBILIDADES
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#ffffff] tracking-tight">
                Jogue como sempre jogou.
              </h3>
              <p className="text-sm md:text-base text-gray-200 font-medium">
                Sua sensibilidade é como uma identidade dentro da partida. Mantenha-a intacta em qualquer jogo.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: SAVED PROFILES */}
        <div id="profiles" className="scroll-mt-32">
          <SavedProfiles
            profiles={profiles}
            onDeleteProfile={handleDeleteProfile}
            onApplyProfile={handleApplyProfile}
          />
        </div>

        {/* SECTION 4: FAQ CENTRAL */}
        <div id="faq" className="scroll-mt-32">
          <FAQ />
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#eceef0] w-full py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-1.5 font-extrabold text-xl text-[#006398]">
              <Gamepad2 className="w-5 h-5 text-[#006398]" />
              <span>SensShift</span>
            </div>
            <p className="text-xs text-[#72787d] text-center md:text-left">
              © {new Date().getFullYear()} SensShift Tactical. Built for precision.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <button 
              onClick={() => handleScrollTo('converter')}
              className="text-xs font-semibold text-[#42474c] hover:text-[#006398] transition-colors"
              id="footer-link-converter"
            >
              Calculadora
            </button>
            <button 
              onClick={() => handleScrollTo('games')} 
              className="text-xs font-semibold text-[#42474c] hover:text-[#006398] transition-colors"
              id="footer-link-games"
            >
              Motores e Yaw
            </button>
            <button 
              onClick={() => handleScrollTo('profiles')} 
              className="text-xs font-semibold text-[#42474c] hover:text-[#006398] transition-colors"
              id="footer-link-profiles"
            >
              Meus Perfis
            </button>
            <button 
              onClick={() => handleScrollTo('faq')} 
              className="text-xs font-semibold text-[#42474c] hover:text-[#006398] transition-colors"
              id="footer-link-faq"
            >
              FAQ
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
