import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from "../assets/logo.png";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

interface Participant {
  id: number;
  name: string;
  email: string;
}

const Raffle: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winnerCount, setWinnerCount] = useState(1); // Number of winners
  const [winners, setWinners] = useState<Participant[]>([]); 
  const [loading, setLoading] = useState(false); // For loading state
  const [shuffling, setShuffling] = useState(false); // To control shuffle animation
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility

  // GET: Fetch participants
  const fetchParticipants = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/participants/');
      setParticipants(response.data); // Set participants state with the fetched data
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  // POST: Save winners to the database
  const saveWinnersToDatabase = async (winners: Participant[]) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/winners/', { winners });
      console.log('Winners saved successfully:', response.data); // Log success
    } catch (error) {
      console.error('Error saving winners:', error); // Handle errors
    }
  };

  useEffect(() => {
    fetchParticipants(); // Fetch participants when the component mounts
  }, []); // Empty dependency array to only fetch once when the component mounts

  // Pick random winners with suspense and shuffle animation
  const pickWinners = () => {
    if (participants.length > 0 && winnerCount > 0) {
      setLoading(true); // Start loading animation
      setShuffling(true); // Start shuffle animation

      setTimeout(() => {
        const shuffledParticipants = [...participants];
        const randomWinners: Participant[] = []; // Explicitly define type here
        for (let i = 0; i < winnerCount; i++) {
          const randomIndex = Math.floor(Math.random() * shuffledParticipants.length);
          randomWinners.push(shuffledParticipants[randomIndex]);
          shuffledParticipants.splice(randomIndex, 1); // Remove selected winner from list
        }
        setWinners(randomWinners);
        setShuffling(false); // Stop shuffle animation
        setLoading(false); // Stop loading animation
        setIsDialogOpen(true); // Open the dialog to display winners

        // Save winners to the database
        saveWinnersToDatabase(randomWinners);
      }, 3000); // Wait for 3 seconds to simulate suspense before picking winners
    }
  };

  // Close the dialog
  const handleDialogClose = () => {
    setIsDialogOpen(false); // Set dialog state to false when closing
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex flex-col justify-center items-center">
        <img src={logo} alt="DSWD LOGO" className="w-42 h-20" />
        <h1 className="text-3xl font-bold text-center mb-6 text-white">HRMDD - RAFFLE</h1>
      </div>

      {/* Number of winners input */}
      <div className="mt-4">
        <label htmlFor="winnerCount" className="block text-sm font-semibold text-white">Number of Winners</label>
        <input
          type="number"
          id="winnerCount"
          value={winnerCount}
          onChange={(e) => setWinnerCount(Number(e.target.value))}
          min="1"
          className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>

      {/* Draw Winners Button */}
      <div className="mt-6 text-center">
        <button
          onClick={pickWinners}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg text-xl hover:bg-blue-600 transform transition-all hover:scale-105"
        >
          {loading ? 'Drawing...' : 'Draw Winners'}
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-4 flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Shuffle Animation (Rumble Effect) */}
      {shuffling && !loading && (
        <div className="mt-4 text-center">
          <div className="text-xl font-semibold text-gray-700 animate-pulse">
            {participants
              .map((participant) => participant.name)
              .map((name, index) => (
                <span
                  key={index}
                  className={`inline-block animate-[rumble_0.1s_infinite]`}
                  style={{
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                >
                  {name} &nbsp;
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Dialog to show winners */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <button className="hidden">Open Winners</button> {/* Hidden trigger, the dialog opens automatically */}
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="text-xl text-center font-bold text-blue-600">Winner/s</DialogTitle>
          <DialogDescription className="text-center mt-2 text-lg overflow-y-auto max-h-60">
            {winners.length > 0 ? (
              <ul className="space-y-2">
                {winners.map((winner, index) => (
                  <li
                    key={index}
                    className="py-2 px-4 bg-white border rounded-md hover:bg-blue-100 transition-all transform hover:scale-105"
                  >
                    {winner.name} ({winner.email || 'No Email'})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No winners drawn yet.</p>
            )}
          </DialogDescription>
          <DialogClose asChild>
            <button
              onClick={handleDialogClose} // Close the dialog when clicked
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Raffle;
