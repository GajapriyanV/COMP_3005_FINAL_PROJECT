'use client'
import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { useRouter} from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // New state for role selection

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(role);
    
    try {
      // Check the role and call the appropriate login endpoint
      if (role === 'member') {
        // Make a POST request to member login endpoint
        const response = await fetch('http://localhost:4000/memberlogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
  
        if (response.ok) {
          // Extract memberID from response
          const { memberId } = await response.json();
          // Navigate to dashboard with memberId as query parameter
          router.push(`/dashboard?memberid=${memberId}`);
        } else {
          console.error('Failed to log in as member');
          // Handle error: show error message to the user
        }
      } else if (role === 'trainer') {
        // Make a POST request to trainer login endpoint
        const trainerResponse = await fetch('http://localhost:4000/trainerlogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        if (trainerResponse.ok) {
          // Extract trainerID from response
          const { trainerId } = await trainerResponse.json();
          // Navigate to trainer dashboard with trainerId as query parameter
          router.push(`/trainer-dashboard?trainerid=${trainerId}&username=${username}`);
        } else {
          console.error('Failed to log in as trainer');
          // Handle error: show error message to the user
        }
      } else if (role === 'admin') {
        // Make a POST request to admin login endpoint
        const adminResponse = await fetch('http://localhost:4000/adminlogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        if (adminResponse.ok) {
          // Extract staffId from response
          const { staffId } = await adminResponse.json();
          // Navigate to admin dashboard with staffId as query parameter
          router.push(`/admin-dashboard?staffid=${staffId}`);
        } else {
          console.error('Failed to log in as admin');
          // Handle error: show error message to the user
        }
      } else {
        // Handle other roles if necessary
      }
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error: show error message to the user
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="signup-container bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4 text-center text-black">Login</h1>
          
          <div className="mb-4">
            <label htmlFor="role" className="text-black block">I am a:</label>
            <select
              id="role"
              name="role"
              className="w-full border-b border-black focus:outline-none focus:border-gray-500 text-black"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="member">Member</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="text-black block">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="John"
              className="w-full border-b border-black focus:outline-none focus:border-gray-500 text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="text-black block">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="abc123"
              className="w-full border-b border-black focus:outline-none focus:border-gray-500 pr-10 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handlePasswordVisibilityToggle}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 focus:outline-none"
            >
              {passwordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-gray-800 focus:outline-none focus:shadow-outline"
          >
            <strong>Login</strong>
          </button>

          <div className="login-link mt-4 text-center text-black">
            <p>Don't have an account yet? <a href="/">Sign Up</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
