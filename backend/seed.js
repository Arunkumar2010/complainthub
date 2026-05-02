const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const User = require('./models/User')

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    // DELETE ALL EXISTING USERS COMPLETELY
    await User.deleteMany({})
    console.log('All old users deleted')

    // CREATE FRESH STUDENT
    await User.create({
      name: 'Arun',
      email: 'arun@gmail.com',
      password: await bcrypt.hash('123456', 10),
      role: 'user'
    })
    console.log('Created: arun@gmail.com / 123456 (STUDENT)')

    // CREATE FRESH ADMIN
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    })
    console.log('Created: admin@example.com / admin123 (ADMIN)')

    console.log('\nDone! Fresh accounts ready:')
    console.log('Student: arun@gmail.com / 123456')
    console.log('Admin:   admin@example.com / admin123')
    process.exit(0)
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

seed()
