import { useState, type MouseEvent } from 'react';
import { ConversionProfile } from '../types';
import { GAMES } from '../gamesData';
import { Trash2, ArrowRight, Clipboard, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SavedProfilesProps {
  profiles: ConversionProfile[];
  onDeleteProfile: (id: string) => void;
  onApplyProfile: (profile: ConversionProfile) => void;
}

export default function SavedProfiles({
  profiles,
  onDeleteProfile,
  onApplyProfile,
}: SavedProfilesProps) {
  const [copiedProfileId, setCopiedProfileId] = useState<string | null>(null);

  const handleCopySens = (profileId: string, sens: number, e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sens.toString());
    setCopiedProfileId(profileId);
    setTimeout(() => setCopiedProfileId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(187,222,251,0.15)] p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center border-b border-[#eceef0] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#191c1e]" id="lbl-profiles-title">Meus Perfis de Mira</h2>
          <p className="text-xs text-[#72787d]">Seus perfis salvos localmente para carregar na calculadora quando quiser</p>
        </div>
        <span className="text-xs bg-[#bbdefb] text-[#006398] font-bold px-2.5 py-1 rounded-full" id="lbl-profiles-count">
          {profiles.length} {profiles.length === 1 ? 'salvo' : 'salvos'}
        </span>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-12 space-y-3 bg-[#f7f9fb] rounded-xl border border-dashed border-[#eceef0]">
          <div className="text-4xl">🎯</div>
          <p className="text-sm font-semibold text-[#42474c]" id="lbl-no-profiles">Nenhum perfil de mira salvo ainda</p>
          <p className="text-xs text-[#72787d] max-w-sm mx-auto px-4">
            Faça uma conversão usando a calculadora acima e salve para fixá-la aqui para sempre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {profiles.map((profile) => {
              const srcData = GAMES[profile.sourceGameId];
              const tgtData = GAMES[profile.targetGameId];

              if (!srcData || !tgtData) return null;

              const isCopied = copiedProfileId === profile.id;

              return (
                <motion.div
                  key={profile.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#f7f9fb] rounded-xl p-4 border border-[#eceef0] hover:border-[#bbdefb] transition-all flex flex-col justify-between gap-4 group"
                  id={`profile-card-${profile.id}`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-sm text-[#191c1e] group-hover:text-[#006398] transition-colors" id={`profile-title-${profile.id}`}>
                        {profile.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onDeleteProfile(profile.id)}
                        className="text-[#72787d] hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-colors"
                        title="Deletar perfil"
                        id={`btn-delete-profile-${profile.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Flow details visualization */}
                    <div className="grid grid-cols-3 items-center text-center bg-white py-2.5 px-3 rounded-lg border border-[#eceef0]">
                      <div>
                        <p className="font-bold text-xs text-[#191c1e]">{srcData.name}</p>
                        <p className="text-[11px] text-[#42474c] font-mono">{profile.sourceSens}</p>
                        <p className="text-[9px] text-[#72787d] font-mono">{profile.sourceDpi} DPI</p>
                      </div>

                      <div className="flex justify-center text-[#72787d]">
                        <ArrowRight className="w-4 h-4 text-[#006398]" />
                      </div>

                      <div>
                        <p className="font-bold text-xs text-[#006398]">{tgtData.name}</p>
                        <p className="text-[11px] text-[#006398] font-bold font-mono">{profile.convertedSens}</p>
                        <p className="text-[9px] text-[#006398]/80 font-mono">{profile.targetDpi} DPI</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#eceef0]/60">
                    <span className="text-[10px] text-[#72787d]">
                      {new Date(profile.createdAt).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleCopySens(profile.id, profile.convertedSens, e)}
                        className="text-[10px] text-[#42474c] hover:bg-[#eceef0] px-2 py-1 rounded font-medium flex items-center gap-1"
                        id={`btn-copy-profile-sens-${profile.id}`}
                      >
                        {isCopied ? (
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                        ) : (
                          <Clipboard className="w-2.5 h-2.5" />
                        )}
                        {isCopied ? 'Copiado!' : 'Copiar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onApplyProfile(profile)}
                        className="text-[10px] bg-[#006398] text-white hover:bg-[#004b74] px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 active:scale-95 transition-all"
                        id={`btn-use-profile-${profile.id}`}
                      >
                        Carregar
                        <ChevronRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
