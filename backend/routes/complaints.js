const express = require('express')
const Complaint = require('../models/Complaint')
const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const router = express.Router()

// Priority -> due days map (lowercase keys to match DB values)
const DUE_DAYS = {
  urgent: 1,
  high:   3,
  medium: 7,
  low:    14
}

// Student: Submit complaint
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, category, priority } = req.body
  if (!title || !title.trim())
    return res.status(400).json({ error: 'Title is required' })
  if (!category || !category.trim())
    return res.status(400).json({ error: 'Category is required' })
  if (!description || !description.trim())
    return res.status(400).json({ error: 'Description is required' })
  if (description.trim().length < 20)
    return res.status(400).json({ error: 'Description must be at least 20 characters long' })

  try {
    const totalCount = await Complaint.countDocuments()
    const id = `CH${12345 + totalCount + 1}`

    const complaint = new Complaint({
      id,
      title: title.trim(),
      description: description.trim(),
      category,
      priority: priority || 'Medium',
      email: req.user.email,
      userRef: req.user._id,
      status: 'pending'
    })
    await complaint.save()

    // Auto-calculate dueDate based on priority
    const priorityKey = (complaint.priority || 'medium').toLowerCase()
    const days = DUE_DAYS[priorityKey] || 7
    const dueDate = new Date(complaint.createdAt)
    dueDate.setDate(dueDate.getDate() + days)
    complaint.dueDate = dueDate
    await complaint.save()

    res.status(201).json(complaint)
  } catch (err) {
    if (err.name === 'ValidationError')
      return res.status(400).json({ error: err.message })
    res.status(500).json({ error: err.message })
  }
})

// Student: Get only my complaints
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userRef: req.user._id })
      .sort({ createdAt: -1 })
    res.json(complaints)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get overdue complaints (admin / staff use)
router.get('/overdue', authMiddleware, async (req, res) => {
  try {
    const now = new Date()
    const overdue = await Complaint.find({
      dueDate: { $lt: now },
      status: { $nin: ['resolved', 'closed'] }
    }).sort({ dueDate: 1 })

    // Mark them as overdue in DB
    await Complaint.updateMany(
      {
        dueDate: { $lt: now },
        status: { $nin: ['resolved', 'closed'] }
      },
      { isOverdue: true }
    )

    res.json({
      count: overdue.length,
      complaints: overdue
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get staff performance stats (for smart assignment)
router.get('/staff-stats', authMiddleware, async (req, res) => {
  try {
    const staffList = await User.find(
      { role: 'staff' },
      { name: 1, email: 1, department: 1 }
    )

    const staffStats = await Promise.all(
      staffList.map(async (staff) => {
        const assigned = await Complaint.countDocuments({
          assignedToEmail: staff.email
        })
        const resolved = await Complaint.countDocuments({
          assignedToEmail: staff.email,
          status: 'resolved'
        })
        const overdue = await Complaint.countDocuments({
          assignedToEmail: staff.email,
          isOverdue: true,
          status: { $nin: ['resolved', 'closed'] }
        })
        const inProgress = await Complaint.countDocuments({
          assignedToEmail: staff.email,
          status: 'inprogress'
        })
        const resolutionRate = assigned > 0
          ? Math.round((resolved / assigned) * 100)
          : 0

        return {
          id: staff._id,
          name: staff.name,
          email: staff.email,
          department: staff.department || 'General',
          totalAssigned: assigned,
          resolved,
          overdue,
          inProgress,
          resolutionRate,
          workload: inProgress,
          available: inProgress < 5
        }
      })
    )

    res.json(staffStats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Admin: Get ALL complaints
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userRef', 'name email')
      .sort({ createdAt: -1 })
    res.json(complaints)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin/Staff: Update complaint status/resolution/assignment
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { 
      status, resolution, 
      assignedTo, assignedToEmail,
      staffNote 
    } = req.body;

    // Only admin or staff can update
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {};
    
    if (status) updateData.status = status;
    if (resolution) updateData.resolution = resolution;
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo;
      updateData.assignedToEmail = assignedToEmail;
      updateData.assignedAt = new Date();
      // When assigned, set status to inprogress if not already resolved
      if (status !== 'resolved' && (!status || status !== 'resolved')) {
        updateData.status = 'inprogress';
      }
    }
    if (staffNote) updateData.staffNote = staffNote;
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
      updateData.isOverdue = false; // clear overdue flag on resolve
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (err) {
    if (err.name === 'ValidationError')
      return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete complaint
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id)
    if (!complaint)
      return res.status(404).json({ error: 'Complaint not found' })
    res.json({ message: 'Complaint deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Staff: Get assigned complaints
router.get('/assigned', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      $or: [
        { assignedToEmail: req.user.email },
        { assignedTo: req.user.name }
      ]
    }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router
