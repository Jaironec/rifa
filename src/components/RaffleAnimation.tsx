import { useState, useEffect, useCallback } from 'react';
import { Trophy, Play, Pause } from 'lucide-react';

interface Participant {
  name: string;
  ticketNumber: number;
}

interface RaffleAnimationProps {
  raffleName: string;
  participants: Participant[];
  currentWinnerIndex: number;
  totalWinners: number;
  onWinnerSelected: (winner: Participant) => void;
}

export function RaffleAnimation({
  raffleName,
  participants,
  currentWinnerIndex,
  totalWinners,
  onWinnerSelected,
}: RaffleAnimationProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(participants[0]?.ticketNumber || 1);
  const [currentName, setCurrentName] = useState(participants[0]?.name || '');

  const availableParticipants = participants.filter(
    (p) => !p.ticketNumber
  );

  const spinWheel = useCallback(() => {
    if (availableParticipants.length === 0) return;

    setIsSpinning(true);
    let counter = 0;
    const maxIterations = 50 + Math.floor(Math.random() * 30);

    const interval = setInterval(() => {
      const randomParticipant =
        availableParticipants[Math.floor(Math.random() * availableParticipants.length)];
      setCurrentNumber(randomParticipant.ticketNumber);
      setCurrentName(randomParticipant.name);

      counter++;

      if (counter >= maxIterations) {
        clearInterval(interval);
        setIsSpinning(false);
        onWinnerSelected(randomParticipant);
      }
    }, 50 + Math.floor(counter * 2));

    return () => clearInterval(interval);
  }, [availableParticipants, onWinnerSelected]);

  useEffect(() => {
    if (participants.length > 0 && !isSpinning) {
      const randomParticipant =
        participants[Math.floor(Math.random() * participants.length)];
      setCurrentNumber(randomParticipant.ticketNumber);
      setCurrentName(randomParticipant.name);
    }
  }, [participants, isSpinning]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">{raffleName}</h1>
          <p className="text-2xl text-white/90">
            Ganador {currentWinnerIndex + 1} de {totalWinners}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 transform transition-transform hover:scale-105">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6 animate-bounce" />

          <div className="space-y-4">
            <div className="text-8xl font-bold text-orange-600 animate-pulse">
              #{currentNumber}
            </div>

            <div className="text-3xl font-semibold text-gray-800 min-h-[3rem] flex items-center justify-center">
              {currentName}
            </div>
          </div>
        </div>

        <button
          onClick={spinWheel}
          disabled={isSpinning || availableParticipants.length === 0}
          className="bg-white text-orange-600 font-bold py-6 px-12 rounded-full text-2xl hover:bg-gray-100 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl flex items-center gap-4 mx-auto"
        >
          {isSpinning ? (
            <>
              <Pause className="w-8 h-8 animate-spin" />
              Girando...
            </>
          ) : (
            <>
              <Play className="w-8 h-8" />
              {currentWinnerIndex === 0 ? 'Empezar' : 'Continuar'}
            </>
          )}
        </button>

        <div className="mt-8 text-white text-lg">
          Participantes restantes: {availableParticipants.length}
        </div>
      </div>
    </div>
  );
}
