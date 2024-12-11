import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from "../assets/logo.png";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import bg from '@/assets/sss.png';
import jose from '@/assets/jose.png';
import music from '@/assets/music.MP3';
import Loader from '@/components/loader'; // Assuming the loader component is a named export.

interface Participant {
  id: number;
  name: string;
  designation: string;
}

const Raffle: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winnerCount, setWinnerCount] = useState(1); // Number of winners
  const [winners, setWinners] = useState<Participant[]>([]); 
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const [winnersLog, setWinnersLog] = useState<Participant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isImageSliding, setIsImageSliding] = useState(false); // State to control image sliding

  // Fetch participants
  const fetchParticipants = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/participants/');
      setParticipants(response.data); // Set participants state with the fetched data
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  // Access environment variable using import.meta.env
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  const handleDelete = (id: number) => {
    axios
      .delete(`${API_BASE_URL}/participants/${id}/`)
      .then(() => {
        setMessage('Participant deleted');
        setParticipants((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting participant:', error);
        setMessage('Failed to delete participant.');
      });
  };

  // Save winners to the database
  const saveWinnersToDatabase = async (winners: Participant[]) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/winners/', { winners });
      console.log('Winners saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving winners:', error);
    }
  };

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/winners/');
        if (!response.ok) {
          throw new Error('Failed to fetch winners');
        }
        const data = await response.json();
        setWinnersLog(data);
      } catch (error) {
        setError('Error fetching winners data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, []);

  useEffect(() => {
    fetchParticipants(); // Fetch participants when the component mounts
  }, []); // Empty dependency array to only fetch once when the component mounts

  // Pick random winners with suspense and shuffle animation
  const pickWinners = () => {
    if (participants.length > 0 && winnerCount > 0) {
      const validWinnerCount = Math.min(winnerCount, participants.length);
      setLoading(true);
      setIsImageSliding(true); // Start sliding the image
      const audio = new Audio(music);
      audio.play();

      setTimeout(() => {
        const uniqueParticipants = Array.from(new Set(participants.map(p => p.id)))
          .map(id => participants.find(p => p.id === id))
          .filter((p): p is Participant => p !== undefined);

        let shuffledParticipants = [...uniqueParticipants];
        const randomWinners: Participant[] = [];

        while (randomWinners.length < validWinnerCount && shuffledParticipants.length > 0) {
          const randomIndex = Math.floor(Math.random() * shuffledParticipants.length);
          const winner = shuffledParticipants[randomIndex];

          if (winner && !randomWinners.some(existingWinner => existingWinner.id === winner.id)) {
            randomWinners.push(winner);
          }

          shuffledParticipants = shuffledParticipants.filter(p => p.id !== winner?.id);
        }

        setWinners(randomWinners);
        setLoading(false);
        setIsDialogOpen(true);
        saveWinnersToDatabase(randomWinners);

        randomWinners.forEach(winner => {
          handleDelete(winner.id); // Delete each winner from the database
        });

        setParticipants(participants.filter(p => !randomWinners.some(winner => winner.id === p.id)));
      }, 5500);
    }
  };

  // Close the dialog
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsImageSliding(false); // Stop the image sliding when closing the dialog
    const audio = new Audio(music);
    audio.pause(); // To stop the audio
    audio.currentTime = 0;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
      }}
      className="bg-[url('@/assets/sss.png')] bg-cover bg-center bg-no-repeat h-screen"
    >
      <Navbar />
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
            {loading ? 'Shuffling...' : 'Draw Winners'}
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-4 flex justify-center items-center">
            <Loader /> {/* Assuming the loader is a reusable component */}
          </div>
        )}

        {/* Jose image sliding animation */}
        {isImageSliding && (
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 animate-slide-right">
            <img src={jose} alt="Jose" className="w-[20vw] h-full" />
          </div>
        )}

        {/* Dialog to show winners */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <button className="hidden">Open Winners</button> {/* Hidden trigger, the dialog opens automatically */}
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="text-xl text-center font-bold text-blue-600">Winner/s</DialogTitle>
            <DialogDescription className="text-center mt-2 text-lg overflow-y-auto max-h-72">
              {winners.length > 0 ? (
                <ul className="space-y-2">
                  {winners.map((winner, index) => (
                    <li
                      key={index}
                      className="py-2 px-4 bg-white border rounded-md hover:bg-blue-100 transition-all transform hover:scale-105"
                    >
                      {winner.name} ({winner.designation || 'No Designation'})
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
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
              >
                Close
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Raffle;
