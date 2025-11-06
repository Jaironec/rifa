import { useState } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface RaffleSetupProps {
  onStart: (raffleName: string, totalWinners: number, participants: { name: string; ticketNumber: number }[]) => void;
}

export function RaffleSetup({ onStart }: RaffleSetupProps) {
  const [raffleName, setRaffleName] = useState('');
  const [totalWinners, setTotalWinners] = useState(1);
  const [participants, setParticipants] = useState<{ name: string; ticketNumber: number }[]>([]);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

      const parsedParticipants = jsonData
        .slice(1)
        .filter(row => row[0])
        .map((row, index) => ({
          name: String(row[0] || `Participante ${index + 1}`),
          ticketNumber: index + 1,
        }));

      setParticipants(parsedParticipants);
    };

    reader.readAsBinaryString(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (raffleName && totalWinners > 0 && participants.length > 0) {
      onStart(raffleName, totalWinners, participants);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-orange-600">
          Configurar Rifa
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="raffleName" className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de la Rifa
            </label>
            <input
              type="text"
              id="raffleName"
              value={raffleName}
              onChange={(e) => setRaffleName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Ej: Rifa Navidad 2024"
              required
            />
          </div>

          <div>
            <label htmlFor="totalWinners" className="block text-sm font-semibold text-gray-700 mb-2">
              Cantidad de Ganadores
            </label>
            <input
              type="number"
              id="totalWinners"
              value={totalWinners}
              onChange={(e) => setTotalWinners(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="fileUpload" className="block text-sm font-semibold text-gray-700 mb-2">
              Archivo Excel con Participantes
            </label>
            <div className="relative">
              <input
                type="file"
                id="fileUpload"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                required
              />
              <label
                htmlFor="fileUpload"
                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all"
              >
                <Upload className="w-8 h-8 text-orange-500 mr-3" />
                <span className="text-gray-600">
                  {fileName || 'Seleccionar archivo Excel'}
                </span>
              </label>
            </div>
            {participants.length > 0 && (
              <p className="mt-2 text-sm text-green-600 font-medium">
                {participants.length} participantes cargados
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!raffleName || !totalWinners || participants.length === 0}
            className="w-full bg-orange-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-orange-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            Iniciar Rifa
          </button>
        </form>

        {participants.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
            <h3 className="font-semibold text-gray-700 mb-2">Vista Previa:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              {participants.slice(0, 5).map((p) => (
                <div key={p.ticketNumber}>
                  #{p.ticketNumber} - {p.name}
                </div>
              ))}
              {participants.length > 5 && (
                <div className="text-gray-500 italic">
                  ... y {participants.length - 5} más
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
