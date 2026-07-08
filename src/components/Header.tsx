import { useState } from 'react';
import { Menu, X, Gamepad2 } from 'lucide-react';

interface HeaderProps {
  onScrollTo: (elementId: string) => void;
  activeSection: string;
}

export default function Header({ onScrollTo, activeSection }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'converter', label: 'Converter' },
    { id: 'games', label: 'Jogos Suportados' },
    { id: 'profiles', label: 'Meus Perfis' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f7f9fb]/80 backdrop-blur-md shadow-[0px_10px_30px_rgba(187,222,251,0.2)]">
      <nav className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        {/* Brand */}
        <button 
          onClick={() => onScrollTo('converter')}
          className="flex items-center gap-2 font-bold text-2xl text-[#006398] hover:opacity-95 transition-opacity"
          id="btn-brand-home"
        >
          <Gamepad2 className="w-6 h-6 text-[#006398]" />
          <span>SensShift</span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onScrollTo(item.id)}
              className={`font-medium text-sm transition-colors duration-200 py-1 border-b-2 ${
                activeSection === item.id
                  ? 'text-[#006398] border-[#006398] font-semibold'
                  : 'text-[#42474c] border-transparent hover:text-[#006398]'
              }`}
              id={`nav-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:block">
          <button
            onClick={() => onScrollTo('converter')}
            className="bg-[#006398] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-md hover:bg-[#004b74]"
            id="btn-get-started"
          >
            Começar Agora
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-[#42474c] hover:text-[#006398] hover:bg-[#eceef0] focus:outline-none transition-colors"
            id="btn-mobile-menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-[#eceef0] px-6 py-4 space-y-3 shadow-lg absolute w-full left-0 transition-all">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onScrollTo(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                activeSection === item.id
                  ? 'bg-[#bbdefb]/40 text-[#006398] font-semibold'
                  : 'text-[#42474c] hover:bg-[#f2f4f6] hover:text-[#006398]'
              }`}
              id={`mobile-nav-${item.id}`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                onScrollTo('converter');
                setIsOpen(false);
              }}
              className="w-full bg-[#006398] text-white text-center py-2.5 rounded-lg font-semibold text-sm hover:bg-[#004b74] transition-colors"
              id="btn-mobile-start"
            >
              Começar Agora
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
