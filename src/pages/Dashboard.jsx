/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaTrash,
  FaSignOutAlt,
  FaHeart,
  FaSync,
  FaLink,
  FaCopy,
  FaEdit,
  FaPlus,
  FaEnvelope,
  FaCamera,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { deleteWish, fetchWishes, updateWish } from '../services/wishesService';
import {
  deleteGuestPhoto,
  fetchGuestPhotos,
  toggleGuestPhotoVisibility,
  updateGuestPhotoCaption,
} from '../services/guestPhotosService';
import {
  buildInviteUrl,
  createInvite,
  deleteInvite,
  fetchInvites,
  generateSlugFromName,
  updateInvite,
} from '../services/invitesService';

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

function InvitesPanel() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [slugTouched, setSlugTouched] = useState(false);
  const [formError, setFormError] = useState('');

  const loadInvites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInvites();
      setInvites(data);
    } catch {
      setInvites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvites();
  }, [loadInvites]);

  const resetForm = () => {
    setForm({ name: '', slug: '' });
    setSlugTouched(false);
    setEditingSlug(null);
    setFormError('');
  };

  const existingSlugs = invites
    .map((invite) => invite.slug)
    .filter((slug) => slug !== editingSlug);

  const handleNameChange = (name) => {
    setForm((prev) => {
      const next = { ...prev, name };
      if (!editingSlug && !slugTouched) {
        next.slug = name.trim()
          ? generateSlugFromName(name, existingSlugs)
          : '';
      }
      return next;
    });
  };

  const handleSlugChange = (slug) => {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        slug: form.slug.trim() || generateSlugFromName(form.name, existingSlugs),
      };

      if (editingSlug) {
        await updateInvite(editingSlug, payload);
      } else {
        await createInvite(payload);
      }
      await loadInvites();
      resetForm();
    } catch (error) {
      setFormError(error.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (invite) => {
    setEditingSlug(invite.slug);
    setForm({ name: invite.name, slug: invite.slug });
    setSlugTouched(true);
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الدعوة؟')) return;

    setDeletingSlug(slug);
    try {
      await deleteInvite(slug);
      setInvites((prev) => prev.filter((invite) => invite.slug !== slug));
      if (editingSlug === slug) resetForm();
    } catch {
      alert('حدث خطأ أثناء الحذف');
    } finally {
      setDeletingSlug(null);
    }
  };

  const handleCopy = async (slug) => {
    try {
      await navigator.clipboard.writeText(buildInviteUrl(slug));
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      alert(buildInviteUrl(slug));
    }
  };

  const previewUrl = form.slug.trim() ? buildInviteUrl(form.slug) : '';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-2xl border border-beige bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
            {editingSlug ? (
              <FaEdit className="text-xl text-gold" />
            ) : (
              <FaPlus className="text-xl text-gold" />
            )}
          </div>
          <div>
            <h2 className="font-display text-xl text-charcoal">
              {editingSlug ? 'تعديل دعوة' : 'إنشاء دعوة مخصصة'}
            </h2>
            <p className="text-sm text-charcoal/60">
              اكتب اسم الضيف — الرابط يُنشأ تلقائياً ويمكنك تعديله
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="guest-name" className="mb-2 block text-sm font-medium text-charcoal">
                اسم الضيف
              </label>
              <input
                id="guest-name"
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="مثال: أحمد محمد"
                className="w-full rounded-xl border border-beige bg-cream px-4 py-3 text-charcoal outline-none transition-colors focus:border-gold"
              />
            </div>
            <div>
              <label htmlFor="invite-slug" className="mb-2 block text-sm font-medium text-charcoal">
                رابط الدعوة (slug)
                {!slugTouched && form.name.trim() && (
                  <span className="mr-2 text-xs font-normal text-charcoal/40">— تلقائي</span>
                )}
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-beige bg-cream px-4 py-3">
                <FaLink className="shrink-0 text-gold/60" />
                <span className="shrink-0 text-sm text-charcoal/40">/i/</span>
                <input
                  id="invite-slug"
                  type="text"
                  dir="ltr"
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="يُنشأ تلقائياً من الاسم"
                  className="w-full bg-transparent text-charcoal outline-none"
                />
              </div>
            </div>
          </div>

          {previewUrl && (
            <p className="rounded-lg bg-beige/50 px-4 py-2 text-sm text-charcoal/70" dir="ltr">
              {previewUrl}
            </p>
          )}

          {formError && (
            <p className="text-center text-sm text-red-500">{formError}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gold px-6 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
            >
              {saving ? 'جاري الحفظ...' : editingSlug ? 'حفظ التعديلات' : 'إنشاء الدعوة'}
            </button>
            {editingSlug && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-beige px-6 py-2.5 text-sm text-charcoal transition-colors hover:bg-beige"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-2xl border border-beige bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
            <FaEnvelope className="text-2xl text-gold" />
          </div>
          <div>
            <p className="text-sm text-charcoal/60">إجمالي الدعوات</p>
            <p className="font-display text-3xl text-gold">{invites.length}</p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      ) : invites.length === 0 ? (
        <div className="rounded-2xl border border-beige bg-white py-20 text-center">
          <p className="text-charcoal/60">لا توجد دعوات مخصصة حتى الآن</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {invites.map((invite, index) => (
            <motion.div
              key={invite.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-beige bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-medium text-charcoal">{invite.name}</h3>
                  <p className="mt-1 truncate text-sm text-charcoal/50" dir="ltr">
                    {buildInviteUrl(invite.slug)}
                  </p>
                  <p className="mt-1 text-xs text-charcoal/40">
                    {formatDate(invite.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(invite.slug)}
                    className="flex items-center gap-2 rounded-lg border border-beige px-4 py-2 text-sm text-charcoal transition-colors hover:bg-beige"
                  >
                    <FaCopy />
                    {copiedSlug === invite.slug ? 'تم النسخ!' : 'نسخ الرابط'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(invite)}
                    className="flex items-center gap-2 rounded-lg border border-beige px-4 py-2 text-sm text-charcoal transition-colors hover:bg-beige"
                  >
                    <FaEdit />
                    تعديل
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(invite.slug)}
                    disabled={deletingSlug === invite.slug}
                    className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    <FaTrash />
                    حذف
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}

function WishesPanel() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', message: '' });
  const [savingId, setSavingId] = useState(null);

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

  const startEdit = (wish) => {
    setEditingId(wish.id);
    setEditForm({ name: wish.name, message: wish.message });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', message: '' });
  };

  const handleSave = async (wishId) => {
    setSavingId(wishId);
    try {
      await updateWish(wishId, editForm);
      setWishes((prev) =>
        prev.map((wish) =>
          wish.id === wishId
            ? { ...wish, name: editForm.name.trim(), message: editForm.message.trim() }
            : wish,
        ),
      );
      cancelEdit();
    } catch (error) {
      alert(error.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (wishId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه التهنئة؟')) return;

    setDeletingId(wishId);
    try {
      await deleteWish(wishId);
      setWishes((prev) => prev.filter((wish) => wish.id !== wishId));
      if (editingId === wishId) cancelEdit();
    } catch {
      alert('حدث خطأ أثناء الحذف');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
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
              <div className="mb-4 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  {editingId === wish.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-lg border border-beige bg-cream px-3 py-2 text-sm text-charcoal outline-none focus:border-gold"
                        placeholder="الاسم"
                      />
                      <textarea
                        value={editForm.message}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, message: e.target.value }))}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-beige bg-cream px-3 py-2 text-sm text-charcoal outline-none focus:border-gold"
                        placeholder="رسالة التهنئة"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-charcoal">{wish.name}</h3>
                      <p className="mt-1 text-xs text-charcoal/50">
                        {formatDate(wish.createdAt)}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  {editingId === wish.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSave(wish.id)}
                        disabled={savingId === wish.id}
                        className="rounded-lg px-3 py-2 text-xs font-medium text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
                      >
                        {savingId === wish.id ? '...' : 'حفظ'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-lg px-3 py-2 text-xs text-charcoal/60 transition-colors hover:bg-beige"
                      >
                        إلغاء
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(wish)}
                        className="rounded-lg p-2 text-charcoal/50 transition-colors hover:bg-beige hover:text-gold"
                        aria-label="تعديل التهنئة"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(wish.id)}
                        disabled={deletingId === wish.id}
                        className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        aria-label="حذف التهنئة"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {editingId !== wish.id && (
                <p className="leading-relaxed text-charcoal/80">{wish.message}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}

function GuestPhotosPanel() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [savingId, setSavingId] = useState(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGuestPhotos();
      setPhotos(data);
    } catch {
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleToggleVisibility = async (photo) => {
    setTogglingId(photo.id);
    try {
      const nextVisible = photo.visible === false;
      await toggleGuestPhotoVisibility(photo.id, nextVisible);
      setPhotos((prev) =>
        prev.map((item) =>
          item.id === photo.id ? { ...item, visible: nextVisible } : item,
        ),
      );
    } catch {
      alert('حدث خطأ أثناء تحديث حالة الصورة');
    } finally {
      setTogglingId(null);
    }
  };

  const startEdit = (photo) => {
    setEditingId(photo.id);
    setEditCaption(photo.caption);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCaption('');
  };

  const handleSaveCaption = async (photoId) => {
    setSavingId(photoId);
    try {
      await updateGuestPhotoCaption(photoId, editCaption);
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === photoId ? { ...photo, caption: editCaption.trim() } : photo,
        ),
      );
      cancelEdit();
    } catch (error) {
      alert(error.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

    setDeletingId(photoId);
    try {
      await deleteGuestPhoto(photoId);
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
      if (editingId === photoId) cancelEdit();
    } catch {
      alert('حدث خطأ أثناء الحذف');
    } finally {
      setDeletingId(null);
    }
  };

  const visibleCount = photos.filter((photo) => photo.visible !== false).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-2xl border border-beige bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
            <FaCamera className="text-2xl text-gold" />
          </div>
          <div>
            <p className="text-sm text-charcoal/60">إجمالي الصور</p>
            <p className="font-display text-3xl text-gold">{photos.length}</p>
            <p className="mt-1 text-xs text-charcoal/50">
              {visibleCount} ظاهرة · {photos.length - visibleCount} مخفية
            </p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      ) : photos.length === 0 ? (
        <div className="rounded-2xl border border-beige bg-white py-20 text-center">
          <p className="text-charcoal/60">لا توجد صور مرفوعة حتى الآن</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                photo.visible === false ? 'border-charcoal/15 opacity-70' : 'border-beige'
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-beige">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="h-full w-full object-cover"
                />
                {photo.visible === false && (
                  <div className="absolute inset-0 flex items-center justify-center bg-charcoal/40">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-charcoal">
                      مخفية
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                {editingId === photo.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="w-full rounded-lg border border-beige bg-cream px-3 py-2 text-sm text-charcoal outline-none focus:border-gold"
                      placeholder="النص المعروض مع الصورة"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveCaption(photo.id)}
                        disabled={savingId === photo.id}
                        className="flex-1 rounded-lg bg-gold py-2 text-sm text-white disabled:opacity-50"
                      >
                        {savingId === photo.id ? 'جاري الحفظ...' : 'حفظ'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-lg border border-beige px-4 py-2 text-sm text-charcoal hover:bg-beige"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-charcoal">{photo.caption}</h3>
                    <p className="mt-1 text-xs text-charcoal/45">
                      {formatDate(photo.createdAt)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(photo)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-beige px-3 py-2 text-sm text-charcoal transition-colors hover:bg-beige"
                      >
                        <FaEdit />
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(photo)}
                        disabled={togglingId === photo.id}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors disabled:opacity-50 ${
                          photo.visible === false
                            ? 'border-green-200 text-green-600 hover:bg-green-50'
                            : 'border-beige text-charcoal hover:bg-beige'
                        }`}
                      >
                        {photo.visible === false ? <FaEye /> : <FaEyeSlash />}
                        {photo.visible === false ? 'إظهار' : 'إخفاء'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(photo.id)}
                        disabled={deletingId === photo.id}
                        className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        <FaTrash />
                        حذف
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('invites');
  const [refreshKey, setRefreshKey] = useState(0);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-beige bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-display text-2xl text-charcoal">لوحة التحكم</h1>
            <p className="text-sm text-charcoal/60">إدارة الدعوات والتهاني والصور</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-lg border border-beige px-4 py-2 text-sm text-charcoal transition-colors hover:bg-beige"
            >
              <FaSync />
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
        <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-beige bg-white p-2 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('invites')}
            className={`flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'invites'
                ? 'bg-gold text-white'
                : 'text-charcoal hover:bg-beige'
            }`}
          >
            <FaEnvelope />
            الدعوات
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'photos'
                ? 'bg-gold text-white'
                : 'text-charcoal hover:bg-beige'
            }`}
          >
            <FaCamera />
            صور العريس
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('wishes')}
            className={`flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'wishes'
                ? 'bg-gold text-white'
                : 'text-charcoal hover:bg-beige'
            }`}
          >
            <FaHeart />
            التهاني
          </button>
        </div>

        {activeTab === 'invites' && <InvitesPanel key={`invites-${refreshKey}`} />}
        {activeTab === 'photos' && <GuestPhotosPanel key={`photos-${refreshKey}`} />}
        {activeTab === 'wishes' && <WishesPanel key={`wishes-${refreshKey}`} />}
      </main>
    </div>
  );
}
