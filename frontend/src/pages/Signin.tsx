import { useState, useEffect } from 'react'
import * as React from 'react';

import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';


function Signin() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, [navigate]);

  async function signin() {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, { email, password });
      const { token, name: responseName } = response.data;

      if (!token) throw new Error('No token received');

      localStorage.setItem('token', token);
      localStorage.setItem('name', name || responseName || 'Guest');

      alert('Signed in successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Signin error occurred.');
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-5">Welcome Back</h1>
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
        />
        <button
          onClick={signin}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Sign In
        </button>
        <p className="mt-5 text-center text-sm">
          Don't have an account?{' '}
          <a className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/')}>
            Sign up
          </a>

        </p>
      </div>
    </div>
  );
}

export default Signin;