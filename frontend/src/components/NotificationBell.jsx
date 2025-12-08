import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/unread-count`, {
        withCredentials: true,
      });
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        withCredentials: true,
      });
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/notifications/mark-read/${id}`, {}, {
        withCredentials: true,
      });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(`${API_BASE_URL}/notifications/mark-all-read`, {}, {
        withCredentials: true,
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Fetch unread count on mount and periodically
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'approval': return '✅';
      case 'rejection': return '🔄';
      case 'feedback': return '💬';
      case 'grade': return '📊';
      case 'submission': return '📄';
      default: return '🔔';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const styles = {
    container: {
      position: 'relative',
      display: 'inline-block',
    },
    bellButton: {
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '10px 12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bellIcon: {
      fontSize: '1.3rem',
      color: '#fff',
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: '#fff',
      fontSize: '0.7rem',
      fontWeight: '700',
      padding: '2px 6px',
      borderRadius: '10px',
      minWidth: '18px',
      textAlign: 'center',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '10px',
      width: '360px',
      maxHeight: '450px',
      overflowY: 'auto',
      background: 'rgba(26, 26, 46, 0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
    dropdownHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    dropdownTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#fff',
    },
    markAllBtn: {
      background: 'none',
      border: 'none',
      color: '#a5b4fc',
      fontSize: '0.85rem',
      cursor: 'pointer',
      padding: '5px 10px',
      borderRadius: '6px',
      transition: 'background 0.2s',
    },
    notificationItem: {
      display: 'flex',
      gap: '12px',
      padding: '15px 20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    notificationUnread: {
      background: 'rgba(99, 102, 241, 0.1)',
    },
    notificationIcon: {
      fontSize: '1.5rem',
      flexShrink: 0,
    },
    notificationContent: {
      flex: 1,
      minWidth: 0,
    },
    notificationTitle: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#fff',
      marginBottom: '4px',
    },
    notificationMessage: {
      fontSize: '0.85rem',
      color: 'rgba(255, 255, 255, 0.6)',
      lineHeight: 1.4,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
    notificationTime: {
      fontSize: '0.75rem',
      color: 'rgba(255, 255, 255, 0.4)',
      marginTop: '6px',
    },
    unreadDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#6366f1',
      flexShrink: 0,
      marginTop: '6px',
    },
    emptyState: {
      padding: '40px 20px',
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    loadingState: {
      padding: '30px',
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.5)',
    },
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button 
        style={styles.bellButton}
        onClick={handleBellClick}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
      >
        <span style={styles.bellIcon}>🔔</span>
        {unreadCount > 0 && (
          <span style={styles.badge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <span style={styles.dropdownTitle}>Notifications</span>
            {unreadCount > 0 && (
              <button 
                style={styles.markAllBtn}
                onClick={markAllAsRead}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <div style={styles.loadingState}>Loading...</div>
          ) : notifications.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>🔔</span>
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  ...styles.notificationItem,
                  ...(notification.read ? {} : styles.notificationUnread),
                }}
                onClick={() => !notification.read && markAsRead(notification.id)}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = notification.read ? 'transparent' : 'rgba(99, 102, 241, 0.1)'}
              >
                <span style={styles.notificationIcon}>
                  {getNotificationIcon(notification.type)}
                </span>
                <div style={styles.notificationContent}>
                  <div style={styles.notificationTitle}>{notification.title}</div>
                  <div style={styles.notificationMessage}>{notification.message}</div>
                  <div style={styles.notificationTime}>{formatTime(notification.createdAt)}</div>
                </div>
                {!notification.read && <div style={styles.unreadDot}></div>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
