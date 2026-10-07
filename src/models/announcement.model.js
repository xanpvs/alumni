/** In-memory announcement model and CRUD store. Data resets when the server restarts. */
class Announcement {
  constructor({ id, title, content, author, category, createdAt, updatedAt }) {
    this.id = id;
    this.title = String(title || '').trim();
    this.content = String(content || '').trim();
    this.author = String(author || '').trim() || 'Alumni Portal';
    this.category = String(category || '').trim() || 'Genel';
    this.createdAt = createdAt || new Date().toISOString();
    if (updatedAt) this.updatedAt = updatedAt;
  }
}

let nextId = 3;
const store = [
  new Announcement({ id: 1, title: 'Alumni Portal’a Hoş Geldiniz', content: 'Mezunlar ve akademisyenler için duyuruları buradan takip edebilirsiniz.', author: 'Alumni Portal', category: 'Genel' }),
  new Announcement({ id: 2, title: 'Mezunlar Buluşması', content: 'Yeni etkinlik ve buluşma duyuruları bu alanda paylaşılacaktır.', author: 'Alumni Portal', category: 'Etkinlik' })
];

const validate = ({ title, content }) => {
  if (typeof title !== 'string' || !title.trim()) return 'Başlık (title) zorunludur.';
  if (typeof content !== 'string' || !content.trim()) return 'İçerik (content) zorunludur.';
  if (title.trim().length > 160) return 'Başlık en fazla 160 karakter olabilir.';
  return null;
};

const AnnouncementStore = {
  getAll() { return store.map(item => new Announcement(item)); },
  getById(id) {
    if (!Number.isInteger(id) || id <= 0) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    const announcement = store.find(item => item.id === id);
    return announcement ? { success: true, announcement } : { success: false, error: `ID'si ${id} olan duyuru bulunamadı.` };
  },
  create(data) {
    const error = validate(data || {});
    if (error) return { success: false, error };
    const announcement = new Announcement({ ...data, id: nextId++ });
    store.unshift(announcement);
    return { success: true, announcement };
  },
  update(id, data) {
    const found = this.getById(id);
    if (!found.success) return found;
    const error = validate(data || {});
    if (error) return { success: false, error };
    const updated = new Announcement({ ...data, id, createdAt: found.announcement.createdAt, updatedAt: new Date().toISOString() });
    store[store.findIndex(item => item.id === id)] = updated;
    return { success: true, announcement: updated };
  },
  patch(id, data) {
    const found = this.getById(id);
    if (!found.success) return found;
    if (!data || !['title', 'content', 'author', 'category'].some(key => data[key] !== undefined)) return { success: false, error: 'Güncellenecek en az bir alan gönderilmelidir.' };
    const current = found.announcement;
    const merged = { title: data.title ?? current.title, content: data.content ?? current.content, author: data.author ?? current.author, category: data.category ?? current.category };
    const error = validate(merged);
    if (error) return { success: false, error };
    const updated = new Announcement({ ...merged, id, createdAt: current.createdAt, updatedAt: new Date().toISOString() });
    store[store.findIndex(item => item.id === id)] = updated;
    return { success: true, announcement: updated };
  },
  delete(id) {
    const found = this.getById(id);
    if (!found.success) return found;
    store.splice(store.findIndex(item => item.id === id), 1);
    return found;
  }
};

module.exports = { Announcement, AnnouncementStore };
