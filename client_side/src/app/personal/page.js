'use client'
import React, { useState } from 'react';
import { useRouter,useSearchParams } from 'next/navigation';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

const PersonalInformation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [fitnessAchievements, setFitnessAchievements] = useState('');
  const [fitnessRoutine, setFitnessRoutine] = useState('');

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleConfirmPasswordVisibilityToggle = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const username = searchParams.get('username');
  const password = searchParams.get('password');
  const role = searchParams.get('role');

  const formData = {
    username,
    password,
    role,
    fullName,
    email,
    dateOfBirth,
    weight,
    height,
    age,
    fitnessAchievements,
    fitnessRoutine
  };

  try {
    const response = await fetch('http://localhost:4000/registermember', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      console.log('Member registered successfully');
      router.push('/')
    } else {
      console.error('Failed to register member');
      // Handle error: show error message to the user
    }
  } catch (error) {
    console.error('Error registering member:', error);
    // Handle error: show error message to the user
  }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="signup-container bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4 text-center text-black">Personal Information</h1>
          
          <div className="mb-4">
            <label htmlFor="fullName" className="text-black block">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              className="w-full border-b border-black focus:outline-none focus:border-gray-500 text-black"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="text-black block">Email Address</label>
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
          </div>

          <div className="mb-4">
            <label htmlFor="dateOfBirth" className="text-black block">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              className="w-full border-b border-black focus:outline-none focus:border-gray-500 text-black"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="weight" className="text-black block">Weight</label>
            <input
              type="text"
              id="weight"
              name="weight"
              placeholder="60 kg"
              className="w-full border-b border-black focus:outline-none focus:border-gray-500 text-black"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="height" className="text-black block">Height</label>
            <input
              type="text"
              id="height"
              name="height"
              placeholder="170 cm"
              className="w-full border-b border-black focus:outline-none focus:border-gray-500 text-black"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="age" className="text-black block">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              placeholder="30"
              className="w-full border-b border-black focus:outline-none focus:border-gray-500 text-black"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="fitnessAchievements" className="text-black block">Fitness Achievements</label>
            <textarea
              id="fitnessAchievements"
              name="fitnessAchievements"
              placeholder="Enter your goals"
              className="w-full border-b border-black focus:outline-none focus:border-gray-500 text-black"
              value={fitnessAchievements}
              onChange={(e) => setFitnessAchievements(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="text-black block">Fitness Routine</label>
            <div>
              <input
                type="radio"
                id="weightlifting"
                name="fitnessRoutine"
                value="Weightlifting"
                checked={fitnessRoutine === 'Weightlifting'}
                onChange={(e) => setFitnessRoutine(e.target.value)}
              />
              <label htmlFor="weightlifting" className="ml-2 mr-4 text-black">Weightlifting</label>

              <input
                type="radio"
                id="cardio"
                name="fitnessRoutine"
                value="Cardio"
                checked={fitnessRoutine === 'Cardio'}
                onChange={(e) => setFitnessRoutine(e.target.value)}
              />
              <label htmlFor="cardio" className="ml-2 mr-4 text-black">Cardio</label>

              <input
                type="radio"
                id="aerobics"
                name="fitnessRoutine"
                value="Aerobics"
                checked={fitnessRoutine === 'Aerobics'}
                onChange={(e) => setFitnessRoutine(e.target.value)}
              />
              <label htmlFor="aerobics" className="ml-2 text-black">Aerobics</label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-gray-800 focus:outline-none focus:shadow-outline"
          >
            <strong>Submit</strong>
          </button>

          <div className="login-link mt-4 text-center text-black">
            <p>Already have an account? <a href="/">Log in</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;
