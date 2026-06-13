import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream via-beige to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
            <FaLock className="text-2xl text-gold" />
          </div>
          <h1 className="font-display text-3xl text-charcoal">تسجيل الدخول</h1>
          <p className="mt-2 text-charcoal/60">لوحة تحكم المدير</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-beige bg-white p-8 shadow-xl"
        >
          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-charcoal">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full rounded-xl border border-beige bg-cream py-3 pr-12 pl-4 text-charcoal outline-none transition-colors focus:border-gold"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-charcoal">
              كلمة المرور
            </label>
            <div className="relative">
              <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-beige bg-cream py-3 pr-12 pl-12 text-charcoal outline-none transition-colors focus:border-gold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <p className="mb-4 text-center text-sm text-red-500">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full rounded-xl bg-gold py-3 font-medium text-white transition-opacity disabled:opacity-60"
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'دخول'}
          </motion.button>
        </form>

        <p className="mt-6 text-center">
          <a href="/" className="text-sm text-gold hover:underline">
            العودة للموقع
          </a>
        </p>
      </motion.div>
    </div>
  );
}
