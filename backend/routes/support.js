const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Complaint = require('../models/Complaint');

const COLLEGE_KNOWLEDGE = `
=== COMPLAINTHUB SYSTEM KNOWLEDGE ===

ABOUT THE SYSTEM:
ComplaintHub is an Online Complaint Management System built for college students to submit complaints and get resolutions from management.
Built as a SEPM (Software Engineering and Project Management) academic project.

COLLEGE CONTEXT:
- System is for college students living in hostel and attending classes
- Students face problems with hostel, mess, wifi, maintenance, billing, academics, security
- Staff members are department employees who handle and resolve complaints
- Admin is the college management who oversees everything and assigns work to staff

HOW THE COMPLAINT SYSTEM WORKS:
Step 1: Student submits complaint with title, category, priority, and description
Step 2: Complaint gets ID and status = PENDING
Step 3: Admin reviews and assigns to staff member
Step 4: Status changes to IN PROGRESS
Step 5: Staff resolves the complaint with notes
Step 6: Status changes to RESOLVED
Step 7: Student sees resolution message

COMPLAINT CATEGORIES AND WHAT THEY COVER:

1. WiFi & Internet:
   - WiFi not working in hostel rooms
   - Slow internet speed
   - Cannot connect to college network
   - WiFi down in specific blocks
   - Router issues

2. Mess & Food Quality:
   - Bad food quality in mess
   - Undercooked or stale food
   - Unhygienic conditions in mess kitchen
   - Wrong menu served
   - Food timing issues
   - Extra charges in mess bill

3. Maintenance & Repairs:
   - Broken furniture in rooms
   - Leaking taps or pipes
   - Electrical issues in rooms
   - Broken windows or doors
   - Water supply problems
   - Lift not working

4. Billing & Fees:
   - Extra fees charged wrongly
   - Hostel fee discrepancy
   - Mess fee issues
   - Fee receipt not given
   - Double payment issue
   - Scholarship deduction problems

5. Security & Safety:
   - Gate left unlocked at night
   - Unknown persons in hostel
   - Security guard absent
   - CCTV not working
   - Poor lighting in corridors
   - Emergency exit blocked

6. Academic Issues:
   - Faculty not attending class
   - Wrong marks given
   - Lab equipment not working
   - Library books not available
   - Exam hall issues
   - Course material not provided

7. Hostel Problems:
   - Room allocation issues
   - Roommate conflicts
   - Hostel rule violations
   - Common area maintenance
   - Hot water not available
   - Laundry facility broken

8. Other:
   - Any complaint not in above categories
   - General suggestions
   - Appreciation for staff

PRIORITY LEVELS AND WHAT THEY MEAN:

URGENT (resolve within 24 hours):
  - Safety and security threats
  - No water supply
  - Medical emergency related
  - Electrical hazard
  - Examples: Gate unlocked at night, No water in entire block, Power failure

HIGH (resolve within 3 days):
  - WiFi completely down
  - Serious food quality issue
  - Major maintenance issue
  - Examples: WiFi down for 3 days, Food causing illness, Roof leaking

MEDIUM (resolve within 7 days):
  - Partial WiFi issues
  - Minor maintenance
  - Billing discrepancy
  - Examples: Slow internet, Single tap leaking, Wrong fee amount

LOW (resolve within 14 days):
  - General suggestions
  - Minor inconveniences
  - Non-urgent requests
  - Examples: Better menu request, Room repaint request

COMPLAINT STATUS MEANINGS:

PENDING:
  - Just submitted by student
  - Admin has not reviewed yet
  - No staff assigned
  - Waiting in queue

IN PROGRESS:
  - Admin has reviewed and assigned to staff
  - Staff member is working on it
  - Action is being taken
  - Student should wait for resolution

RESOLVED:
  - Staff has fixed the issue
  - Resolution message is added
  - Student can see what was done
  - Case is complete

CLOSED:
  - Admin or system has closed the case
  - No further action needed

STAFF DEPARTMENTS:
- IT Department: handles WiFi, internet, computer lab issues
- Maintenance Department: handles repairs, water, electrical, furniture
- Accounts Department: handles billing, fees, payment issues
- Mess Department: handles food, kitchen, mess timing issues
- Security Department: handles gate, CCTV, safety issues
- Academic Department: handles faculty, marks, lab, library issues
- Hostel Administration: handles room, hostel rules, general hostel issues

SMART STAFF ASSIGNMENT RULES:
Admin should assign based on:
1. Category matches staff department
2. Staff with lowest current workload
3. Staff with highest resolution rate
4. For URGENT complaints always pick available staff

Category to Department mapping:
- WiFi & Internet → IT Department
- Maintenance & Repairs → Maintenance Department
- Billing & Fees → Accounts Department
- Mess & Food Quality → Mess Department
- Security & Safety → Security Department
- Academic Issues → Academic Department
- Hostel Problems → Hostel Administration

DUE DATE RULES:
- Urgent: due in 1 day
- High: due in 3 days
- Medium: due in 7 days
- Low: due in 14 days

OVERDUE MEANS:
Complaint due date has passed but status is still not RESOLVED or CLOSED.
Admin must take immediate action on overdue.
Staff must prioritize overdue over new ones.

COMMON STUDENT QUESTIONS AND ANSWERS:

Q: How do I submit a complaint?
A: Go to Submit page from navbar. Fill in complaint title (brief summary), select category, choose priority level, write detailed description (minimum 20 characters). Click Submit Complaint button.

Q: How long will it take to resolve?
A: Urgent=24hrs, High=3 days, Medium=7 days, Low=14 days. These are target times. Actual time may vary.

Q: Who will resolve my complaint?
A: Admin will assign it to the right staff member based on category. For example, WiFi issues go to IT Department staff.

Q: Can I edit my complaint after submitting?
A: No. Once submitted complaints cannot be edited. Add more details in a follow-up complaint if needed.

Q: What if my complaint is overdue?
A: Contact admin through Help page or ask Matty to check the status for you.

Q: How will I know when resolved?
A: Check My Complaints page. Status will change to RESOLVED and you will see the resolution message from staff.

MATTY PERSONALITY:
- Friendly like a helpful college senior
- Uses simple easy English
- Empathetic with frustrated students
- Direct and actionable with admin and staff
- Uses emojis for urgency: 🔴 overdue, 🟠 due today, 🟡 due soon, 🟢 ok
- Keeps responses short and clear
- Never makes up data
- Always refers to real database information
`;

// Contact form route (existing)
router.post('/contact', async (req, res) => {
  try {
    const { subject, message, email } = req.body;
    
    console.log('--- NEW SUPPORT REQUEST ---');
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('From:', email || 'Anonymous');
    console.log('---------------------------');

    res.json({ success: true, message: 'Support request received successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Helper: Search Offline Knowledge Base ---
function findOfflineAnswer(message) {
  try {
    const filePath = path.join(__dirname, '../data/matty-knowledge.json');
    if (!fs.existsSync(filePath)) return null;
    
    const mattyKnowledge = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const msg = message.toLowerCase().trim();

    let bestMatch = null;
    let highestScore = 0;

    for (const qa of mattyKnowledge.qa) {
      let score = 0;
      
      for (const keyword of qa.keywords) {
        const kw = keyword.toLowerCase();
        // Exact phrase match = higher score
        if (msg.includes(kw)) {
          score += kw.includes(' ') ? 3 : 1;
        }
        // Word boundary match
        const words = msg.split(/\W+/); // Better word splitting
        if (words.some(w => w === kw)) {
          score += 2;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = qa;
      }
    }

    // Higher threshold for better accuracy
    if (highestScore >= 2 && bestMatch) {
      return {
        answer: bestMatch.answer,
        question: bestMatch.question,
        score: highestScore
      };
    }
    
    // Low confidence match
    if (highestScore === 1 && bestMatch) {
      return {
        answer: bestMatch.answer,
        question: bestMatch.question,
        score: highestScore,
        lowConfidence: true
      };
    }
    
    return null;
  } catch (err) {
    console.error('Offline search error:', err);
    return null;
  }
}

// Matty AI chat route — Smart, Data-Aware
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key loaded:', apiKey ? 'YES - ' + apiKey.substring(0, 8) + '...' : 'NO - KEY MISSING');

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not found in .env' });
    }

    const { message, history } = req.body;
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Matty received:', message);

    // --- HYBRID LOGIC: Check Offline Knowledge Base First ---
    const offlineResult = findOfflineAnswer(message);
    if (offlineResult) {
      console.log('Matty: Found offline answer for:', message, '(Score:', offlineResult.score + ')');
      
      const prefix = offlineResult.lowConfidence
        ? '_(Best match found)_\n\n'
        : '';
      
      const reply = prefix + offlineResult.answer + "\n\n(I found this in my quick-reference guide! ⚡)";

      return res.json({
        reply,
        history: [
          ...(history || []),
          { role: 'user', content: message },
          { role: 'assistant', content: reply }
        ],
        source: 'offline',
        matchedQuestion: offlineResult.question
      });
    }

    // --- ONLINE LOGIC: Gemini AI (Data-Aware) ---
    const currentUser = req.user;
    const role = currentUser.role;
    const now = new Date();

    // -----------------------------------------------------------------------
    // Build role-specific data context from MongoDB
    // -----------------------------------------------------------------------
    let dataContext = '';

    if (role === 'user') {
      // Student: their own complaints only
      const myComplaints = await Complaint.find({ userRef: currentUser._id })
        .sort({ createdAt: -1 })
        .limit(15);

      const totalComplaints  = myComplaints.length;
      const pendingCount     = myComplaints.filter(c => c.status === 'pending').length;
      const inProgressCount  = myComplaints.filter(c => c.status === 'inprogress').length;
      const resolvedCount    = myComplaints.filter(c => c.status === 'resolved').length;
      const overdueCount     = myComplaints.filter(c => {
        const due = c.dueDate ? new Date(c.dueDate) : null;
        return due && due < now && c.status !== 'resolved';
      }).length;

      const complaintSummary = myComplaints.map(c => {
        const due = c.dueDate ? new Date(c.dueDate) : null;
        const daysLeft = due ? Math.ceil((due - now) / (1000 * 60 * 60 * 24)) : null;
        const dueSummary = daysLeft === null ? 'Not set'
          : daysLeft > 0 ? `${daysLeft} days left`
          : `OVERDUE by ${Math.abs(daysLeft)} day(s)`;
        return [
          `  • ID: #${c.id || c._id.toString().slice(-6)}`,
          `    Title: "${c.title}"`,
          `    Category: ${c.category} | Priority: ${c.priority}`,
          `    Status: ${c.status}`,
          `    Assigned to: ${c.assignedTo || 'Not yet assigned'}`,
          `    Due: ${due ? due.toDateString() : 'Not set'} (${dueSummary})`,
          `    Resolution: ${c.resolution || c.staffNote || 'Pending'}`,
          `    Submitted: ${new Date(c.createdAt).toDateString()}`
        ].join('\n');
      }).join('\n\n');

      dataContext = `
=== LIVE DATA: STUDENT — ${currentUser.name} (${currentUser.email}) ===
Total Complaints Submitted: ${totalComplaints}
  Pending      : ${pendingCount}
  In Progress  : ${inProgressCount}
  Resolved     : ${resolvedCount}
  Overdue      : ${overdueCount}

MY COMPLAINT DETAILS:
${complaintSummary || '  No complaints submitted yet.'}
`;

    } else if (role === 'admin') {
      // Admin: all complaints + staff stats
      const allComplaints = await Complaint.find({})
        .sort({ createdAt: -1 })
        .limit(50);

      const pendingC    = allComplaints.filter(c => c.status === 'pending');
      const inProgressC = allComplaints.filter(c => c.status === 'inprogress');
      const resolvedC   = allComplaints.filter(c => c.status === 'resolved');
      const overdueC    = allComplaints.filter(c => {
        const due = c.dueDate ? new Date(c.dueDate) : null;
        return due && due < now && !['resolved', 'closed'].includes(c.status);
      });

      const overdueList = overdueC.map(c => {
        const due = new Date(c.dueDate);
        const daysOverdue = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
        return `  🔴 "${c.title}" | Priority: ${c.priority} | Overdue by ${daysOverdue} day(s) | Assigned to: ${c.assignedTo || 'UNASSIGNED'} | Student: ${c.email}`;
      }).join('\n');

      // Staff performance
      const staffList = await User.find({ role: 'staff' }, { name: 1, email: 1, department: 1 });

      const staffPerf = await Promise.all(staffList.map(async (s) => {
        const totalA   = await Complaint.countDocuments({ assignedToEmail: s.email });
        const resolved = await Complaint.countDocuments({ assignedToEmail: s.email, status: 'resolved' });
        const active   = await Complaint.countDocuments({ assignedToEmail: s.email, status: 'inprogress' });
        const sOverdue = await Complaint.countDocuments({ assignedToEmail: s.email, isOverdue: true, status: { $nin: ['resolved','closed'] } });
        const rate     = totalA > 0 ? Math.round((resolved / totalA) * 100) : 0;
        const workloadLabel = active < 3 ? '🟢 Low' : active < 6 ? '🟡 Medium' : '🔴 High';
        return `  • ${s.name} (${s.department || 'General'})` +
               `\n    Active: ${active} | Resolved: ${resolved} | Overdue: ${sOverdue} | Rate: ${rate}% | Workload: ${workloadLabel}`;
      }));

      dataContext = `
=== LIVE DATA: ADMIN DASHBOARD ===
Today: ${now.toDateString()}

COMPLAINT OVERVIEW (last 50):
  Total      : ${allComplaints.length}
  Pending    : ${pendingC.length}
  In Progress: ${inProgressC.length}
  Resolved   : ${resolvedC.length}
  ⚠️ OVERDUE : ${overdueC.length}

OVERDUE COMPLAINTS (requires immediate action):
${overdueList || '  ✅ No overdue complaints — great job!'}

STAFF PERFORMANCE & WORKLOAD:
${staffPerf.length > 0 ? staffPerf.join('\n\n') : '  No staff members registered yet.'}

SMART ASSIGNMENT GUIDE FOR MATTY:
When admin asks who to assign to, recommend the staff member with:
  1. Lowest active workload (fewest in-progress complaints)
  2. Highest resolution rate
  3. Department matching the complaint category if possible
`;

    } else if (role === 'staff') {
      // Staff: their assigned complaints with urgency
      const assignedComplaints = await Complaint.find({
        $or: [
          { assignedToEmail: currentUser.email },
          { assignedTo: currentUser.name }
        ]
      }).sort({ dueDate: 1 });

      const overdueA   = assignedComplaints.filter(c => {
        const due = c.dueDate ? new Date(c.dueDate) : null;
        return due && due < now && c.status !== 'resolved';
      });
      const dueTodayA  = assignedComplaints.filter(c => {
        const due = c.dueDate ? new Date(c.dueDate) : null;
        return due && due.toDateString() === now.toDateString() && c.status !== 'resolved';
      });
      const dueSoonA   = assignedComplaints.filter(c => {
        const due = c.dueDate ? new Date(c.dueDate) : null;
        if (!due) return false;
        const d = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        return d > 0 && d <= 2 && c.status !== 'resolved';
      });
      const resolvedA  = assignedComplaints.filter(c => c.status === 'resolved');

      const complaintDetails = assignedComplaints.map(c => {
        const due = c.dueDate ? new Date(c.dueDate) : null;
        const daysLeft = due ? Math.ceil((due - now) / (1000 * 60 * 60 * 24)) : null;
        const urgency = daysLeft === null     ? '⚪ Unknown'
          : daysLeft < 0                      ? `🔴 OVERDUE by ${Math.abs(daysLeft)} day(s)`
          : daysLeft === 0                    ? '🟠 DUE TODAY'
          : daysLeft <= 2                     ? `🟡 Due in ${daysLeft} day(s)`
          :                                     `🟢 Due in ${daysLeft} day(s)`;
        return [
          `  • "${c.title}"`,
          `    Category: ${c.category} | Priority: ${c.priority} | Status: ${c.status}`,
          `    Student: ${c.email}`,
          `    Due: ${due ? due.toDateString() : 'Not set'} — ${urgency}`
        ].join('\n');
      }).join('\n\n');

      dataContext = `
=== LIVE DATA: STAFF — ${currentUser.name} (${currentUser.email}) ===
Today: ${now.toDateString()}

MY ASSIGNMENT SUMMARY:
  Total Assigned : ${assignedComplaints.length}
  🔴 Overdue     : ${overdueA.length}
  🟠 Due Today   : ${dueTodayA.length}
  🟡 Due in 2d   : ${dueSoonA.length}
  In Progress    : ${assignedComplaints.filter(c => c.status === 'inprogress').length}
  ✅ Resolved     : ${resolvedA.length}

MY ASSIGNED COMPLAINTS (sorted by due date, most urgent first):
${complaintDetails || '  No complaints assigned yet.'}
`;
    }

    // -----------------------------------------------------------------------
    // Build Matty system prompt
    // -----------------------------------------------------------------------
    const systemPrompt = `
${COLLEGE_KNOWLEDGE}

You are Matty, a smart, friendly AI support assistant for ComplaintHub.

You have access to REAL LIVE DATA pulled directly from the MongoDB database right now. Use it to give specific, accurate answers. Do NOT make up data.

Current User : ${currentUser.name}
Role         : ${role}
Date Today   : ${now.toDateString()}

${dataContext}

=== YOUR BEHAVIOR BY ROLE ===

FOR STUDENTS (role = user):
- Answer questions about THEIR specific complaints by name, ID, and status
- Proactively warn if any complaint is overdue
- Tell them exactly who it is assigned to and how many days remain
- Encourage them if things are on track
- Example: "Your WiFi complaint (#CH12346) is In Progress, assigned to Staff. It was due yesterday, so it is slightly overdue — but the team is working on it! 🔴"

FOR ADMIN (role = admin):
- IMMEDIATELY flag any overdue complaints at the start of the response
- Suggest which staff member to assign based on workload, resolution rate, and department match
- Provide a concise performance summary of all staff
- Recommend concrete next actions
- Example: "⚠️ You have 2 overdue complaints! I recommend assigning the Mess issue to Ravi — he has the lowest workload (2 active) and an 80% resolution rate. 🟡"

FOR STAFF (role = staff):
- Lead with overdue items first (highest urgency)
- Then show due-today, then due-soon, then the rest
- Be encouraging but direct about what needs action today
- Example: "🔴 Heads up! You have 1 overdue complaint — the Bathroom issue was due yesterday. Please resolve it ASAP! You also have 1 due today and 2 more this week. You've got this! 💪"

=== RESPONSE RULES ===
- Always use the real live data above — never invent numbers or names
- Use urgency emojis: 🔴 overdue | 🟠 due today | 🟡 due soon | 🟢 on track
- Be specific: names, dates, complaint IDs, numbers
- Keep replies clear and actionable (3–6 sentences for most answers)
- If the data shows nothing, say so honestly
- For admin staff suggestions, always explain WHY (workload, rate, department)
- If you truly do not know something, say: "I'm not sure! Please email support@complainthub.com 😊"`;

    // -----------------------------------------------------------------------
    // Build the full prompt with conversation history
    // -----------------------------------------------------------------------
    let fullPrompt = systemPrompt + '\n\n';
    if (history && history.length > 0) {
      fullPrompt += 'PREVIOUS CONVERSATION:\n';
      history.forEach(msg => {
        const speaker = msg.role === 'user' ? currentUser.name : 'Matty';
        fullPrompt += `${speaker}: ${msg.content}\n`;
      });
      fullPrompt += '\n';
    }
    fullPrompt += `${currentUser.name}: ${message}\nMatty:`;

    // -----------------------------------------------------------------------
    // Call Gemini API
    // -----------------------------------------------------------------------
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    console.log('Calling Gemini API...');
    const result = await model.generateContent(fullPrompt);
    const reply = result.response.text();
    console.log('Matty reply:', reply.substring(0, 80));

    res.json({
      reply,
      history: [
        ...(history || []),
        { role: 'user', content: message },
        { role: 'assistant', content: reply }
      ]
    });

  } catch (error) {
    console.error('=== MATTY ERROR ===');
    console.error(error.message);
    console.error('===================');
    res.status(500).json({ error: 'Matty is unavailable. Please try again!' });
  }
});

module.exports = router;

