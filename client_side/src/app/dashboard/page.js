'use client'
import React, { useState, useEffect } from 'react';
import { useRouter,useSearchParams } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [selectedBox, setSelectedBox] = useState('healthMetrics');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedSessionName, setSelectedSessionName] = useState('');
  const [memberInfo, setMemberInfo] = useState({
    username: '',
    email: '',
    password:'',
    role: '',
    dateofbirth: '',
    fitnessachievements: '',
    height: '',
    weight: '', 
    age: ''
  });
  const [dob, setDob] = useState('');
  const [sessions, setSessions] = useState([]);
  const searchParams = useSearchParams();

  const handleBoxSelection = (box) => {
    setSelectedBox(box);
    setSelectedSession('');
  };

  const handleSessionSelection = (e) => {
    setSelectedSession(e.target.value);
    setSelectedSessionName(e.target.options[e.target.selectedIndex].text);
  };

  const handleAddToCart = async () => {
    try {
      // Fetch memberId from URL query parameters
      const memberId = searchParams.get('memberid');

      // Check if selectedSession is not empty
      if (selectedSession) {
        // Send a POST request to the /addtocart endpoint
        const response = await fetch('http://localhost:4000/addtocart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            MemberId: memberId,
            SessionId: selectedSession,
            Price: selectedSessionName.includes('Personal') ? 30 : 15,
          }),
        });

        if (response.ok) {
          console.log('Session added to cart successfully');
          // Clear selected session
          setSelectedSession('');
        } else {
          console.error('Failed to add session to cart');
        }
      } else {
        console.error('No session selected to add to cart');
      }
    } catch (error) {
      console.error('Error adding session to cart:', error);
    }
  }

  const fetchMemberInfo = async (memberId) => {
    try {
      const response = await fetch('http://localhost:4000/memberinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.memberInfo);
        setMemberInfo(data.memberInfo);
        const date = data.memberInfo.dateofbirth; // Access dateofbirth from data.memberInfo
        const formatdate = date.substring(0, 10);
        setDob(formatdate);
      } else {
        console.error('Failed to fetch member info');
      }
    } catch (error) {
      console.error('Error fetching member info:', error);
    }
  };

  const fetchMemberHealthMetrics = async (memberId) => {
    try {
      const response = await fetch('http://localhost:4000/memberhealth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.healthMetrics);
        const { height, weight, age } = data.healthMetrics;
        setMemberInfo(prevState => ({
          ...prevState,
          height,
          weight,
          age
        }));
      } else {
        console.error('Failed to fetch member health metrics');
      }
    } catch (error) {
      console.error('Error fetching member health metrics:', error);
    }
  };


  const handleUpdateInformation = async () => {
    try {
      const memberId = searchParams.get('memberid');
      const { username, email, password, fitnessachievements, weight, height, age } = memberInfo;
  
      const requestBody = {
        memberId,
        username,
        email,
        password,
        fitnessAchievements: fitnessachievements, // Ensure the correct key name
        weight,
        height,
        age
      };
  
      const response = await fetch('http://localhost:4000/updatemember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        console.log('Member information updated successfully');
        // You may want to fetch member info again to update the UI with the latest data
      } else {
        console.error('Failed to update member information');
      }
    } catch (error) {
      console.error('Error updating member information:', error);
    }
  };

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

  const Checkout = async () => {
    const memberId = searchParams.get('memberid');
    router.push(`/cart?memberid=${memberId}`);


  }
  
  

  useEffect(() => {
    // Extract memberId from URL query parameters
    const memberId = searchParams.get('memberid');
    if (memberId) {
      // Fetch member info if memberId is available
      fetchMemberInfo(memberId);
      fetchMemberHealthMetrics(memberId);
      fetchSessions();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log('Updated Member Info:', memberInfo.username);
    console.log('Updated Member Info:', memberInfo.fitnessachievements);
    console.log('Updated Member Info:', memberInfo.weight);
    console.log('Updated Member Info:', memberInfo.height);
    console.log('Updated Member Info:', memberInfo.age);
  };

  function formatSessionNameWithDateAndTime(sessionName, sessionDate, sessionTime) {
    // Split the session name at "on"
    const splitSessionName = sessionName.split(' on ');
    const formattedSessionName = splitSessionName[0]; // The part of the name before "on"

    // Format session date by taking only the first 9 characters
    const formattedSessionDate = sessionDate.substring(0, 10);

    // Format session time as needed (assuming sessionTime is already formatted)
    const formattedSessionTime = sessionTime;

    // Combine the formatted session name, session date, and session time
    return `${formattedSessionName} on ${formattedSessionDate} at ${formattedSessionTime}`;
}

  
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="dashboard-container bg-white p-8 rounded-lg shadow-md max-w-3xl w-full flex flex-col">
        <h1 className="text-3xl font-bold mb-2 text-center text-black">Welcome to Your Member Dashboard!</h1>
        <p className="text-lg text-center text-gray-700 mb-8">Here's an overview of your information:</p>
        <div className="dashboard-content flex">
          <div className="dashboard-info-container w-1/2 mr-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Personal Information</h2>
            <div className="dashboard-info">
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Username:</p>
                <input
                  type="text"
                  name="username"
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  value={memberInfo.username}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Email:</p>
                <input
                  type="text"
                  name="email"
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  value={memberInfo.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Role:</p>
                <input
                  type="text"
                  name='role'
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  defaultValue={memberInfo.role}
                />
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Password:</p>
                <input
                  type="password"
                  name="password"
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  value={memberInfo.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
              <p className="text-lg font-bold text-black">Date of Birth:</p>
              <input
                type="date"
                name="dateofbirth"
                className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                value={dob}
                onChange={handleChange}
              />
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Address:</p>
                <input
                  type="text"
                  name="address"
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  defaultValue='125 Stanly Rd'
                />
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Fitness Goals:</p>
                <input
                  type="text"
                  name="fitnessachievements"
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  value={memberInfo.fitnessachievements}
                  onChange={handleChange}
                />
              </div>
              <div className="text-center mb-4">
                <button className="bg-black text-white font-bold py-2 px-4 rounded" onClick={handleUpdateInformation}>
                  Update Information
                </button>
              </div>
            </div>
          </div>
          <div className="dashboard-metrics-container w-1/2">
            <div className="w-full mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Health Metrics</h2>
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Weight:</p>
                <input
                  type="text"
                  name="weight"
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  placeholder="Enter your weight..."
                  value={memberInfo.weight}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Height:</p>
                <input
                  type="text"
                  name="height"
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  placeholder="Enter your height..."
                  value={memberInfo.height}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold text-black">Age:</p>
                <input
                  type="text"
                  name="age"
                  className="text-base w-full border-b border-gray-300 focus:outline-none text-black"
                  placeholder="Enter your age..."
                  value={memberInfo.age}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="w-full flex flex-col">
              <h2 className="text-2xl font-bold mb-4 text-center text-black">Book a Session</h2>
              <p className="font-semibold mb-4 text-center text-black">Personal Session: $30 | Group Session $15</p>
              <div className="h-32 rounded-md p-4 flex flex-col items-center justify-center">
              <select 
                className="w-full border-b border-gray-300 focus:outline-none text-black"
                value={selectedSession}
                onChange={(e) => handleSessionSelection(e)}
              >
                <option value="">Select a training session...</option>
                {sessions.map(session => (
                    <option key={session.sessionid} value={session.sessionid}>
                    {formatSessionNameWithDateAndTime(session.sessionname, session.sessiondate, session.sessiontime)}
                  </option>
                  ))}
              </select>
            </div>
              {<button className="bg-black text-white font-bold py-2 px-4 rounded mt-4" onClick={handleAddToCart}>Add Session To Cart</button>}
              {<button className="bg-black text-white font-bold py-2 px-4 rounded mt-4" onClick={Checkout}>Go To Checkout</button>}
              <p className='text-black'>Selected Session: {selectedSession}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
