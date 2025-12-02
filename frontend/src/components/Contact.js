import React, { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: '📧', label: 'Email', value: 'Nova@trinova.edu', color: '#6366f1' },
    { icon: '📞', label: 'Phone', value: '+92 333-1234567', color: '#06b6d4' },
    { icon: '📍', label: 'Address', value: 'University of Engineering and Technology, Lahore', color: '#10b981' },
    { icon: '🕐', label: 'Hours', value: 'Mon - Fri: 9AM - 5PM', color: '#f59e0b' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.bgOrb1}></div>
      <div style={styles.bgOrb2}></div>

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <h1 style={styles.title}>Get In Touch</h1>
          <p style={styles.subtitle}>Have questions? We'd love to hear from you. Send us a message!</p>
        </div>

        <div style={styles.mainContent}>
          {/* Contact Info Cards */}
          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>Contact Information</h3>
            <div style={styles.infoCards}>
              {contactInfo.map((info, index) => (
                <div key={index} style={styles.infoCard}>
                  <div style={{...styles.infoIcon, background: `${info.color}20`, color: info.color}}>
                    <span style={{ fontSize: '1.5rem' }}>{info.icon}</span>
                  </div>
                  <div style={styles.infoText}>
                    <span style={styles.infoLabel}>{info.label}</span>
                    <span style={styles.infoValue}>{info.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div style={styles.socialSection}>
              <h4 style={styles.socialTitle}>Follow Us</h4>
              <div style={styles.socialLinks}>
                {['facebook', 'twitter', 'linkedin', 'github'].map((social) => (
                  <a key={social} href="https://github.com/Rizwan-Zeeshan" style={styles.socialLink}>
                    {social === 'facebook' && <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>}
                    {social === 'twitter' && <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>}
                    {social === 'linkedin' && <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg>}
                    {social === 'github' && <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>Send a Message</h3>
            
            {submitted && (
              <div style={styles.successMsg}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                Message sent successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  style={styles.textarea}
                  rows={5}
                  required
                />
              </div>

              <button type="submit" style={styles.submitBtn}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '40px 20px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  bgOrb1: {
    position: 'absolute',
    top: '-100px',
    right: '-100px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)',
    animation: 'float 6s ease-in-out infinite',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: '-100px',
    left: '-100px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)',
    animation: 'float 8s ease-in-out infinite reverse',
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  headerIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: 'white',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.6)',
    maxWidth: '500px',
    margin: '0 auto',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '40px',
  },
  infoSection: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '24px',
    padding: '30px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'white',
    marginBottom: '24px',
  },
  infoCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '14px',
    transition: 'all 0.3s ease',
  },
  infoIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 500,
  },
  infoValue: {
    fontSize: '0.95rem',
    color: 'white',
    fontWeight: 600,
  },
  socialSection: {
    marginTop: '30px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  socialTitle: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '16px',
    fontWeight: 600,
  },
  socialLinks: {
    display: 'flex',
    gap: '12px',
  },
  socialLink: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  formSection: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '24px',
    padding: '30px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  successMsg: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 20px',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '12px',
    color: '#10b981',
    fontSize: '0.95rem',
    fontWeight: 500,
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
  },
  input: {
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  textarea: {
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: '14px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
    transition: 'all 0.3s ease',
    marginTop: '8px',
  },
};

export default Contact;
