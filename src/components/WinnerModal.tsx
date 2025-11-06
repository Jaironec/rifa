import { Trophy, PartyPopper, ArrowRight } from 'lucide-react';

interface WinnerModalProps {
  winnerName: string;
  winnerNumber: number;
  position: number;
  totalWinners: number;
  onContinue: () => void;
}

export function WinnerModal({
  winnerName,
  winnerNumber,
  position,
  totalWinners,
  onContinue,
}: WinnerModalProps) {
  const isLastWinner = position === totalWinners;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl shadow-2xl p-12 max-w-2xl w-full transform animate-scaleIn">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Trophy className="w-24 h-24 text-yellow-500 animate-bounce" />
            <PartyPopper className="w-24 h-24 text-pink-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>

          <h2 className="text-5xl font-bold text-orange-600 mb-4">
            ¡GANADOR!
          </h2>

          <div className="bg-white rounded-2xl p-8 mb-6 shadow-lg">
            <p className="text-2xl font-semibold text-gray-700 mb-2">
              Posición: {position}° Lugar
            </p>

            <div className="my-6">
              <div className="text-7xl font-bold text-orange-600 mb-4">
                #{winnerNumber}
              </div>

              <div className="text-4xl font-semibold text-gray-800">
                {winnerName}
              </div>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="bg-orange-600 text-white font-bold py-5 px-10 rounded-full text-xl hover:bg-orange-700 transition-all transform hover:scale-110 shadow-lg flex items-center gap-3 mx-auto"
          >
            {isLastWinner ? (
              <>
                Finalizar
                <Trophy className="w-6 h-6" />
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>

          {!isLastWinner && (
            <p className="mt-4 text-gray-600 text-lg">
              Quedan {totalWinners - position} ganadores por seleccionar
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
