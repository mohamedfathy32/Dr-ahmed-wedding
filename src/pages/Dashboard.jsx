/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaSignOutAlt, FaHeart, FaSync } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { deleteWish, fetchWishes } from '../services/wishesService';

function formatDate(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Dashboard() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const loadWishes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWishes();
      setWishes(data);
    } catch {
      setWishes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishes();
  }, [loadWishes]);

  const handleDelete = async (wishId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه التهنئة؟')) return;

    setDeletingId(wishId);
    try {
      await deleteWish(wishId);
      setWishes((prev) => prev.filter((wish) => wish.id !== wishId));
    } catch {
      alert('حدث خطأ أثناء الحذف');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-beige bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-display text-2xl text-charcoal">لوحة التحكم</h1>
            <p className="text-sm text-charcoal/60">إدارة تهاني الزوار</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadWishes}
              className="flex items-center gap-2 rounded-lg border border-beige px-4 py-2 text-sm text-charcoal transition-colors hover:bg-beige"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              تحديث
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-charcoal px-4 py-2 text-sm text-white transition-colors hover:bg-charcoal-light"
            >
              <FaSignOutAlt />
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-beige bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-gold/10">
              <FaHeart className="text-2xl text-rose-gold" />
            </div>
            <div>
              <p className="text-sm text-charcoal/60">إجمالي التهاني</p>
              <p className="font-display text-3xl text-gold">{wishes.length}</p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        ) : wishes.length === 0 ? (
          <div className="rounded-2xl border border-beige bg-white py-20 text-center">
            <p className="text-charcoal/60">لا توجد تهاني حتى الآن</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-beige bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-charcoal">{wish.name}</h3>
                    <p className="mt-1 text-xs text-charcoal/50">
                      {formatDate(wish.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(wish.id)}
                    disabled={deletingId === wish.id}
                    className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label="حذف التهنئة"
                  >
                    <FaTrash />
                  </button>
                </div>
                <p className="leading-relaxed text-charcoal/80">{wish.message}</p>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
