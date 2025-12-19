// backend/controllers/authController.js

const User = require('../models/User');

// 1. دالة إنشاء حساب جديد
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // التأكد إن الايميل مش مستخدم قبل كده
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // إنشاء اليوزر في الداتابيز
    const newUser = await User.create({
      username,
      email,
      password, // (ملحوظة: في المشاريع الحقيقية لازم نشفر الباسورد، بس دلوقتي هنمشيه عادي للتبسيط)
      role
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 2. دالة تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // البحث عن اليوزر بالايميل
    const user = await User.findOne({ where: { email } });

    // لو مفيش يوزر، أو الباسورد غلط
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // نجاح الدخول
    res.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};