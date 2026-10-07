const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Alumni Portal - RESTful API Documentation',
      version: '1.0.0',
      description: 'Alumni Portal (Mezun & Fakülte Portalı) dinamik RESTful API dokümantasyonu. Sistemdeki tüm mevcut ve yeni eklenecek uç noktalar buradan interaktif olarak test edilebilir.',
      contact: {
        name: 'Alumni Portal Backend Team',
        url: 'http://localhost/about'
      }
    },
    servers: [
      {
        url: '/',
        description: 'Mevcut Aktif Sunucu (Current Server)'
      },
      {
        url: 'http://localhost',
        description: 'Yerel Sunucu Port 80 (Default HTTP)'
      },
      {
        url: 'http://localhost:3000',
        description: 'Yerel Sunucu Port 3000 (Alternative Port)'
      }
    ],
    tags: [
      {
        name: 'Users',
        description: 'Kullanıcı kayıt, listeleme, güncelleme ve silme (CRUD) işlemleri'
      },
      {
        name: 'Announcements',
        description: 'Duyuru listeleme, oluşturma, güncelleme ve silme işlemleri'
      },
      {
        name: 'Health',
        description: 'Sistem ve API sağlık/durum kontrolü'
      },
      {
        name: 'General & Legacy',
        description: 'Web sayfaları, selamlama ve hesaplama uç noktaları'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: 'Benzersiz kullanıcı kimliği'
            },
            name: {
              type: 'string',
              example: 'Berat Çelik',
              description: 'Kullanıcının tam adı'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'berat@alumni.edu',
              description: 'Kullanıcının e-posta adresi'
            },
            role: {
              type: 'string',
              enum: ['Alumni', 'Faculty', 'Student', 'Admin'],
              example: 'Alumni',
              description: 'Kullanıcı rolü'
            },
            department: {
              type: 'string',
              example: 'Bilgisayar Mühendisliği',
              description: 'Bölüm veya akademik departman'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-09-20T10:00:00.000Z',
              description: 'Kayıt tarihi'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-09-30T11:30:00.000Z',
              description: 'Son güncellenme tarihi'
            }
          }
        },
        Announcement: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Mezunlar buluşması' },
            content: { type: 'string', example: 'Etkinlik detayları...' },
            author: { type: 'string', example: 'Alumni Portal' },
            category: { type: 'string', example: 'Etkinlik' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        AnnouncementInput: {
          type: 'object', required: ['title', 'content'],
          properties: {
            title: { type: 'string', maxLength: 160 }, content: { type: 'string' },
            author: { type: 'string' }, category: { type: 'string' }
          }
        },
        AnnouncementPartialInput: {
          type: 'object',
          properties: {
            title: { type: 'string', maxLength: 160 }, content: { type: 'string' },
            author: { type: 'string' }, category: { type: 'string' }
          }
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: {
              type: 'string',
              example: 'Zeynep Kaya'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'zeynep@alumni.edu'
            },
            role: {
              type: 'string',
              enum: ['Alumni', 'Faculty', 'Student', 'Admin'],
              default: 'Alumni',
              example: 'Alumni'
            },
            department: {
              type: 'string',
              example: 'Endüstri Mühendisliği'
            }
          }
        },
        UserPartialInput: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Zeynep Demir'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'zeynep.yeni@alumni.edu'
            },
            role: {
              type: 'string',
              enum: ['Alumni', 'Faculty', 'Student', 'Admin'],
              example: 'Alumni'
            },
            department: {
              type: 'string',
              example: 'Yapay Zeka Mühendisliği'
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok'
            },
            message: {
              type: 'string',
              example: 'Alumni Portal API is running successfully'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2026-09-30T11:21:14.601Z'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Hata açıklaması'
            }
          }
        }
      }
    }
  },
  // Scan all route files and index.js for JSDoc @swagger annotations
  apis: [
    path.resolve(__dirname, '../routes/**/*.js').replace(/\\/g, '/'),
    path.resolve(__dirname, '../index.js').replace(/\\/g, '/')
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
