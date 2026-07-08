import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Como funciona a conversão física de sensibilidade?",
      answer: "Cada jogo utiliza uma taxa de rotação interna específica chamada 'Yaw' (graus de movimento por pixel de contagem do mouse). Nós correlacionamos as variáveis de sensibilidade do jogo original com o seu Yaw, o DPI do seu mouse e o Yaw do jogo alvo para calcular de maneira exata a sensibilidade equivalente. Assim, você mantém a sensação física de mira intacta."
    },
    {
      question: "O DPI do mouse de destino pode ser diferente do de origem?",
      answer: "Sim! Essa é uma das principais facilidades do SensShift. Se você usa 800 DPI em um jogo, mas quer mudar para 1600 DPI em outro para navegar pelo sistema de forma mais fluida, basta preencher 'DPI Alvo' com o novo valor. Nós fazemos todo o cálculo proporcional para você automaticamente."
    },
    {
      question: "O que é e por que a Distância de 360° importa tanto?",
      answer: "A Distância de 360° mede exatamente quantos centímetros físicos você precisa movimentar seu mouse em cima do mousepad para fazer o seu personagem dar um giro completo (360°) no cenário. É a régua definitiva e universal dos pro-players para garantir consistência e treinar a famosa memória muscular."
    },
    {
      question: "Por que as sensibilidades de jogos diferentes não usam os mesmos números?",
      answer: "Porque cada criador de motor gráfico de jogos utiliza padrões matemáticos próprios. Por exemplo, a Valve (CS2, Apex) e a Riot Games (Valorant) utilizam escalas e multiplicadores completamente independentes. O que é 1.0 no CS2 equivale fisicamente a 0.314 no Valorant."
    },
    {
      question: "A aceleração do mouse do Windows afeta a calculadora?",
      answer: "Não diretamente na conta, mas degrada sua performance ideal. A aceleração adiciona uma distorção com base na velocidade físicas do seu braço. Recomendamos fortemente desativar o 'Aprimorar Precisão do Ponteiro' no Painel de Controle do Windows e sempre habilitar 'Raw Input' ou 'Entrada Direta' nos menus internos dos seus jogos favoritos."
    }
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(187,222,251,0.15)] p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-[#eceef0] pb-4">
        <div className="bg-[#bbdefb]/40 p-2.5 rounded-xl text-[#006398]">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#191c1e]" id="lbl-faq-title">Central de Ajuda & FAQ</h2>
          <p className="text-xs text-[#72787d]">Saiba tudo sobre mira, Yaw, DPI, memória muscular e física de eSports</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`border rounded-xl transition-all ${
                isOpen 
                  ? 'border-[#006398] bg-[#f7f9fb]' 
                  : 'border-[#eceef0] bg-white hover:border-[#bbdefb]'
              }`}
              id={`faq-item-${idx}`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full text-left p-4 flex justify-between items-center gap-4 focus:outline-none"
                id={`btn-toggle-faq-${idx}`}
              >
                <span className="font-semibold text-sm text-[#191c1e] md:text-base pr-2 select-none" id={`faq-question-${idx}`}>
                  {faq.question}
                </span>
                <span className="text-[#006398] flex-shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 border-t border-[#eceef0] text-xs md:text-sm text-[#42474c] leading-relaxed" id={`faq-answer-${idx}`}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
