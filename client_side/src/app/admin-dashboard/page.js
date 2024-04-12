'use client'
import React, { useState,useEffect } from 'react';
import { CogIcon } from '@heroicons/react/solid'; // Import the CogIcon from Heroicons

const AdminDashboard = () => {
  const [selectedBox, setSelectedBox] = useState('roomAvailability');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [newTime, setNewTime] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [sessions, setSessions] = useState([]);
  const [billings, setBillings] = useState([]);

  const handleBoxSelection = (box) => {
    setSelectedBox(box);
  };

  const handleUpdateSession = async () => {
    try {
      
      const [date, time] = newTime.split('T');
  
      // Check if selectedSession is empty
      if (!selectedSession) {
        console.error('No session selected');
        return;
      }
  
      // Hit the updatesessiondatetime endpoint
      const response = await fetch('http://localhost:4000/updatesessiondatetime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: selectedSession,
          newDate: date,
          newTime: time,
        }),
      });
  
      if (response.ok) {
        // Session date and time updated successfully
        console.log('Session date and time updated');
      } else {
        // Failed to update session date and time
        console.error('Failed to update session date and time');
      }
    } catch (error) {
      console.error('Error updating session date and time:', error);
    }

  };

  const makeRoomAvailable = async () => {
    try {
      const response = await fetch('http://localhost:4000/makeroomavailable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomName: selectedBox }), // Pass the selectedBox value as roomName
      });
  
      if (response.ok) {
        // Room availability updated successfully
        console.log(`Room availability set to available`);
      } else {
        // Failed to update room availability
        console.error('Failed to update room availability');
      }
    } catch (error) {
      console.error('Error updating room availability:', error);
    }
  };


  const makeRoomUnAvailable = async () => {
    try {
      const response = await fetch('http://localhost:4000/makeroomunavailable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomName: selectedBox }), // Pass the selectedBox value as roomName
      });
  
      if (response.ok) {
        // Room availability updated successfully
        console.log(`Room availability set to not available`);
      } else {
        // Failed to update room availability
        console.error('Failed to update room availability');
      }
    } catch (error) {
      console.error('Error updating room availability:', error);
    }
  };

  const handleSetCondition = async () => {
    try {
      // Check if selectedEquipment or selectedCondition is empty
      if (!selectedEquipment || !selectedCondition) {
        console.error('Equipment name or condition not selected');
        return;
      }

      // Hit the updateequipment endpoint
      const response = await fetch('http://localhost:4000/updateequipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentName: selectedEquipment,
          newCondition: selectedCondition,
        }),
      });

      if (response.ok) {
        // Equipment condition updated successfully
        console.log(`Condition of ${selectedEquipment} updated to ${selectedCondition}`);
      } else {
        // Failed to update equipment condition
        console.error('Failed to update equipment condition');
      }
    } catch (error) {
      console.error('Error updating equipment condition:', error);
    }
  };

  const fetchBillings = async () => {
    try {
      const response = await fetch('http://localhost:4000/getbillings');
      if (response.ok) {
        const billingsData = await response.json();
        setBillings(billingsData); // Store billings in state
        console.log(billingsData);
      } else {
        console.error('Failed to fetch billings');
      }
    } catch (error) {
      console.error('Error fetching billings:', error);
    }
  };


  useEffect(() => {
    // Fetch all sessions from the backend when component mounts
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://localhost:4000/allsessions');
        if (response.ok) {
          const sessionsData = await response.json();
          console.log(sessionsData);
          setSessions(sessionsData); // Store sessions in state
        } else {
          console.error('Failed to fetch sessions');
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions(); // Invoke the fetchSessions function
    fetchBillings();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="dashboard-container bg-white p-8 rounded-lg shadow-md max-w-3xl w-full flex flex-col">
        <h1 className="text-3xl font-bold mb-2 text-center text-black">Welcome to Admin Dashboard!</h1>
        <p className="text-lg text-center text-gray-700 mb-8">Here's an overview of your information:</p>
        <div className="dashboard-content flex">
          <div className="dashboard-info-container w-1/2 mr-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Room Availability</h2>
            <div className="dashboard-info">
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Select Room:</p>
                <select
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  value={selectedBox}
                  onChange={(e) => handleBoxSelection(e.target.value)}
                >
                  <option value="roomAvailability">Select room...</option>
                  <option value="Gymnasium 1">Gymnasium 1</option>
                  <option value="Gymnasium 2">Gymnasium 2</option>
                  <option value="Exercise Room 1">Exercise Room 1</option>
                  <option value="Exercise Room 2">Exercise Room 2</option>
                  <option value="Exercise Room 3">Exercise Room 3</option>
                </select>
              </div>
              <div className="mb-4 flex justify-between">
                <button className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => makeRoomAvailable()}>Make Available</button>
                <button className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => makeRoomUnAvailable()}>Make Not Available</button>
              </div>
            </div>
            <div className="mb-8"></div> {/* Add space between sections */}
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Update Class Schedule</h2>
            <div className="dashboard-info">
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Select Session:</p>
                <select
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                >
                  <option value="">Select session...</option>
                  {sessions.map(session => (
                    <option key={session.sessionid} value={session.sessionid}>{session.sessionname}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Set New Time:</p>
                <input
                  type="datetime-local"
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
              <button className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateSession}>Update Session</button>
            </div>
          </div>
          <div className="dashboard-metrics-container w-1/2">
            <div className="w-full mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center text-black">Equipment Maintenance</h2>
              <div className="dashboard-info">
                <div className="mb-4">
                  <p className="text-lg font-bold text-black">Select Equipment:</p>
                  <select
                    className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                    value={selectedEquipment}
                    onChange={(e) => setSelectedEquipment(e.target.value)}
                  >
                    <option value="">Select equipment...</option>
                    <option value="Bicep Machine">Bicep Machine</option>
                    <option value="Chest Machine">Chest Machine</option>
                    <option value="Tricep Machine">Tricep Machine</option>
                    <option value="Back Machine">Back Machine</option>
                    <option value="Leg Machine">Leg Machine</option>
                  </select>
                </div>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-black">Set Condition:</h2>
                  <select
                    className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                  >
                    <option value="">Select condition...</option>
                    <option value="Factory New">Factory New</option>
                    <option value="Minimal Wear">Minimal Wear</option>
                    <option value="Worn Out">Worn Out</option>
                    <option value="Broken">Broken</option>
                  </select>
                </div>
                <div className="flex justify-center">
                  <button className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={handleSetCondition}>Set Condition</button>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="mb-8"></div> {/* Add space between sections */}
              <h2 className="text-2xl font-bold mb-4 text-center text-black">View Billings</h2> {/* Moved View Billings here */}
              {billings.map(billing => (
                <div key={billing.BillId} className="mb-4 flex justify-between items-center text-black">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex justify-center items-center mr-4">
                      <p className="text-lg font-bold">${billing.amount}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{billing.fullname}</p> {/* Display full name */}
                      <p className="text-sm text-gray-500">Transaction Complete</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
