import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export default function ManageUsers() {
  const navigate = useNavigate();
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    status: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated || userRole !== 'admin') {
      navigate('/admin-login');
      return;
    }

    fetchFacultyData();
  }, [navigate]);

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/faculty/allfaculty`, {
        withCredentials: true
      });
      setFacultyList(response.data || []);
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      setMessage({ text: 'Failed to load faculty data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage({ text: '', type: '' });

    if (form.password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters.', type: 'error' });
      setFormLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/faculty/register`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
          address: form.address,
          status: form.status,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      setMessage({ text: `Faculty added successfully! ID: ${response.data.id}`, type: 'success' });
      setForm({ name: '', email: '', password: '', address: '', status: '' });
      setShowAddForm(false);
      fetchFacultyData(); // Refresh the list
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to add faculty. Please try again.', 
        type: 'error' 
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Calculate stats for graphs
  const getStats = () => {
    const supervisors = facultyList.filter(f => f.status === 'Supervisor').length;
    const evalCommittee = facultyList.filter(f => f.status === 'Evaluation Committee Member').length;
    const fypCommittee = facultyList.filter(f => f.status === 'FYP Committee Member').length;
    return { supervisors, evalCommittee, fypCommittee, total: facultyList.length };
  };

  const stats = getStats();

  // Filter faculty
  const filteredFaculty = facultyList.filter(faculty => {
    const name = faculty.name?.toLowerCase() || '';
    const email = faculty.email?.toLowerCase() || '';
    const status = faculty.status?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search) || status.includes(search);
  });

  const getRoleColor = (status) => {
    const colors = {
      'Supervisor': { bg: 'rgba(99, 102, 241, 0.2)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.4)' },
      'Evaluation Committee Member': { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.4)' },
      'FYP Committee Member': { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' },
    };
    return colors[status] || { bg: 'rgba(107, 114, 128, 0.2)', text: '#9ca3af', border: 'rgba(107, 114, 128, 0.4)' };
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading faculty data...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={styles.bgOrb1}></div>
      <div style={styles.bgOrb2}></div>
      <div style={styles.bgOrb3}></div>

      <div style={styles.content}>
        {/* Back Button */}
        <button
          style={styles.backBtn}
          onClick={() => navigate('/Dashboard5')}
          className="back-btn"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>👥</div>
          <h1 style={styles.title}>Manage Users</h1>
          <p style={styles.subtitle}>View and manage faculty members in the system</p>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIconBox, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
              👨‍🏫
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{stats.total}</span>
              <span style={styles.statLabel}>Total Faculty</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIconBox, background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}>
              🎓
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{stats.supervisors}</span>
              <span style={styles.statLabel}>Supervisors</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIconBox, background: 'linear-gradient(135deg, #22c55e, #16a34a)'}}>
              📋
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{stats.evalCommittee}</span>
              <span style={styles.statLabel}>Evaluation Committee</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIconBox, background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
              ⚙️
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{stats.fypCommittee}</span>
              <span style={styles.statLabel}>FYP Committee</span>
            </div>
          </div>
        </div>

        {/* Graphs Section */}
        <div style={styles.graphsSection}>
          <div style={styles.graphsGrid}>
            {/* Role Distribution Bar Chart */}
            <div style={styles.graphCard}>
              <h3 style={styles.graphCardTitle}>📊 Faculty Role Distribution</h3>
              <div style={styles.barChart}>
                {[
                  { label: 'Supervisors', value: stats.supervisors, color: '#6366f1' },
                  { label: 'Evaluation Committee', value: stats.evalCommittee, color: '#22c55e' },
                  { label: 'FYP Committee', value: stats.fypCommittee, color: '#f59e0b' },
                ].map((item, index) => {
                  const maxValue = Math.max(stats.supervisors, stats.evalCommittee, stats.fypCommittee, 1);
                  return (
                    <div key={index} style={styles.barItem}>
                      <div style={styles.barLabel}>{item.label}</div>
                      <div style={styles.barContainer}>
                        <div 
                          style={{
                            ...styles.bar,
                            width: `${(item.value / maxValue) * 100}%`,
                            background: item.color,
                          }}
                        ></div>
                      </div>
                      <div style={styles.barValue}>{item.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pie Chart */}
            <div style={styles.graphCard}>
              <h3 style={styles.graphCardTitle}>🥧 Role Breakdown</h3>
              <div style={styles.pieChartContainer}>
                <div style={styles.pieChart}>
                  <svg viewBox="0 0 100 100" style={styles.pieSvg}>
                    {(() => {
                      const total = stats.total || 1;
                      const data = [
                        { value: stats.supervisors, color: '#6366f1' },
                        { value: stats.evalCommittee, color: '#22c55e' },
                        { value: stats.fypCommittee, color: '#f59e0b' },
                      ];
                      
                      let currentAngle = 0;
                      const circumference = 2 * Math.PI * 40;
                      
                      return data.map((item, index) => {
                        const percentage = (item.value / total) * 100;
                        const dash = (percentage / 100) * circumference;
                        const offset = -currentAngle;
                        currentAngle += dash;
                        
                        return (
                          <circle
                            key={index}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="20"
                            strokeDasharray={`${dash} ${circumference}`}
                            strokeDashoffset={offset}
                            transform="rotate(-90 50 50)"
                          />
                        );
                      });
                    })()}
                  </svg>
                  <div style={styles.pieCenter}>
                    <span style={styles.pieCenterValue}>{stats.total}</span>
                    <span style={styles.pieCenterLabel}>Total</span>
                  </div>
                </div>
                <div style={styles.pieLegend}>
                  <div style={styles.legendItem}>
                    <span style={{...styles.legendDot, background: '#6366f1'}}></span>
                    <span>Supervisors ({stats.supervisors})</span>
                  </div>
                  <div style={styles.legendItem}>
                    <span style={{...styles.legendDot, background: '#22c55e'}}></span>
                    <span>Eval Committee ({stats.evalCommittee})</span>
                  </div>
                  <div style={styles.legendItem}>
                    <span style={{...styles.legendDot, background: '#f59e0b'}}></span>
                    <span>FYP Committee ({stats.fypCommittee})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div style={{
            ...styles.messageBox,
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            borderColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            color: message.type === 'success' ? '#4ade80' : '#f87171',
          }}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* Controls */}
        <div style={styles.controlsSection}>
          <div style={styles.searchBox}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="rgba(255,255,255,0.5)" style={{marginRight: '10px'}}>
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={styles.addBtn}
          >
            {showAddForm ? '✕ Cancel' : '+ Add Faculty'}
          </button>
        </div>

        {/* Add Faculty Form */}
        {showAddForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Add New Faculty Member</h3>
            <form onSubmit={handleAddFaculty} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.formField}>
                  <label style={styles.formLabel}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    style={styles.formInput}
                    required
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    style={styles.formInput}
                    required
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.formLabel}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    style={styles.formInput}
                    required
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.formLabel}>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.formLabel}>Role</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    style={styles.formSelect}
                    required
                  >
                    <option value="" style={styles.selectOption}>Select role</option>
                    <option value="Supervisor" style={styles.selectOption}>Supervisor</option>
                    <option value="Evaluation Committee Member" style={styles.selectOption}>Evaluation Committee Member</option>
                    <option value="FYP Committee Member" style={styles.selectOption}>FYP Committee Member</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={formLoading} style={styles.submitBtn}>
                {formLoading ? 'Adding...' : 'Add Faculty'}
              </button>
            </form>
          </div>
        )}

        {/* Faculty Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.emptyCell}>
                    {facultyList.length === 0 ? 'No faculty members found' : 'No matching faculty'}
                  </td>
                </tr>
              ) : (
                filteredFaculty.map((faculty, index) => {
                  const roleColors = getRoleColor(faculty.status);
                  return (
                    <tr key={faculty.faculty_id || index} style={styles.tr}>
                      <td style={styles.td}>
                        <span style={styles.idBadge}>FAC-{faculty.faculty_id}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.facultyName}>{faculty.name || 'N/A'}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.emailText}>{faculty.email || 'N/A'}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.roleBadge,
                          background: roleColors.bg,
                          color: roleColors.text,
                          border: `1px solid ${roleColors.border}`,
                        }}>
                          {faculty.status || 'N/A'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.addressText}>{faculty.address || 'N/A'}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: translateX(-5px);
        }
        tr:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
    padding: '30px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  bgOrb1: {
    position: 'absolute',
    top: '-150px',
    right: '-100px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
    animation: 'float 6s ease-in-out infinite',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: '-150px',
    left: '-100px',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1), transparent 70%)',
    animation: 'float 8s ease-in-out infinite reverse',
  },
  bgOrb3: {
    position: 'absolute',
    top: '40%',
    left: '60%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08), transparent 70%)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '30px',
    transition: 'all 0.3s ease',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  headerIcon: {
    fontSize: '3.5rem',
    marginBottom: '15px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6366f1 0%, #22c55e 50%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '1.1rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIconBox: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  graphsSection: {
    marginBottom: '30px',
  },
  graphsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
  },
  graphCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  graphCardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '20px',
  },
  barChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  barItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  barLabel: {
    width: '140px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.9rem',
  },
  barContainer: {
    flex: 1,
    height: '28px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: '14px',
    transition: 'width 0.5s ease',
    minWidth: '8px',
  },
  barValue: {
    width: '40px',
    textAlign: 'right',
    color: '#fff',
    fontWeight: '600',
    fontSize: '1rem',
  },
  pieChartContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  pieChart: {
    position: 'relative',
    width: '160px',
    height: '160px',
  },
  pieSvg: {
    width: '100%',
    height: '100%',
  },
  pieCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  pieCenterValue: {
    display: 'block',
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#fff',
  },
  pieCenterLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  pieLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.9rem',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  messageBox: {
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.95rem',
  },
  controlsSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '12px 16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    flex: '1',
    maxWidth: '400px',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '0.95rem',
    width: '100%',
  },
  addBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  formCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '20px',
  },
  formTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
  },
  formInput: {
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
  },
  formSelect: {
    padding: '12px 16px',
    background: '#1a1a2e',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
  },
  selectOption: {
    background: '#1a1a2e',
    color: '#fff',
    padding: '10px',
  },
  submitBtn: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  tableContainer: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '16px 20px',
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    fontSize: '0.9rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
  },
  tr: {
    transition: 'background 0.2s ease',
  },
  td: {
    padding: '16px 20px',
    color: '#fff',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  emptyCell: {
    padding: '40px',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '1rem',
  },
  idBadge: {
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#818cf8',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  facultyName: {
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  emailText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
  },
  roleBadge: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  addressText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.85rem',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(99, 102, 241, 0.2)',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: '20px',
    fontSize: '1.1rem',
  },
};
