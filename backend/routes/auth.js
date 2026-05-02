const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const Complaint = require('../models/Complaint')

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' })
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists)
      return res.status(400).json({ error: 'User already exists' })
    const hashed = await bcrypt.hash(password, 10)
    
    const allowedRoles = ['user', 'admin', 'staff']
    const userRole = allowedRoles.includes(role) ? role : 'user'

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role: userRole
    })
    await user.save()
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.status(201).json({ token, role: user.role, name: user.name, email: user.email })
  } catch (err) {
    console.error('Register error:', err.message)
    res.status(500).json({ error: 'Server error during registration' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'All fields are required' })
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user)
      return res.status(400).json({ error: 'Invalid credentials' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid credentials' })
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    // Return structured response as requested
    res.json({
      token: token,
      role: user.role,
      name: user.name,
      email: user.email
    })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ error: 'Server error during login' })
  }
})

// GET CURRENT USER
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    // Return structured response including role as requested
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      department: user.department || '',
      employeeId: user.employeeId || '',
      officeLocation: user.officeLocation || '',
      createdAt: user.createdAt
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// UPDATE PROFILE
router.patch('/update', authMiddleware, async (req, res) => {
  try {
    const { name, phone, address, department, officeLocation } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, department, officeLocation },
      { new: true, runValidators: true }
    ).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// CHANGE PASSWORD
router.patch('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch)
      return res.status(400).json({ error: 'Current password is incorrect' })
    if (newPassword.length < 6)
      return res.status(400).json({ error: 'New password must be at least 6 characters' })
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE ACCOUNT
router.delete('/delete', authMiddleware, async (req, res) => {
  try {
    await Complaint.deleteMany({ userRef: req.user._id })
    await User.findByIdAndDelete(req.user._id)
    res.json({ message: 'Account deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET USER COUNT (admin only)
router.get('/users/count', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'user' })
    res.json({ count })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET STAFF LIST
router.get('/staff-list', authMiddleware, async (req, res) => {
  try {
    const staffList = await User.find(
      { role: 'staff' },
      { name: 1, email: 1, department: 1, _id: 1 }
    )
    res.json(staffList)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// MAKE ADMIN (one-time use — no auth required for setup)
router.post('/make-admin', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.role = 'admin'
    await user.save()
    res.json({ message: `${email} is now admin`, role: user.role })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// RESET PASSWORD (fix old plain-text password users)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    res.json({ message: '✅ Password reset successfully. You can now login.' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// CHECK USER IN DB (debug)
router.get('/check/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() })
    if (!user) return res.json({ exists: false })
    res.json({
      exists: true,
      name: user.name,
      role: user.role,
      isBcrypt: user.password.startsWith('$2b$'),
      createdAt: user.createdAt
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// DB HEALTH CHECK
router.get('/db-status', async (req, res) => {
  try {
    const userCount = await User.countDocuments()
    res.json({
      status: '✅ Database connected and working',
      totalUsers: userCount,
      database: 'complainthub'
    })
  } catch (err) {
    res.status(500).json({ status: '❌ Database error', error: err.message })
  }
})

module.exports = router
