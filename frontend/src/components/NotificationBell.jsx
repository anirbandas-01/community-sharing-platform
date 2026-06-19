/**
 * NotificationBell.jsx
 *
 * Drop-in replacement for the dummy <Bell /> button in DashboardLayout.jsx.
 *
 * Usage inside DashboardLayout:
 *   import NotificationBell from '../NotificationBell';
 *   // replace the existing bell button with:
 *   <NotificationBell userType={userType} />
 *
 * Features
 * ─────────
 * • Polls /notifications/count every 15 s (lightweight — no full list reload)
 * • Loads full list on first open, then on every subsequent open
 * • Mark single / mark all as read
 * • Delete single / clear all
 * • Navigates to the notification's link on click
 * • Icon + accent colour per notification type
 * • Gracefully handles network errors (never crashes the layout)
 * • Animated badge, smooth panel slide-in
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, X, Check, CheckCheck, Trash2,
  ShoppingBag, MessageCircle, Calendar, Star, Users,
  UserPlus, Truck, XCircle, CheckCircle, MessageSquare,
} from 'lucide-react';
import api from '../services/api';

// ── Icon map (mirrors Notification::iconFor() on the backend) ────────────────
const ICONS = {
  ShoppingBag,
  MessageCircle,
  Calendar,
  Star,
  Users,
  UserPlus,
  Truck,
  XCircle,
  CheckCircle,
  CheckCircle2: CheckCircle, // alias
  MessageSquare,
  Bell,
};

function NotifIcon({ iconName, color, size = 16 }) {
  const Icon = ICONS[iconName] ?? Bell;
  return <Icon size={size} color={color} />;
}

// ── Relative time helper ─────────────────────────────────────────────────────
// Backend already sends diffForHumans(); we just use it directly.

// ── Single notification row ──────────────────────────────────────────────────
function NotifRow({ notif, onRead, onDelete, onNavigate }) {
  const { icon, color } = notif.icon_info ?? { icon: 'Bell', color: '#6b7280' };

  const handleClick = () => {
    if (!notif.is_read) onRead(notif.id);
    if (notif.link) onNavigate(notif.link);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display:         'flex',
        gap:             10,
        padding:         '12px 14px',
        background:      notif.is_read ? 'transparent' : 'rgba(99,102,241,0.05)',
        borderBottom:    '0.5px solid var(--color-border-tertiary, #e5e7eb)',
        cursor:          notif.link ? 'pointer' : 'default',
        transition:      'background 0.15s',
        position:        'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = notif.is_read ? 'transparent' : 'rgba(99,102,241,0.05)'; }}
    >
      {/* Icon bubble */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <NotifIcon iconName={icon} color={color} size={16} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: 13, fontWeight: notif.is_read ? 400 : 600,
          color: 'var(--color-text-primary, #111827)',
          lineHeight: 1.35,
        }}>
          {notif.title}
        </p>
        <p style={{
          margin: '2px 0 0', fontSize: 12,
          color: 'var(--color-text-secondary, #6b7280)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {notif.body}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--color-text-tertiary, #9ca3af)' }}>
          {notif.time}
        </p>
      </div>

      {/* Unread dot + delete */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
        {!notif.is_read && (
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1' }} />
        )}
        <button
          onClick={e => { e.stopPropagation(); onDelete(notif.id); }}
          title="Remove"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-tertiary, #9ca3af)', padding: 2,
            opacity: 0.6, transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = 0.6; }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NotificationBell({ userType = 'resident' }) {
  const navigate = useNavigate();

  const [open, setOpen]               = useState(false);
  const [notifications, setNotifs]    = useState([]);
  const [unread, setUnread]           = useState(0);
  const [loading, setLoading]         = useState(false);
  const [loadedOnce, setLoadedOnce]   = useState(false);

  const panelRef  = useRef(null);
  const pollRef   = useRef(null);

  // ── Poll unread count ──────────────────────────────────────────────────
  const pollCount = useCallback(async () => {
    try {
      const res = await api.get('/notifications/count');
      setUnread(res.data.unread_count ?? 0);
    } catch {
      // Silently ignore — network blip shouldn't matter
    }
  }, []);

  useEffect(() => {
    pollCount();
    pollRef.current = setInterval(pollCount, 15_000);
    return () => clearInterval(pollRef.current);
  }, [pollCount]);

  // ── Load full list ─────────────────────────────────────────────────────
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifs(res.data.notifications ?? []);
      setUnread(res.data.unread_count ?? 0);
      setLoadedOnce(true);
    } catch {
      // leave stale data
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload each time panel opens
  useEffect(() => {
    if (open) loadNotifications();
  }, [open, loadNotifications]);

  // ── Close on outside click ─────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // ── Actions ────────────────────────────────────────────────────────────
  const markRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch {}
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnread(0);
    } catch {}
  }, []);

  const deleteOne = useCallback(async (id) => {
    const wasUnread = notifications.find(n => n.id === id)?.is_read === false;
    try {
      await api.delete(`/notifications/${id}`);
      setNotifs(prev => prev.filter(n => n.id !== id));
      if (wasUnread) setUnread(prev => Math.max(0, prev - 1));
    } catch {}
  }, [notifications]);

  const clearAll = useCallback(async () => {
    try {
      await api.delete('/notifications');
      setNotifs([]);
      setUnread(0);
    } catch {}
  }, []);

  const handleNavigate = useCallback((link) => {
    setOpen(false);
    navigate(link);
  }, [navigate]);

  // ── Render ─────────────────────────────────────────────────────────────
  const hasUnread = unread > 0;

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>

      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={`Notifications${hasUnread ? ` (${unread} unread)` : ''}`}
        style={{
          position:       'relative',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          width:          40, height: 40,
          borderRadius:   10,
          border:         'none',
          background:     open ? 'rgba(99,102,241,0.1)' : 'transparent',
          cursor:         'pointer',
          transition:     'background 0.15s',
          color:          'var(--color-text-secondary, #6b7280)',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = '#f3f4f6'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent'; }}
      >
        <Bell size={20} color={open ? '#6366f1' : 'currentColor'} />

        {/* Badge */}
        {hasUnread && (
          <span style={{
            position:       'absolute',
            top:            4, right: 4,
            minWidth:       16, height: 16,
            borderRadius:   99,
            background:     '#ef4444',
            color:          '#fff',
            fontSize:       10,
            fontWeight:     700,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '0 4px',
            border:         '2px solid #fff',
            lineHeight:     1,
            animation:      'notif-pulse 2s ease-in-out infinite',
          }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position:    'absolute',
          top:         'calc(100% + 8px)',
          right:       0,
          width:       360,
          maxHeight:   480,
          background:  '#fff',
          borderRadius: 14,
          boxShadow:   '0 8px 32px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.06)',
          border:      '0.5px solid rgba(0,0,0,0.08)',
          overflow:    'hidden',
          display:     'flex',
          flexDirection: 'column',
          zIndex:      999,
          animation:   'notif-slide-in 0.18s ease-out',
        }}>

          {/* Panel header */}
          <div style={{
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'space-between',
            padding:      '12px 14px 10px',
            borderBottom: '0.5px solid #e5e7eb',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Bell size={15} color="#6366f1" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Notifications</span>
              {hasUnread && (
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: '#6366f1', color: '#fff',
                  borderRadius: 99, padding: '1px 7px',
                }}>
                  {unread}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {hasUnread && (
                <button
                  onClick={markAllRead}
                  title="Mark all as read"
                  style={actionBtnStyle}
                >
                  <CheckCheck size={14} />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  title="Clear all"
                  style={{ ...actionBtnStyle, color: '#ef4444' }}
                >
                  <Trash2 size={14} />
                </button>
              )}
              <button onClick={() => setOpen(false)} title="Close" style={actionBtnStyle}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading && !loadedOnce ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <div style={{
                  width: 24, height: 24, margin: '0 auto 10px',
                  borderRadius: '50%',
                  border: '3px solid #e5e7eb',
                  borderTopColor: '#6366f1',
                  animation: 'notif-spin 0.7s linear infinite',
                }} />
                <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Loading…</p>
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <Bell size={32} color="#d1d5db" style={{ marginBottom: 10 }} />
                <p style={{ fontSize: 14, color: '#6b7280', margin: 0, fontWeight: 500 }}>
                  You're all caught up!
                </p>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>
                  New activity will appear here
                </p>
              </div>
            ) : (
              notifications.map(n => (
                <NotifRow
                  key={n.id}
                  notif={n}
                  onRead={markRead}
                  onDelete={deleteOne}
                  onNavigate={handleNavigate}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding:       '8px 14px',
              borderTop:     '0.5px solid #e5e7eb',
              textAlign:     'center',
            }}>
              <button
                onClick={() => { setOpen(false); navigate(`/${userType}/notifications`); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: '#6366f1', fontWeight: 500,
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes notif-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes notif-slide-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes notif-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ── Shared micro-button style ─────────────────────────────────────────────────
const actionBtnStyle = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  width:          28, height: 28,
  borderRadius:   7,
  border:         'none',
  background:     'transparent',
  cursor:         'pointer',
  color:          '#6b7280',
  transition:     'background 0.12s',
};