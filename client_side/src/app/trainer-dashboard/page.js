'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const Dashboard = () => {
  const searchParams = useSearchParams();
  const [selectedBox, setSelectedBox] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionRoom, setSessionRoom] = useState('');
  const [sessionFocus, setSessionFocus] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [memberInfo, setMemberInfo] = useState({});
  const [isFound, setIsFound] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch rooms data when the component mounts
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:4000/availablerooms');
        if (response.ok) {
          const data = await response.json();
          setRooms(data);
          console.log(data);
        } else {
          console.error('Failed to fetch rooms data');
        }
      } catch (error) {
        console.error('Error fetching rooms data:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateSession = async ()  => {
    
    try {
      // Split sessionTime to get the date and time separately
      const [date, time] = sessionTime.split('T');
      const trainername = searchParams.get('username');
      const trainerid = searchParams.get('trainerid');
      const sessionstring = `${sessionFocus} ${sessionType} Session with ${trainername} on ${date} at ${time}`;
      
      // Prepare the session data to send in the request body
      const sessionData = {
        SessionName: sessionstring,
        TrainerId: trainerid,
        RoomId: sessionRoom,
        SessionDate:date,
        SessionTime:time,
        DurationMinutes: 60,
        Size: 0,
        ClassType: sessionFocus,
        SessionFocus:sessionType,
      };
  
      // Make a POST request to the /createsession endpoint
      const response = await fetch('http://localhost:4000/createsession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });
  
      if (response.ok) {
        // Session created successfully
        console.log('Session created successfully');
        setSessionFocus('');
        setSessionRoom('');
        setSessionTime('');
        setSessionType('');
      } else {
        // Failed to create session
        console.error('Failed to create session');
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }

  };

  const handleSearch = async () => {
    try {
      // Make a POST request to the /getmemberinfo endpoint with the memberSearch variable
      const response = await fetch('http://localhost:4000/getmemberinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName: memberSearch }), // Pass the memberSearch variable
      });

      if (response.ok) {
        // Member information retrieved successfully
        const data = await response.json();
        setMemberInfo(data.memberInfo);
        setIsFound(true);
        console.log(data.memberInfo);
        
      } else {
        // Failed to retrieve member information
        console.error('Failed to retrieve member information');
      }
    } catch (error) {
      console.error('Error searching member:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="dashboard-container bg-white p-8 rounded-lg shadow-md max-w-3xl w-full flex flex-col">
        <h1 className="text-3xl font-bold mb-2 text-center text-black">Welcome to Your Trainer Dashboard!</h1>
        <p className="text-lg text-center text-gray-700 mb-8">Here's an overview of your information:</p>
        <div className="dashboard-content flex">
          <div className="dashboard-info-container w-1/2 mr-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Create a Session</h2>
            <div className="dashboard-info">
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Session Focus:</p>
                <select
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                >
                  <option value="">Select session type...</option>
                  <option value="Weightlifting">Weightlifting</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Aerobics">Aerobics</option>
                </select>
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Session Time:</p>
                <input
                  type="datetime-local"
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Session Room:</p>
                <select
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  value={sessionRoom}
                  onChange={(e) => setSessionRoom(e.target.value)}
                >
                  <option value="">Select session room...</option>
                  {rooms.map(room => (
                    <option key={room.roomid} value={room.roomid}>{room.roomname}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Session Type:</p>
                <select
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  value={sessionFocus}
                  onChange={(e) => setSessionFocus(e.target.value)}
                >
                  <option value="">Select session type...</option>
                  <option value="Personal">Personal Session</option>
                  <option value="Group">Group Session</option>
                </select>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-black text-white py-2 px-4 rounded-md font-bold hover:bg-gray-800"
                  onClick={handleCreateSession}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
          <div className="dashboard-metrics-container w-1/2">
            <div className="w-full mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center text-black">Member Search</h2>
              <div className="flex justify-center mb-4">
                <input
                  type="text"
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  placeholder="Search members..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-center mb-4">
              <div>
              {isFound && memberInfo && (
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center">
                    <span className="text-black font-bold">User</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-bold text-black">{memberSearch}</p>
                    <p className="text-sm text-gray-600">Email: {memberInfo.email}</p>
                    <p className="text-sm text-gray-600">Fitness Achievements: {memberInfo.fitnessachievements}</p>
                    <p className="text-sm text-gray-600">Fitness Routine: {memberInfo.fitnessroutine}</p>
                  </div>
                </div>
              )}
            </div>
            </div>
            <div className="flex justify-center">
          <button className="bg-black text-white py-2 px-4 rounded hover:bg-gray-900" onClick={handleSearch}>Search Member</button>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
