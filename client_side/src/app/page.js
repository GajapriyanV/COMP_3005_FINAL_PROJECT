'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

const SignUp = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState(''); // New state for full name
  const [email, setEmail] = useState(''); // New state for email
  const [dob, setDob] = useState('');

  

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleConfirmPasswordVisibilityToggle = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setFullName('');
    setEmail('');
    setDob('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    console.log('Role:', role);
    console.log('Full Name:', fullName); // Log full name
    console.log('Email:', email); // Log email
    console.log('Date of Birth:', dob);

    if (role === 'member') {
      router.push(`/personal?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`);
    } else if (role === 'trainer') {
      try {
        const response = await fetch('http://localhost:4000/registertrainer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            email,
            full_name: fullName,
            date_of_birth: dob,
          }),
        });
        if (response.ok) {
          router.push(`/login`);
          console.log("Trainer has been registered");
        } else {
          console.error('Failed to register trainer');
        }
      } catch (error) {
        console.error('Error registering trainer:', error);
      }
    } else if (role === 'admin') { // If role is admin
      try {
        const response = await fetch('http://localhost:4000/registeradmin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            email,
            full_name: fullName,
            date_of_birth: dob,
          }),
        });
        if (response.ok) {
          router.push(`/login`);
          console.log("Admin has been registered");
        } else {
          console.error('Failed to register admin');
        }
      } catch (error) {
        console.error('Error registering admin:', error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="signup-container bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4 text-center text-black">Sign Up</h1>
          
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
            {['trainer', 'admin'].includes(role) && ( // Conditionally render if role is trainer or admin
              <>
                <label htmlFor="full-name" className="text-black block mt-2">Full Name</label>
                <input
                  type="text"
                  id="full-name"
                  name="full-name"
                  placeholder="John Doe"
                  className="w-full border-b border-black focus:outline-none focus:border-gray-500 text-black"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <label htmlFor="email" className="text-black block mt-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  className="w-full border-b border-black focus:outline-none focus:border-gray-500 text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="dob" className="text-black block mt-2">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  className="w-full border-b border-black focus:outline-none focus:border-gray-500 text-black"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="text-black block mb-2">Role</label>
            <div className="flex justify-between">
              <button
                type="button"
                className={`rounded-full px-4 py-2 border border-black ${role === 'member' ? 'bg-black text-white' : 'bg-white text-black'}`}
                onClick={() => handleRoleSelection('member')}
              >
                Member
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 border border-black ${role === 'trainer' ? 'bg-black text-white' : 'bg-white text-black'}`}
                onClick={() => handleRoleSelection('trainer')}
              >
                Trainer
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 border border-black ${role === 'admin' ? 'bg-black text-white' : 'bg-white text-black'}`}
                onClick={() => handleRoleSelection('admin')}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="mb-4 relative">
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

          <div className="mb-6 relative">
            <label htmlFor="confirm-password" className="text-black block">Confirm Password</label>
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              id="confirm-password"
              name="confirm-password"
              placeholder="abc123"
              className="w-full border-b border-black focus:outline-none focus:border-gray-500 pr-10 text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleConfirmPasswordVisibilityToggle}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 focus:outline-none"
            >
              {confirmPasswordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-gray-800 focus:outline-none focus:shadow-outline"
          >
            <strong>Sign Up</strong>
          </button>

          <div className="login-link mt-4 text-center text-black">
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

