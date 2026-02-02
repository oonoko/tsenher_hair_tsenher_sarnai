# Backend API - Romantic Greeting Web App

## Бүтэц (Modular Architecture)

```
backend/
├── src/
│   ├── server.js           # Entry point
│   ├── app.js              # Express app configuration
│   ├── config/
│   │   └── index.js        # Configuration settings
│   ├── controllers/
│   │   └── greetingController.js  # Request handlers
│   ├── services/
│   │   └── greetingService.js     # Business logic
│   ├── routes/
│   │   └── greetingRoutes.js      # API routes
│   ├── middleware/
│   │   └── errorHandler.js        # Error handling
│   └── utils/
│       └── fileHandler.js         # File operations
├── data/
│   └── greetings.json      # Data storage
└── package.json
```

## Модулиуд

### 🚀 server.js
- Серверийг эхлүүлэх entry point

### ⚙️ app.js
- Express application тохиргоо
- Middleware болон routes холбох

### 📝 config/
- Тохиргооны утгууд (PORT, DATA_DIR гэх мэт)

### 🎮 controllers/
- HTTP request/response боловсруулах
- Validation хийх

### 💼 services/
- Business logic
- Өгөгдөл боловсруулах

### 🛣️ routes/
- API endpoint-үүд тодорхойлох

### 🛡️ middleware/
- Error handling
- Logging гэх мэт

### 🔧 utils/
- File operations
- Helper functions

## Ажиллуулах

```bash
npm start
```

## API Endpoints

- `POST /api/greeting` - Мэндчилгээ хадгалах
- `GET /api/greeting/:id` - Мэндчилгээ унших
