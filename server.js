require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const adminService = require('./services/admin.service');
const seedService = require('./services/seed.service');

const PORT = process.env.PORT || 5000;

async function startServer() {
    // Bắt buộc có khóa JWT, không dùng giá trị mặc định trong code
    if (!process.env.JWT_SECRET) {
        throw new Error('Thiếu JWT_SECRET trong .env, server không khởi động.');
    }

    await connectDB();

    const adminStatus = await adminService.ensureAdminFromEnv();
    if (adminStatus === 'created') console.log('Đã tạo tài khoản admin từ .env');

    const seeded = await seedService.syncSampleData();
    if (seeded.created) console.log(`Đã nạp ${seeded.created} công trình mẫu (kèm bản dịch).`);
    if (seeded.updated) console.log(`Đã bổ sung bản dịch cho ${seeded.updated} công trình mẫu.`);

    app.listen(PORT, () => {
        console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
}

startServer().catch((error) => {
    console.error('Lỗi khởi động server:', error.message);
    process.exit(1);
});
