import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: '', email: '', phone: '',
    department: '', officeLocation: '', role: ''
  });
  const [form, setForm] = useState({
    name: '', phone: '', department: '',
    officeLocation: ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '', newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Get role from JWT token
  const token = localStorage.getItem('token');
  let role = 'user';
  try {
    if (token) {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      );
      role = payload.role || 'user';
    }
  } catch (e) {
    role = 'user';
  }

  // Theme based on role
  const theme = {
    user:  { color: '#2563eb', light: '#eff6ff', 
              badge: 'STUDENT', label: 'Student' },
    staff: { color: '#16a34a', light: '#f0fdf4', 
              badge: 'STAFF',   label: 'Staff Member' },
    admin: { color: '#7c3aed', light: '#f5f3ff', 
              badge: 'ADMIN',   label: 'Administrator' },
  };
  const t = theme[role] || theme.user;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
        setForm({
          name: res.data.name || '',
          phone: res.data.phone || '',
          department: res.data.department || '',
          officeLocation: res.data.officeLocation || ''
        });
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await api.patch('/auth/update', form);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update profile.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePassword = async () => {
    if (passwords.newPassword !== 
        passwords.confirmPassword) {
      setError('New passwords do not match.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    try {
      await api.patch('/auth/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setMessage('Password updated successfully!');
      setPasswords({ currentPassword: '', 
        newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 
        'Failed to update password.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(n => n[0]).join('').toUpperCase()
      .slice(0, 2);
  };

  if (loading) return (
    <div style={{ display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', height: '100vh' }}>
      <p>Loading profile...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', 
      background: '#f8fafc' }}>
      
      <Navbar />

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1100px', 
        margin: '2rem auto', padding: '0 1.5rem',
        display: 'grid', 
        gridTemplateColumns: '260px 1fr',
        gap: '1.5rem' }}>

        {/* LEFT SIDEBAR */}
        <div style={{ background: 'white',
          borderRadius: '16px', padding: '2rem',
          border: '1px solid #e5e7eb',
          height: 'fit-content',
          textAlign: 'center' }}>
          
          {/* Avatar */}
          <div style={{ width: '80px', height: '80px',
            borderRadius: '50%', 
            background: t.color,
            color: 'white', fontSize: '1.75rem',
            fontWeight: '700', margin: '0 auto 1rem',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center' }}>
            {getInitials(user.name)}
          </div>
          
          <div style={{ fontWeight: '700', 
            fontSize: '1.1rem', marginBottom: '0.25rem' }}>
            {user.name || 'User'}
          </div>
          <div style={{ color: '#6b7280', 
            fontSize: '0.85rem', marginBottom: '1rem' }}>
            {user.email}
          </div>
          
          {/* Role Badge */}
          <div style={{ display: 'inline-block',
            background: t.light, color: t.color,
            padding: '4px 16px', borderRadius: '20px',
            fontSize: '0.78rem', fontWeight: '700',
            marginBottom: '1.5rem',
            border: `1px solid ${t.color}30` }}>
            {t.badge}
          </div>
          
          {user.department && (
            <div style={{ fontSize: '0.85rem',
              color: '#6b7280', marginBottom: '0.5rem' }}>
              🏢 {user.department}
            </div>
          )}
          
          <div style={{ fontSize: '0.82rem',
            color: '#9ca3af', marginTop: '0.5rem' }}>
            Member since {new Date(
              user.createdAt || Date.now()
            ).toLocaleDateString('en-US', {
              month: 'long', year: 'numeric'
            })}
          </div>

          {/* Info card */}
          <div style={{ background: t.light,
            borderRadius: '10px', padding: '1rem',
            marginTop: '1.5rem', fontSize: '0.82rem',
            color: t.color, textAlign: 'left',
            border: `1px solid ${t.color}20` }}>
            <strong>
              {role === 'admin' ? '🛡 System Admin' :
               role === 'staff' ? '💼 Staff Access' :
               '🎓 Student Account'}
            </strong>
            <p style={{ marginTop: '0.5rem', 
              lineHeight: '1.5', color: '#6b7280' }}>
              {role === 'admin' ? 
                'Full access to all system features.' :
               role === 'staff' ? 
                'Can manage and resolve assigned complaints.' :
                'Submit and track your complaints here.'}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ background: 'white',
          borderRadius: '16px', 
          border: '1px solid #e5e7eb',
          overflow: 'hidden' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex',
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb' }}>
            {['profile', 'security', 
              role === 'admin' ? 'system' : 
              role === 'staff' ? 'preferences' : 
              'notifications'].map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ padding: '1rem 1.5rem',
                  border: 'none', cursor: 'pointer',
                  fontWeight: activeTab === tab ? 
                    '600' : '400',
                  color: activeTab === tab ? 
                    t.color : '#6b7280',
                  borderBottom: activeTab === tab ?
                    `2px solid ${t.color}` : 
                    '2px solid transparent',
                  background: 'none',
                  fontSize: '0.9rem',
                  textTransform: 'capitalize',
                  fontFamily: 'inherit' }}>
                {tab === 'profile' ? '👤 Profile' :
                 tab === 'security' ? '🔒 Security' :
                 tab === 'system' ? '⚙️ System' :
                 tab === 'preferences' ? 
                   '⚙️ Preferences' : 
                   '🔔 Notifications'}
              </button>
            ))}
          </div>

          <div style={{ padding: '2rem' }}>
            
            {/* Success / Error messages */}
            {message && (
              <div style={{ background: '#f0fdf4',
                color: '#16a34a', padding: '0.75rem 1rem',
                borderRadius: '8px', marginBottom: '1rem',
                fontSize: '0.875rem',
                border: '1px solid #bbf7d0' }}>
                ✅ {message}
              </div>
            )}
            {error && (
              <div style={{ background: '#fef2f2',
                color: '#dc2626', padding: '0.75rem 1rem',
                borderRadius: '8px', marginBottom: '1rem',
                fontSize: '0.875rem',
                border: '1px solid #fecaca' }}>
                ❌ {error}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div>
                <h3 style={{ fontWeight: '700',
                  marginBottom: '0.25rem' }}>
                  {role === 'admin' ? 
                    'Administrator Information' :
                   role === 'staff' ? 
                    'Staff Information' :
                    'Personal Information'}
                </h3>
                <p style={{ color: '#6b7280',
                  fontSize: '0.875rem',
                  marginBottom: '1.5rem' }}>
                  Update your profile details
                </p>
                
                <div style={{ display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem' }}>
                  
                  {[
                    { label: 'Full Name', 
                      key: 'name', type: 'text',
                      disabled: false },
                    { label: 'Email Address', 
                      key: 'email', type: 'email',
                      disabled: true, 
                      value: user.email },
                    { label: 'Phone Number', 
                      key: 'phone', type: 'tel',
                      disabled: false },
                    { label: 'Department', 
                      key: 'department', type: 'text',
                      disabled: false },
                    ...(role !== 'user' ? [{
                      label: role === 'admin' ? 
                        'Admin Level' : 'Office Location',
                      key: role === 'admin' ? 
                        'adminLevel' : 'officeLocation',
                      type: 'text',
                      disabled: role === 'admin',
                      value: role === 'admin' ? 
                        'Super Admin' : undefined
                    }] : [])
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ 
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        color: '#374151' }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={field.value !== undefined ?
                          field.value : 
                          form[field.key] || ''}
                        disabled={field.disabled}
                        onChange={e => !field.disabled &&
                          setForm(prev => ({ ...prev,
                            [field.key]: e.target.value
                          }))}
                        style={{ width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          background: field.disabled ? 
                            '#f9fafb' : 'white',
                          color: field.disabled ? 
                            '#9ca3af' : '#111',
                          outline: 'none',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box' }}
                      />
                    </div>
                  ))}
                </div>

                <button onClick={handleSave}
                  style={{ marginTop: '1.5rem',
                    background: t.color, color: 'white',
                    border: 'none', padding: '10px 24px',
                    borderRadius: '8px', fontWeight: '600',
                    cursor: 'pointer', fontSize: '0.9rem',
                    fontFamily: 'inherit' }}>
                  💾 Save Changes
                </button>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div>
                <h3 style={{ fontWeight: '700',
                  marginBottom: '0.25rem' }}>
                  Change Password
                </h3>
                <p style={{ color: '#6b7280',
                  fontSize: '0.875rem',
                  marginBottom: '1.5rem' }}>
                  Keep your account secure
                </p>
                
                {['currentPassword', 
                  'newPassword', 
                  'confirmPassword'].map(key => (
                  <div key={key} 
                    style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem' }}>
                      {key === 'currentPassword' ? 
                        'Current Password' :
                       key === 'newPassword' ? 
                        'New Password' :
                        'Confirm New Password'}
                    </label>
                    <input type="password"
                      value={passwords[key]}
                      onChange={e => setPasswords(
                        prev => ({ ...prev,
                          [key]: e.target.value }))}
                      style={{ width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box' }}
                    />
                  </div>
                ))}

                <button onClick={handlePassword}
                  style={{ marginTop: '0.5rem',
                    background: t.color, color: 'white',
                    border: 'none', padding: '10px 24px',
                    borderRadius: '8px', fontWeight: '600',
                    cursor: 'pointer', fontSize: '0.9rem',
                    fontFamily: 'inherit' }}>
                  🔒 Update Password
                </button>

                {role === 'admin' && (
                  <div style={{ marginTop: '2rem',
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontWeight: '600',
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem' }}>
                      Active Sessions
                    </h4>
                    <div style={{ display: 'flex',
                      alignItems: 'center', 
                      gap: '0.75rem',
                      fontSize: '0.875rem' }}>
                      <div style={{ width: '8px',
                        height: '8px', 
                        background: '#16a34a',
                        borderRadius: '50%' }}/>
                      <span>Current Session — Active Now — This Device</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PREFERENCES / NOTIFICATIONS / SYSTEM TAB */}
            {(activeTab === 'preferences' || 
              activeTab === 'notifications' ||
              activeTab === 'system') && (
              <div>
                <h3 style={{ fontWeight: '700',
                  marginBottom: '0.25rem' }}>
                  {activeTab === 'system' ? 
                    'System Preferences' :
                    'Notification Preferences'}
                </h3>
                <p style={{ color: '#6b7280',
                  fontSize: '0.875rem',
                  marginBottom: '1.5rem' }}>
                  Manage your notification settings
                </p>

                {(role === 'admin' ? [
                  'Email alert for every new complaint',
                  'Daily complaint summary report',
                  'Alert when complaints exceed 50',
                  'Notify when staff resolves complaint'
                ] : role === 'staff' ? [
                  'Email when complaint assigned to me',
                  'Notify for Urgent priority complaints',
                  'Daily summary of assigned complaints',
                  'Alert when student follows up'
                ] : [
                  'Email when complaint status changes',
                  'Notify when complaint is resolved',
                  'Weekly summary of my complaints',
                  'Alert for urgent responses needed'
                ]).map((label, i) => (
                  <div key={i} style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 0',
                    borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ 
                      fontSize: '0.875rem',
                      color: '#374151' }}>
                      {label}
                    </span>
                    <div style={{ width: '44px',
                      height: '24px', 
                      background: i % 2 === 0 ? 
                        t.color : '#e5e7eb',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      position: 'relative' }}>
                      <div style={{ 
                        position: 'absolute',
                        top: '2px',
                        left: i % 2 === 0 ? 
                          '22px' : '2px',
                        width: '20px', height: '20px',
                        background: 'white',
                        borderRadius: '50%',
                        transition: 'left 0.2s' }}/>
                    </div>
                  </div>
                ))}

                <button style={{ marginTop: '1.5rem',
                  background: t.color, color: 'white',
                  border: 'none', padding: '10px 24px',
                  borderRadius: '8px', fontWeight: '600',
                  cursor: 'pointer', fontSize: '0.9rem',
                  fontFamily: 'inherit' }}>
                  💾 Save Preferences
                </button>

                {/* DANGER ZONE — Admin only */}
                {role === 'admin' && (
                  <div style={{ marginTop: '2.5rem',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '1.5rem' }}>
                    <h4 style={{ color: '#dc2626',
                      fontWeight: '700',
                      marginBottom: '0.5rem' }}>
                      ⚠️ Danger Zone
                    </h4>
                    <p style={{ color: '#6b7280',
                      fontSize: '0.875rem',
                      marginBottom: '1rem' }}>
                      Permanently delete your account. 
                      This cannot be undone.
                    </p>
                    <button onClick={() => {
                      if (window.confirm(
                        'Are you sure you want to delete your account? This cannot be undone.'
                      )) {
                        api.delete('/auth/delete')
                          .then(() => {
                            localStorage.removeItem('token');
                            navigate('/login');
                          }).catch(() => 
                            setError('Failed to delete account'));
                      }
                    }} style={{ background: '#dc2626',
                      color: 'white', border: 'none',
                      padding: '8px 20px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit' }}>
                      🗑 Delete Account
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
