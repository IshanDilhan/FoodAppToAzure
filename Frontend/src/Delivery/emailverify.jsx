import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RiderAuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_DELIVER_API_URL;

  useEffect(() => {
    if (successMessage && isRegister) {
      // Auto-toggle to login after 2 seconds
      const timer = setTimeout(() => {
        setIsRegister(false);
        setSuccessMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, isRegister]);

  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccessMessage('');
  
      try {
        const endpoint = isRegister ? '/register' : '/login';
        const response = await axios.post(`${API_URL}/rider${endpoint}`, {
          email,
          password
        });
  
        if (response.data.success) {
          if (isRegister) {
            setSuccessMessage('Registration successful! Redirecting to login...');
          } else {
            localStorage.setItem('accessToken', response.data.accessToken);
            //console.log("hiii")
            localStorage.setItem('refreshToken', response.data.refreshToken);
  
            const loginStatus = response.data.rider.status;
            if (loginStatus === 'PENDING') {
              navigate('/rider/location');
            } else {
              const profileResponse = await axios.get(`${API_URL}/rider/me`, {
                headers: {
                  Authorization: `Bearer ${response.data.accessToken}`
                }
              });
              handleStatusNavigation(profileResponse.data.rider.status);
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };
  
    const handleStatusNavigation = (status) => {
      switch(status) {
        case 'PENDING':
          navigate('/rider/rider-info');
          break;
        case 'PROCESSING':
          setSuccessMessage('Application under review. Redirecting...');
          setTimeout(() => navigate('/rider/review-info'), 2000);
          break;
        case 'APPROVED':
          navigate('/rider/rider-dashboard');
          break;
        case 'REJECTED':
          setSuccessMessage('Your form was rejected. Please review your details and try again with valid information.please wait we will redirect you within 5 seconds to fill out your details.');
          setTimeout(() => navigate('/rider/rider-info'), 5000);
          break;
        default:
          setError('Invalid account status');
          navigate('/login');
      }
    };
  
    
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-8 w-full max-w-md shadow-xl border border-orange-100">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => { setIsRegister(false); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              !isRegister 
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              isRegister 
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Register
          </button>
        </div>

        {successMessage && (
          <p className="text-green-600 text-center mb-4 font-medium">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RiderAuthForm;
