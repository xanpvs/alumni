'use strict';

const pool = require('../db/connection');
const { assertStoreInterface } = require('../db/store.interface');

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

const validate = ({ title, content }) => {
  if (typeof title !== 'string' || !title.trim()) return 'Başlık (title) zorunludur.';
  if (typeof content !== 'string' || !content.trim()) return 'İçerik (content) zorunludur.';
  if (title.trim().length > 160) return 'Başlık en fazla 160 karakter olabilir.';
  return null;
};
const invalidId = id => !Number.isInteger(id) || id <= 0;
const mapAnnouncement = row => new Announcement({
  id: row.id, title: row.title, content: row.content, author: row.author, category: row.category,
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
  updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
});
const missing = id => ({ success: false, error: `ID'si ${id} olan duyuru bulunamadı.` });

// ─────────────────────────────────────────────
//  In-Memory Fallback Veri Deposu
// ─────────────────────────────────────────────

let memoryAnnouncements = [
  new Announcement({
    id: 1,
    title: 'Alumni Portal’a Hoş Geldiniz',
    content: 'Mezunlar ve akademisyenler için duyuruları buradan takip edebilirsiniz.',
    author: 'Alumni Portal',
    category: 'Genel',
    createdAt: '2026-09-20T10:00:00.000Z'
  }),
  new Announcement({
    id: 2,
    title: 'Mezunlar Buluşması',
    content: 'Yeni etkinlik ve buluşma duyuruları bu alanda paylaşılacaktır.',
    author: 'Alumni Portal',
    category: 'Etkinlik',
    createdAt: '2026-09-21T11:30:00.000Z'
  })
];

const nextAnnouncementId = () => memoryAnnouncements.length > 0 ? Math.max(...memoryAnnouncements.map(a => a.id)) + 1 : 1;
const isConnError = err => err && (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.name === 'AggregateError');

const AnnouncementStore = {
  async create(data = {}) {
    const error = validate(data);
    if (error) return { success: false, error };
    try {
      const [result] = await pool.execute(
        'INSERT INTO announcements (title, content, author, category) VALUES (?, ?, ?, ?)',
        [data.title.trim(), data.content.trim(), data.author || 'Alumni Portal', data.category || 'Genel']
      );
      const [rows] = await pool.execute('SELECT * FROM announcements WHERE id = ?', [result.insertId]);
      return { success: true, announcement: mapAnnouncement(rows[0]) };
    } catch (err) {
      if (isConnError(err)) {
        const item = new Announcement({
          id: nextAnnouncementId(),
          title: data.title,
          content: data.content,
          author: data.author,
          category: data.category
        });
        memoryAnnouncements.unshift(item);
        return { success: true, announcement: item };
      }
      throw err;
    }
  },

  async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM announcements ORDER BY id DESC');
      return rows.map(mapAnnouncement);
    } catch (err) {
      if (isConnError(err)) return [...memoryAnnouncements];
      throw err;
    }
  },

  async getById(id) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    try {
      const [rows] = await pool.execute('SELECT * FROM announcements WHERE id = ?', [id]);
      return rows.length ? { success: true, announcement: mapAnnouncement(rows[0]) } : missing(id);
    } catch (err) {
      if (isConnError(err)) {
        const item = memoryAnnouncements.find(a => a.id === id);
        return item ? { success: true, announcement: item } : missing(id);
      }
      throw err;
    }
  },

  async update(id, data = {}) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    const error = validate(data);
    if (error) return { success: false, error };
    try {
      const current = await this.getById(id);
      if (!current.success) return current;
      await pool.execute(
        'UPDATE announcements SET title = ?, content = ?, author = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [data.title.trim(), data.content.trim(), data.author || 'Alumni Portal', data.category || 'Genel', id]
      );
      return this.getById(id);
    } catch (err) {
      if (isConnError(err)) {
        const index = memoryAnnouncements.findIndex(a => a.id === id);
        if (index === -1) return missing(id);
        const updated = new Announcement({
          id,
          title: data.title,
          content: data.content,
          author: data.author || memoryAnnouncements[index].author,
          category: data.category || memoryAnnouncements[index].category,
          createdAt: memoryAnnouncements[index].createdAt,
          updatedAt: new Date().toISOString()
        });
        memoryAnnouncements[index] = updated;
        return { success: true, announcement: updated };
      }
      throw err;
    }
  },

  async patch(id, data = {}) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    if (!['title', 'content', 'author', 'category'].some(key => data[key] !== undefined)) {
      return { success: false, error: 'Güncellenecek en az bir alan gönderilmelidir.' };
    }
    const current = await this.getById(id);
    if (!current.success) return current;
    return this.update(id, { ...current.announcement, ...data });
  },

  async delete(id) {
    if (invalidId(id)) return { success: false, error: 'ID pozitif bir tam sayı olmalıdır.' };
    try {
      const current = await this.getById(id);
      if (!current.success) return current;
      await pool.execute('DELETE FROM announcements WHERE id = ?', [id]);
      return current;
    } catch (err) {
      if (isConnError(err)) {
        const index = memoryAnnouncements.findIndex(a => a.id === id);
        if (index === -1) return missing(id);
        const [deleted] = memoryAnnouncements.splice(index, 1);
        return { success: true, announcement: deleted };
      }
      throw err;
    }
  },
};

assertStoreInterface(AnnouncementStore, 'AnnouncementStore');

module.exports = { Announcement, AnnouncementStore };
