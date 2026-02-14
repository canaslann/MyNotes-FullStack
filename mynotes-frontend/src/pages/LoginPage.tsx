import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl font-serif text-light mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            MyNotes
          </motion.h1>
          <motion.p 
            className="text-gray-400 font-mono text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your thoughts Our Mission
          </motion.p>
        </div>

        {/* Login Form */}
        <motion.div
          className="bg-light border-4 border-dark p-8 shadow-[8px_8px_0px_0px_rgba(125,73,222,1)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <LogIn className="text-primary" size={24} />
            <h2 className="text-2xl font-mono font-bold text-dark">Sign In</h2>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border-2 border-red-600 p-3 mb-4 font-mono text-sm text-red-800"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-mono font-bold text-dark mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-dark font-mono text-dark focus:outline-none focus:border-primary transition-colors bg-white"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-mono font-bold text-dark mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-dark font-mono text-dark focus:outline-none focus:border-primary transition-colors bg-white"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary border-2 border-dark text-dark font-mono font-bold py-3 px-6 
                       hover:bg-accent transition-all duration-200 
                       shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]
                       hover:shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]
                       hover:translate-x-[2px] hover:translate-y-[2px]
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-mono text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary font-bold hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
