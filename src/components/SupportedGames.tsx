import { GameId } from '../types';
import { GAMES_LIST } from '../gamesData';
import { Target, Shield, Zap, Flag, Crosshair, Gamepad2 } from 'lucide-react';

interface SupportedGamesProps {
  onSelectAsSource: (id: GameId) => void;
  onSelectAsTarget: (id: GameId) => void;
  currentSourceId: GameId;
  currentTargetId: GameId;
}

export default function SupportedGames({
  onSelectAsSource,
  onSelectAsTarget,
  currentSourceId,
  currentTargetId,
}: SupportedGamesProps) {

  // Map icon names to real high-quality Lucide Components
  const getGameIcon = (iconName: string) => {
    switch (iconName) {
      case 'sports_esports':
        return <Gamepad2 className="w-5 h-5" />;
      case 'videogame_asset':
        return <Crosshair className="w-5 h-5" />;
      case 'target':
        return <Target className="w-5 h-5" />;
      case 'shield':
        return <Shield className="w-5 h-5" />;
      case 'bolt':
        return <Zap className="w-5 h-5" />;
      case 'mountain_flag':
        return <Flag className="w-5 h-5" />;
      default:
        return <Gamepad2 className="w-5 h-5" />;
    }
  };

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-xs font-bold text-[#42474c] uppercase tracking-widest mb-2" id="lbl-supported-subtitle">
          SUPORTAMOS OS PRINCIPAIS TÍTULOS
        </h2>
        <p className="text-xs text-[#72787d]">
          Selecione um jogo abaixo para injetar rapidamente na calculadora
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {GAMES_LIST.map((game) => {
          const isSource = currentSourceId === game.id;
          const isTarget = currentTargetId === game.id;

          return (
            <div
              key={game.id}
              className={`bg-white p-5 rounded-2xl flex flex-col items-center gap-3 hover:-translate-y-1 hover:shadow-lg transition-all border group relative cursor-pointer ${
                isSource 
                  ? 'border-l-4 border-l-[#006398] border-[#bbdefb]' 
                  : isTarget 
                  ? 'border-r-4 border-r-[#6cbdfe] border-[#cde5ff]' 
                  : 'border-[#eceef0] shadow-[0px_10px_30px_rgba(187,222,251,0.08)]'
              }`}
              id={`game-card-${game.id}`}
            >
              {/* Badge indicators */}
              <div className="absolute top-2 right-2 flex gap-1">
                {isSource && (
                  <span className="text-[9px] bg-[#bbdefb] text-[#006398] font-bold px-1.5 py-0.5 rounded" id={`badge-source-${game.id}`}>
                    ORIGEM
                  </span>
                )}
                {isTarget && (
                  <span className="text-[9px] bg-[#cde5ff] text-[#004b74] font-bold px-1.5 py-0.5 rounded" id={`badge-target-${game.id}`}>
                    ALVO
                  </span>
                )}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-[#bbdefb]/20 flex items-center justify-center text-[#006398] group-hover:bg-[#bbdefb] transition-colors">
                {getGameIcon(game.icon)}
              </div>

              {/* Name */}
              <span className="font-semibold text-sm text-[#191c1e]" id={`game-name-${game.id}`}>
                {game.name}
              </span>

              {/* Quick Actions overlay hover option or inline small layout */}
              <div className="flex flex-col gap-1 w-full pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAsSource(game.id);
                  }}
                  className="w-full text-[10px] py-1 bg-[#F1F5F9] rounded hover:bg-[#bbdefb] hover:text-[#006398] font-semibold text-[#42474c] text-center transition-colors"
                  id={`btn-select-source-quick-${game.id}`}
                >
                  Definir como Origem
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAsTarget(game.id);
                  }}
                  className="w-full text-[10px] py-1 bg-[#F1F5F9] rounded hover:bg-[#cde5ff] hover:text-[#004b74] font-semibold text-[#42474c] text-center transition-colors"
                  id={`btn-select-target-quick-${game.id}`}
                >
                  Definir como Alvo
                </button>
              </div>

              {/* Tiny description helpful debug yaw */}
              <span className="text-[9px] text-[#72787d] font-mono mt-1 opacity-70">
                Yaw: {game.yaw.toFixed(5)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
