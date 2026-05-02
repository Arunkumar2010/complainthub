const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true }, // legacy display ID (e.g. #CH12345)
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'WiFi & Internet',
      'Mess & Food Quality',
      'Maintenance & Repairs',
      'Billing & Fees',
      'Security & Safety',
      'Academic Issues',
      'Hostel Problems',
      'Technical Issues',
      'Billing & Payments',
      'Customer Service',
      'Product Quality',
      'Delivery & Shipping',
      'Other'
    ]
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['pending', 'inprogress', 'resolved', 'closed'],
    default: 'pending'
  },
  email: {
    type: String,
    default: ''
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: { 
    type: String, 
    default: '' 
  },
  assignedToEmail: { 
    type: String, 
    default: '' 
  },
  assignedAt: { 
    type: Date, 
    default: null 
  },
  resolvedAt: { 
    type: Date, 
    default: null 
  },
  staffNote: { 
    type: String, 
    default: '' 
  },
  resolution: {
    type: String,
    default: ''
  },
  dueDate: {
    type: Date,
    default: null
  },
  isOverdue: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('Complaint', complaintSchema)
