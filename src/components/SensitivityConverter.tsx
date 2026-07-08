import { useState, useEffect, type FormEvent } from 'react';
import { GameId, ConversionProfile } from '../types';
import { GAMES, GAMES_LIST, convertSensitivity, calculateDistance360 } from '../gamesData';
import { Copy, Check, Save, RefreshCw, MousePointer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SensitivityConverterProps {
  sourceGameId: GameId;
  targetGameId: GameId;
  sourceSens: number;
  sourceDpi: number;
  targetDpi: number;
  onSourceGameChange: (id: GameId) => void;
  onTargetGameChange: (id: GameId) => void;
  onSourceSensChange: (sens: number) => void;
  onSourceDpiChange: (dpi: number) => void;
  onTargetDpiChange: (dpi: number) => void;
  onSaveProfile: (profile: Omit<ConversionProfile, 'id' | 'createdAt'>) => void;
}

export default function SensitivityConverter({
  sourceGameId,
  targetGameId,
  sourceSens,
  sourceDpi,
  targetDpi,
  onSourceGameChange,
  onTargetGameChange,
  onSourceSensChange,
  onSourceDpiChange,
  onTargetDpiChange,
  onSaveProfile,
}: SensitivityConverterProps) {
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileTitle, setProfileTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [localSensText, setLocalSensText] = useState(sourceSens === 0 ? '' : sourceSens.toString());

  // Keep local text input in sync with external state changes (slider, swapping, profiles)
  useEffect(() => {
    const parsed = parseFloat(localSensText);
    if (isNaN(parsed) || parsed !== sourceSens) {
      setLocalSensText(sourceSens === 0 ? '' : sourceSens.toString());
    }
  }, [sourceSens]);

  const handleLocalSensTextChange = (text: string) => {
    // Replace comma with dot if user inputs it
    const normalized = text.replace(',', '.');
    setLocalSensText(normalized);

    const parsed = parseFloat(normalized);
    if (!isNaN(parsed) && parsed >= 0) {
      onSourceSensChange(parsed);
    } else if (normalized === '') {
      onSourceSensChange(0);
    }
  };

  // Auto-calculated fields
  const resultSens = convertSensitivity(
    sourceGameId,
    targetGameId,
    sourceSens,
    sourceDpi,
    targetDpi
  );

  const sourceGameData = GAMES[sourceGameId];
  const targetGameData = GAMES[targetGameId];

  const sourceDist = calculateDistance360(sourceSens, sourceGameData.yaw, sourceDpi);
  const targetDist = calculateDistance360(resultSens, targetGameData.yaw, targetDpi);

  const handleSwap = () => {
    // Collect pre-swap values
    const prevSourceGame = sourceGameId;
    const prevTargetGame = targetGameId;
    const prevSourceSens = sourceSens;
    const prevSourceDpi = sourceDpi;
    const prevTargetDpi = targetDpi;

    // Swap games
    onSourceGameChange(prevTargetGame);
    onTargetGameChange(prevSourceGame);

    // Set the sensitivity of the new source to the previous converted result
    onSourceSensChange(resultSens > 0 ? resultSens : prevSourceSens);

    // Swap DPIs accordingly
    onSourceDpiChange(prevTargetDpi);
    onTargetDpiChange(prevSourceDpi);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultSens.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!showSaveModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSaveModal(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSaveModal]);

  const submitSave = (e: FormEvent) => {
    e.preventDefault();
    const title = profileTitle.trim() || `Mira ${sourceGameData.name} ➔ ${targetGameData.name}`;
    onSaveProfile({
      title,
      sourceGameId,
      targetGameId,
      sourceSens,
      sourceDpi,
      targetDpi,
      convertedSens: resultSens,
    });
    setSaveSuccess(true);
    setProfileTitle('');
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSaveModal(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(187,222,251,0.25)] border-t-4 border-[#006398] p-6 md:p-8 relative transition-transform duration-300">
      
      {/* Principal layout container */}
      <div className="flex flex-col lg:flex-row gap-8 items-center relative">
        
        {/* Lado Esquerdo: Jogo de Origem */}
        <div className="flex-1 w-full space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#42474c] uppercase tracking-wider mb-2" id="lbl-source-game">
              Jogo de Origem
            </label>
            <div className="relative">
              <select
                value={sourceGameId}
                onChange={(e) => onSourceGameChange(e.target.value as GameId)}
                className="w-full p-4 bg-[#F1F5F9] border-none rounded-xl text-base font-medium focus:ring-2 focus:ring-[#006398] focus:bg-white outline-none transition-all appearance-none cursor-pointer text-[#191c1e]"
                id="select-source-game"
              >
                {GAMES_LIST.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#42474c]">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#42474c] uppercase tracking-wider mb-2" id="lbl-source-sens">
                Sensibilidade
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={localSensText}
                placeholder="1.00"
                onChange={(e) => handleLocalSensTextChange(e.target.value)}
                className="w-full p-4 bg-[#F1F5F9] border-none rounded-xl text-base font-medium focus:ring-2 focus:ring-[#006398] focus:bg-white outline-none transition-all text-[#191c1e]"
                id="input-source-sens"
              />
              <input 
                type="range"
                min="0.1"
                max="10"
                step="0.05"
                value={sourceSens > 0 ? sourceSens : 0.1}
                disabled={sourceSens === 0}
                onChange={(e) => onSourceSensChange(parseFloat(e.target.value))}
                className="w-full mt-2 accent-[#006398] disabled:opacity-40 disabled:cursor-not-allowed"
                id="slider-source-sens"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#42474c] uppercase tracking-wider mb-2" id="lbl-source-dpi">
                DPI
              </label>
              <input
                type="number"
                step="50"
                min="100"
                value={sourceDpi === 0 ? '' : sourceDpi}
                placeholder="800"
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  onSourceDpiChange(isNaN(val) ? 0 : val);
                }}
                className="w-full p-4 bg-[#F1F5F9] border-none rounded-xl text-base font-medium focus:ring-2 focus:ring-[#006398] focus:bg-white outline-none transition-all text-[#191c1e]"
                id="input-source-dpi"
              />
              <div className="flex gap-2 mt-2 justify-between">
                {[400, 800, 1600, 3200].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onSourceDpiChange(val)}
                    className={`text-xs px-2 py-1 rounded bg-[#F1F5F9] font-medium transition-colors ${
                      sourceDpi === val ? 'bg-[#bbdefb] text-[#006398] font-semibold' : 'text-[#42474c] hover:bg-[#e0e3e5]'
                    }`}
                    id={`btn-source-dpi-preset-${val}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divisor / Botão Swap */}
        <div className="flex-none flex items-center justify-center my-2 lg:my-0">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Inverter conversão"
            className="bg-[#bbdefb]/40 p-4 rounded-full text-[#006398] hover:bg-[#bbdefb] active:rotate-180 duration-500 transition-all shadow-sm focus:ring-2 focus:ring-[#006398] outline-none"
            id="btn-swap"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>

        {/* Lado Direito: Jogo de Destino */}
        <div className="flex-1 w-full space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#42474c] uppercase tracking-wider mb-2" id="lbl-target-game">
              Jogo de Destino
            </label>
            <div className="relative">
              <select
                value={targetGameId}
                onChange={(e) => onTargetGameChange(e.target.value as GameId)}
                className="w-full p-4 bg-[#F1F5F9] border-none rounded-xl text-base font-medium focus:ring-2 focus:ring-[#006398] focus:bg-white outline-none transition-all appearance-none cursor-pointer text-[#191c1e]"
                id="select-target-game"
              >
                {GAMES_LIST.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#42474c]">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#42474c] uppercase tracking-wider mb-2" id="lbl-result-sens">
                Resultado
              </label>
              <div className="relative group">
                <div 
                  className="w-full p-4 bg-[#6cbdfe]/10 border-2 border-dashed border-[#6cbdfe]/40 rounded-xl text-lg text-[#006398] font-bold flex items-center justify-between min-h-[58px]"
                  id="display-result-sens"
                >
                  <span className="font-mono text-xl">{resultSens > 0 ? resultSens : '0.000'}</span>
                  {resultSens > 0 && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg text-[#006398] hover:bg-[#6cbdfe]/20 active:scale-95 transition-all outline-none"
                      title="Copiar resultado"
                      id="btn-copy-result"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-[#42474c] mt-1 block">Sensibilidade convertida ideal</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#42474c] uppercase tracking-wider mb-2" id="lbl-target-dpi">
                DPI Alvo
              </label>
              <input
                type="number"
                step="50"
                min="100"
                value={targetDpi === 0 ? '' : targetDpi}
                placeholder="800"
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  onTargetDpiChange(isNaN(val) ? 0 : val);
                }}
                className="w-full p-4 bg-[#F1F5F9] border-none rounded-xl text-base font-medium focus:ring-2 focus:ring-[#006398] focus:bg-white outline-none transition-all text-[#191c1e]"
                id="input-target-dpi"
              />
              <div className="flex gap-2 mt-2 justify-between">
                {[400, 800, 1600, 3200].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onTargetDpiChange(val)}
                    className={`text-xs px-2 py-1 rounded bg-[#F1F5F9] font-medium transition-colors ${
                      targetDpi === val ? 'bg-[#bbdefb] text-[#006398] font-semibold' : 'text-[#42474c] hover:bg-[#e0e3e5]'
                    }`}
                    id={`btn-target-dpi-preset-${val}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Seção visual de feedback da distância (360° Distance) */}
      {resultSens > 0 && (
        <div className="mt-8 border-t border-[#eceef0] pt-6 bg-[#f7f9fb] p-4 rounded-xl space-y-4">
          {/* Informações detalhadas do giro */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#191c1e] flex items-center gap-1.5">
              <MousePointer className="w-4 h-4 text-[#006398]" />
              Física do Seu Mousepad (Giro de 360°)
            </h4>
            <div className="bg-white p-4 rounded-lg border border-[#eceef0] max-w-xs">
              <p className="text-[11px] text-[#42474c] uppercase font-bold mb-2">Distância de 360°</p>
              <p className="text-2xl font-extrabold text-[#006398] font-mono">{targetDist.cm} <span className="text-sm font-normal text-[#42474c]">cm</span></p>
              <p className="text-sm text-[#006398] font-mono mt-1">{targetDist.inches} em polegadas</p>
            </div>
          </div>

          {/* Visual Canvas Simulator */}
          <div className="flex flex-col justify-center space-y-2">
            <div className="flex justify-between text-xs text-[#42474c] px-1 font-semibold">
              <span>0 cm</span>
              <span className="text-[#006398] font-bold">Distância 360°: {targetDist.cm} cm</span>
              <span>100 cm</span>
            </div>
            {/* Visual simulation track */}
            <div className="relative w-full h-8 bg-gray-200 rounded-lg overflow-hidden border border-[#e0e3e5]">
              {/* Ruler markers */}
              <div className="absolute inset-0 flex justify-between px-2 text-[9px] text-[#72787d]/40 select-none pointer-events-none">
                <span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>
              </div>
              {/* Distance fill line */}
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#bbdefb] to-[#6cbdfe] rounded-r opacity-70"
                style={{ width: `${Math.min(targetDist.cm, 100)}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(targetDist.cm, 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              {/* Animated Mouse Icon */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 bg-white border border-[#006398] p-1 rounded shadow-md pointer-events-none flex items-center justify-center"
                style={{ left: `calc(${Math.min(targetDist.cm, 90)}% - 6px)` }}
                initial={{ left: 0 }}
                animate={{ left: `calc(${Math.min(targetDist.cm, 90)}% - 6px)` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                🖱️
              </motion.div>
            </div>
            <p className="text-[10px] text-center text-[#42474c] italic">
              {targetDist.cm > 60 
                ? '⭐ Sensibilidade baixa. Ótima para precisão extrema de longe!' 
                : targetDist.cm < 15 
                ? '⚡ Sensibilidade alta. Fácil para giros rápidos de 180°!' 
                : '🎯 Sensibilidade balanceada. Sensacional para tracking e flicks!'}
            </p>
          </div>
        </div>
      )}

      {/* Botão de salvar no histórico */}
      {resultSens > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 text-xs bg-[#f2f4f6] text-[#42474c] hover:bg-[#bbdefb]/40 hover:text-[#006398] px-4 py-2.5 rounded-lg font-semibold tracking-wide transition-all shadow-sm active:scale-95"
            id="btn-open-save-modal"
          >
            <Save className="w-3.5 h-3.5" />
            Salvar no Perfil de Mira
          </button>
        </div>
      )}

      {/* Modal simples de Salvar Perfil */}
      <AnimatePresence>
        {showSaveModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative border-t-4 border-[#006398]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-[#191c1e] mb-2">Salvar Perfil de Sensibilidade</h3>
              <p className="text-xs text-[#42474c] mb-4">
                Guarde essa conversão para acessar no futuro de forma rápida.
              </p>

              <form onSubmit={submitSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#42474c] mb-1">
                    Nome do Perfil (Ex: Minha Mira no CS2)
                  </label>
                  <input
                    type="text"
                    placeholder={`Mira ${sourceGameData.name} para ${targetGameData.name}`}
                    value={profileTitle}
                    onChange={(e) => setProfileTitle(e.target.value)}
                    className="w-full p-3 bg-[#F1F5F9] border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#006398] outline-none text-[#191c1e]"
                    id="input-profile-title"
                  />
                </div>

                <div className="bg-[#f7f9fb] p-3 rounded-lg text-xs space-y-1 border border-[#eceef0]">
                  <p className="text-gray-500 font-bold uppercase text-[10px]">Resumo do Perfil:</p>
                  <p className="text-gray-800">
                    <span className="font-semibold">{sourceGameData.name}:</span> {sourceSens} S / {sourceDpi} DPI
                  </p>
                  <p className="text-[#006398] font-medium">
                    ➔ <span className="font-semibold">{targetGameData.name}:</span> {resultSens} S / {targetDpi} DPI
                  </p>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(false)}
                    className="px-4 py-2 text-xs rounded-lg font-semibold hover:bg-gray-100 text-[#42474c] transition-colors"
                    id="btn-cancel-save"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saveSuccess}
                    className="px-4 py-2 text-xs rounded-lg font-semibold bg-[#006398] text-white hover:bg-[#004b74] transition-colors flex items-center gap-1"
                    id="btn-confirm-save"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Salvo com sucesso!
                      </>
                    ) : (
                      'Salvar Perfil'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
