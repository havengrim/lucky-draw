import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';

interface Participant {
  id?: number;
  name: string;
  designation: string;
}

const UploadNames: React.FC = () => {
  const [participant, setParticipant] = useState<Participant>({ name: '', designation: '' });
  const [message, setMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [file, setFile] = useState<File | null>(null);

  // Access environment variable using import.meta.env
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  // Fetch participants when the component mounts
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/participants/`)
      .then((response) => {
        setParticipants(response.data);
      })
      .catch((error) => {
        console.error('Error fetching participants:', error);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParticipant((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && participant.id) {
      // Update participant
      axios
        .put(`${API_BASE_URL}/participants/${participant.id}/`, participant)
        .then((response) => {
          setMessage(`Participant updated: ${response.data.name}`);
          setParticipant({ name: '', designation: '' });
          setIsEditMode(false);
          // Refresh participants list
          setParticipants((prev) =>
            prev.map((p) => (p.id === response.data.id ? response.data : p))
          );
        })
        .catch((error) => {
          console.error('Error updating participant:', error);
          setMessage('Failed to update participant.');
        });
    } else {
      // Create participant
      axios
        .post(`${API_BASE_URL}/participants/`, participant)
        .then((response) => {
          setMessage(`Participant added: ${response.data.name}`);
          setParticipant({ name: '', designation: '' });
          // Add new participant to the list
          setParticipants((prev) => [...prev, response.data]);
        })
        .catch((error) => {
          console.error('Error adding participant:', error);
          setMessage('Failed to add participant.');
        });
    }
  };

  const handleEdit = (participantToEdit: Participant) => {
    setParticipant(participantToEdit);
    setIsEditMode(true);
  };

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

  const handleCSVUpload = () => {
    if (!file) {
      setMessage('Please select a CSV file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios
      .post(`${API_BASE_URL}/upload_csv/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setMessage('CSV file uploaded and participants added successfully.');
        // Optionally, refresh the participants list after the upload
        setParticipants((prev) => [...prev, ...response.data]);
      })
      .catch((error) => {
        console.error('Error uploading CSV:', error);
        setMessage('Failed to upload CSV.');
      });
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 bg-gray-200">
      <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Participant' : 'Upload Names'}</h1>
      
      {/* CSV Upload Section */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Upload CSV File</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} className="my-2" />
        <button
          onClick={handleCSVUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload CSV
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={participant.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Designation</label>
          <input
            type="text"
            name="designation"
            value={participant.designation}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {isEditMode ? 'Update Participant' : 'Add Participant'}
        </button>
      </form>

      {message && <p className="mt-4 text-gray-600">{message}</p>}

      <h2 className="mt-8 text-xl font-semibold">Participants List</h2>
      <table className="mt-4 w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">Name</th>
            <th className="px-4 py-2 border-b text-left">Designation</th>
            <th className="px-4 py-2 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-2 border-b">{p.name}</td>
              <td className="px-4 py-2 border-b">{p.designation}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id!)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
   
  );
};

export default UploadNames;
