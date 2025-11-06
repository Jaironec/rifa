import { useState } from 'react';
import { RaffleSetup } from './components/RaffleSetup';
import { RaffleAnimation } from './components/RaffleAnimation';
import { WinnerModal } from './components/WinnerModal';
import { supabase } from './lib/supabase';

interface Participant {
  name: string;
  ticketNumber: number;
}

interface Winner extends Participant {
  position: number;
}

function App() {
  const [stage, setStage] = useState<'setup' | 'running' | 'finished'>('setup');
  const [raffleName, setRaffleName] = useState('');
  const [totalWinners, setTotalWinners] = useState(1);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Winner | null>(null);
  const [raffleId, setRaffleId] = useState<string>('');

  const handleStartRaffle = async (
    name: string,
    winnersCount: number,
    participantsList: Participant[]
  ) => {
    setRaffleName(name);
    setTotalWinners(winnersCount);
    setParticipants(participantsList);
    setStage('running');

    const { data: raffle } = await supabase
      .from('raffles')
      .insert({
        name,
        total_winners: winnersCount,
        status: 'in_progress',
      })
      .select()
      .single();

    if (raffle) {
      setRaffleId(raffle.id);

      const participantsData = participantsList.map((p) => ({
        raffle_id: raffle.id,
        participant_name: p.name,
        ticket_number: p.ticketNumber,
      }));

      await supabase.from('raffle_participants').insert(participantsData);
    }
  };

  const handleWinnerSelected = async (winner: Participant) => {
    const newWinner: Winner = {
      ...winner,
      position: winners.length + 1,
    };

    setCurrentWinner(newWinner);
    setWinners([...winners, newWinner]);
    setShowWinnerModal(true);

    const updatedParticipants = participants.filter(
      (p) => p.ticketNumber !== winner.ticketNumber
    );
    setParticipants(updatedParticipants);

    await supabase
      .from('raffle_participants')
      .update({
        is_winner: true,
        winner_position: newWinner.position,
      })
      .eq('raffle_id', raffleId)
      .eq('ticket_number', winner.ticketNumber);

    await supabase
      .from('raffles')
      .update({
        current_winner: newWinner.position,
      })
      .eq('id', raffleId);
  };

  const handleContinue = async () => {
    setShowWinnerModal(false);

    if (winners.length >= totalWinners) {
      setStage('finished');

      await supabase
        .from('raffles')
        .update({
          status: 'completed',
        })
        .eq('id', raffleId);
    }
  };

  const handleRestart = () => {
    setStage('setup');
    setRaffleName('');
    setTotalWinners(1);
    setParticipants([]);
    setWinners([]);
    setShowWinnerModal(false);
    setCurrentWinner(null);
    setRaffleId('');
  };

  if (stage === 'setup') {
    return <RaffleSetup onStart={handleStartRaffle} />;
  }

  if (stage === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-3xl w-full">
          <h1 className="text-5xl font-bold text-center text-green-600 mb-8">
            ¡Rifa Completada!
          </h1>

          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            {raffleName}
          </h2>

          <div className="space-y-4 mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Ganadores:
            </h3>
            {winners.map((winner) => (
              <div
                key={winner.position}
                className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 flex items-center justify-between shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                    {winner.position}°
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-gray-800">
                      {winner.name}
                    </div>
                    <div className="text-lg text-gray-600">
                      Número: #{winner.ticketNumber}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleRestart}
            className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg text-xl"
          >
            Nueva Rifa
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <RaffleAnimation
        raffleName={raffleName}
        participants={participants}
        currentWinnerIndex={winners.length}
        totalWinners={totalWinners}
        onWinnerSelected={handleWinnerSelected}
      />

      {showWinnerModal && currentWinner && (
        <WinnerModal
          winnerName={currentWinner.name}
          winnerNumber={currentWinner.ticketNumber}
          position={currentWinner.position}
          totalWinners={totalWinners}
          onContinue={handleContinue}
        />
      )}
    </>
  );
}

export default App;
