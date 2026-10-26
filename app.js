const path = require('path');
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routers/admin.routes');
const artifactRoutes = require('./routers/artifact.routes');
const languageRoutes = require('./routers/language.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

// Tách app khỏi server.js để test được mà không cần mở cổng hay kết nối database
const app = express();

app.use(cors());
app.use(express.json());

// Chỉ phục vụ thư mục public/ (KHÔNG phục vụ cả thư mục dự án, tránh lộ .env và mã nguồn)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/admin', adminRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/artifacts', artifactRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
