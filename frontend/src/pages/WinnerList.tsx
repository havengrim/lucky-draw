import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';

// Define the Participant interface
interface Participant {
  id: number;
  name: string;
  designation: string;
}

const WinnerList: React.FC = () => {
  const [winnersLog, setWinnersLog] = useState<Participant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch winners data from the API
  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/winners/');
        if (!response.ok) {
          throw new Error('Failed to fetch winners');
        }
        const data = await response.json();
        setWinnersLog(data);  // Update state with the fetched winners data
      } catch (error) {
        setError('Error fetching winners data');
        console.error(error);
      } finally {
        setLoading(false);  // Set loading to false once the data has been fetched
      }
    };

    fetchWinners();
  }, []);

  return (
    <div className='bg-gray-200 h-screen'>
      <Navbar />
        <div className="mt-6 bg-blue-50 p-4 rounded-md shadow-lg m-4">
      <h2 className="text-2xl font-semibold text-center text-blue-600">Winner Log</h2>

      {/* Show loading indicator while fetching */}
      {loading && <p className="text-center">Loading winners...</p>}

      {/* Show error message if there's an error */}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Table to display winners */}
      <table className="mt-4 w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-100">
            <th className="py-2 px-4 text-left border-b border-gray-200">Name</th>
            <th className="py-2 px-4 text-left border-b border-gray-200">Designation</th>
          </tr>
        </thead>
        <tbody>
          {winnersLog.length > 0 ? (
            winnersLog.map((winner) => (
              <tr
                key={winner.id}
                className="hover:bg-blue-100 transition-all transform hover:scale-105"
              >
                <td className="py-2 px-4 border-b border-gray-200">{winner.name}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {winner.designation || 'No Designation'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="py-2 px-4 text-center border-b border-gray-200">
                No winners drawn yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
    
  );
};

export default WinnerList;
