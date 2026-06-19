import { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  Send, Search, Users, MessageCircle, Plus, Heart,
  X, ChevronDown, ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

/* ─── helpers ───────────────────────────────────────────────────────────────── */

function timeLabel(iso) {
  if (!iso) return '';
  const d   = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diff === 1) return 'Yesterday';
  if (diff < 7)  return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

/* ─── Avatar ─────────────────────────────────────────────────────────────── */
const Avatar = memo(function Avatar({ src, name, size = 36 }) {
  const [err, setErr] = useState(false);
  const initials = (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const style    = { width: size, height: size, borderRadius: '50%', flexShrink: 0 };

  if (src && !err) {
    return (
      <img
        src={src} alt={name}
        onError={() => setErr(true)}
        style={{ ...style, objectFit: 'cover' }}
      />
    );
  }
  return (
    <div style={{
      ...style,
      background: 'var(--color-background-info)',
      color: 'var(--color-text-info)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size < 32 ? 11 : 13, fontWeight: 600,
    }}>
      {initials}
    </div>
  );
});

/* ─── ConvItem (WhatsApp-style left-panel row) ───────────────────────────── */
const ConvItem = memo(function ConvItem({ conv, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '11px 14px',
        background: active ? '#eef2ff' : 'transparent',
        border: 'none',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        cursor: 'pointer', textAlign: 'left',
        transition: 'background 0.12s',
      }}
    >
      {/* Avatar + online dot */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar src={conv.user.avatar} name={conv.user.name} size={42} />
        {conv.user.online && (
          <span style={{
            position: 'absolute', bottom: 1, right: 1,
            width: 10, height: 10, borderRadius: '50%',
            background: '#22c55e',
            border: '2px solid #fff',
          }} />
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: 13, fontWeight: 600,
            color: 'var(--color-text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {conv.user.name}
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', flexShrink: 0, marginLeft: 6 }}>
            {timeLabel(conv.last_message_at)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
          <span style={{
            fontSize: 12, color: conv.unread_count > 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            fontWeight: conv.unread_count > 0 ? 500 : 400,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {conv.last_message || 'Start a conversation'}
          </span>
          {conv.unread_count > 0 && (
            <span style={{
              background: '#6366f1', color: '#fff',
              fontSize: 11, fontWeight: 700,
              borderRadius: 999, padding: '1px 7px',
              marginLeft: 6, flexShrink: 0,
            }}>
              {conv.unread_count > 99 ? '99+' : conv.unread_count}
            </span>
          )}
        </div>
        {/* Role badge */}
        {conv.user.role && (
          <span style={{
            display: 'inline-block', fontSize: 10,
            color: '#6366f1', background: '#eef2ff',
            borderRadius: 4, padding: '1px 5px', marginTop: 2,
          }}>
            {conv.user.role}
          </span>
        )}
      </div>
    </button>
  );
});

/* ─── CommunityItem ──────────────────────────────────────────────────────── */
const CommunityItem = memo(function CommunityItem({ community, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '11px 14px',
        background: active ? '#eef2ff' : 'transparent',
        border: 'none', borderBottom: '0.5px solid var(--color-border-tertiary)',
        cursor: 'pointer', textAlign: 'left',
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: 'var(--color-background-secondary)',
        border: '0.5px solid var(--color-border-tertiary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, overflow: 'hidden',
      }}>
        {community.image
          ? <img src={community.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <Users size={18} color="var(--color-text-secondary)" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {community.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
          {community.member_count} members
        </div>
      </div>
    </button>
  );
});

/* ─── Bubble ─────────────────────────────────────────────────────────────── */
const Bubble = memo(function Bubble({ msg, isMe, showAvatar, onLike }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: isMe ? 'row-reverse' : 'row',
      alignItems: 'flex-end', gap: 8,
      marginBottom: showAvatar ? 14 : 4,
    }}>
      {!isMe && (
        <div style={{ width: 28, flexShrink: 0 }}>
          {showAvatar && <Avatar src={msg.author?.avatar} name={msg.author?.name} size={28} />}
        </div>
      )}
      <div style={{ maxWidth: '68%' }}>
        {!isMe && showAvatar && (
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 3, paddingLeft: 2 }}>
            {msg.author?.name}
            {msg.author?.role && <span style={{ marginLeft: 4, opacity: 0.6 }}>· {msg.author.role}</span>}
          </div>
        )}
        <div style={{
          padding: '9px 13px',
          borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: isMe ? '#6366f1' : 'var(--color-background-secondary)',
          color: isMe ? '#fff' : 'var(--color-text-primary)',
          fontSize: 13, lineHeight: 1.55,
          border: isMe ? 'none' : '0.5px solid var(--color-border-tertiary)',
          wordBreak: 'break-word',
          opacity: msg.pending ? 0.6 : 1,
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        }}>
          {msg.message || msg.content}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 3, textAlign: isMe ? 'right' : 'left', paddingLeft: isMe ? 0 : 2 }}>
          {msg.time}
        </div>
      </div>
      {onLike && (
        <button onClick={onLike} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, color: 'var(--color-text-tertiary)', fontSize: 11, padding: '0 4px', alignSelf: 'center' }}>
          <Heart size={13} />
          {msg.likes > 0 && <span>{msg.likes}</span>}
        </button>
      )}
    </div>
  );
});

/* ─── MessageInput ───────────────────────────────────────────────────────── */
const MessageInput = memo(function MessageInput({ value, onChange, onSubmit, sending, placeholder }) {
  const ref = useRef(null);

  const handleKey = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(); }
  }, [onSubmit]);

  const handleChange = useCallback((e) => {
    onChange(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  }, [onChange]);

  const canSend = value.trim() && !sending;

  return (
    <div style={{ padding: '10px 14px', borderTop: '0.5px solid var(--color-border-tertiary)', display: 'flex', gap: 8, alignItems: 'flex-end', background: 'var(--color-background-primary)' }}>
      <textarea
        ref={ref} value={value}
        onChange={handleChange} onKeyDown={handleKey}
        placeholder={placeholder} rows={1}
        style={{ flex: 1, resize: 'none', border: '0.5px solid var(--color-border-secondary)', borderRadius: 12, padding: '9px 13px', fontSize: 13, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', outline: 'none', minHeight: 38, maxHeight: 120, lineHeight: 1.5, fontFamily: 'inherit' }}
      />
      <button
        onClick={onSubmit} disabled={!canSend} aria-label="Send"
        style={{ width: 38, height: 38, borderRadius: 12, background: canSend ? '#6366f1' : 'var(--color-background-secondary)', border: 'none', cursor: canSend ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
      >
        <Send size={15} color={canSend ? '#fff' : 'var(--color-text-tertiary)'} />
      </button>
    </div>
  );
});

/* ─── Empty helpers ──────────────────────────────────────────────────────── */
function EmptyList({ icon, text, sub }) {
  return (
    <div style={{ padding: '40px 16px', textAlign: 'center' }}>
      <div style={{ marginBottom: 10, opacity: 0.35 }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)' }}>{text}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function EmptyChat({ icon, title, sub }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--color-background-secondary)' }}>
      <div style={{ opacity: 0.25 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-secondary)' }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{sub}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MessagingCenter — universal for ALL user types
   ═══════════════════════════════════════════════════════════════════════════ */
export default function MessagingCenter({ menuItems, userType, DashboardLayout }) {
  const { user } = useAuth();

  const [tab, setTab]     = useState('dm');
  const [search, setSearch] = useState('');

  /* mobile: show list or chat panel */
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'

  /* ── DM state ── */
  const [conversations, setConversations] = useState([]);
  const [activeDmId, setActiveDmId]       = useState(null);
  const [dmMessages, setDmMessages]       = useState([]);
  const [dmInput, setDmInput]             = useState('');
  const [dmSending, setDmSending]         = useState(false);
  const dmPollRef  = useRef(null);
  const dmSeenIds  = useRef(new Set());

  /* ── Community state ── */
  const [communities, setCommunities]       = useState([]);
  const [activeCommunityId, setActiveCommunityId] = useState(null);
  const [communityMessages, setCommunityMessages] = useState([]);
  const [communityInput, setCommunityInput] = useState('');
  const [communitySending, setCommunitySending] = useState(false);
  const commPollRef  = useRef(null);
  const commLastTime = useRef(null);
  const commSeenIds  = useRef(new Set());

  /* ── New DM modal ── */
  const [showNewDm, setShowNewDm]     = useState(false);
  const [newDmUsers, setNewDmUsers]   = useState([]);
  const [newDmSearch, setNewDmSearch] = useState('');
  const [searching, setSearching]     = useState(false);

  const messagesEndRef = useRef(null);
  const scrollBottom   = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  const activeDm        = conversations.find(c => c.id === activeDmId) ?? null;
  const activeCommunity = communities.find(c => c.id === activeCommunityId) ?? null;

  /* ─────────── DM logic ─────────────────────────────────────────────────── */
  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data.conversations || []);
    } catch {}
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const loadDmMessages = useCallback(async (convId) => {
    try {
      const res  = await api.get(`/messages/conversations/${convId}`);
      const msgs = res.data.messages || [];
      dmSeenIds.current = new Set(msgs.map(m => m.id));
      setDmMessages(msgs);
      scrollBottom();
    } catch {}
  }, [scrollBottom]);

  const pollDmMessages = useCallback(async (convId) => {
    try {
      const res     = await api.get(`/messages/conversations/${convId}`);
      const msgs    = res.data.messages || [];
      const newMsgs = msgs.filter(m => !dmSeenIds.current.has(m.id));
      if (newMsgs.length > 0) {
        newMsgs.forEach(m => dmSeenIds.current.add(m.id));
        setDmMessages(prev => [...prev, ...newMsgs]);
        scrollBottom();
      }
      fetchConversations();
    } catch {}
  }, [fetchConversations, scrollBottom]);

  useEffect(() => {
    clearInterval(dmPollRef.current);
    if (!activeDmId) return;
    loadDmMessages(activeDmId);
    dmPollRef.current = setInterval(() => pollDmMessages(activeDmId), 3000);
    return () => clearInterval(dmPollRef.current);
  }, [activeDmId, loadDmMessages, pollDmMessages]);

  const sendDm = useCallback(async () => {
    if (!dmInput.trim() || !activeDmId || dmSending) return;
    const text  = dmInput.trim();
    setDmInput('');
    setDmSending(true);

    const tempId = `temp_${Date.now()}`;
    const optimistic = {
      id: tempId, message: text, sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pending: true,
    };
    dmSeenIds.current.add(tempId);
    setDmMessages(prev => [...prev, optimistic]);
    scrollBottom();

    try {
      const res = await api.post('/messages', { conversation_id: activeDmId, message: text });
      if (res.data.data) {
        const msg = res.data.data;
        dmSeenIds.current.delete(tempId);
        dmSeenIds.current.add(msg.id);
        setDmMessages(prev => prev.map(m => m.id === tempId ? msg : m));
      }
      fetchConversations();
    } catch {
      dmSeenIds.current.delete(tempId);
      setDmMessages(prev => prev.filter(m => m.id !== tempId));
      setDmInput(text);
    } finally {
      setDmSending(false);
    }
  }, [dmInput, activeDmId, dmSending, fetchConversations, scrollBottom]);

  /* ─────────── Community logic ──────────────────────────────────────────── */
  const fetchCommunities = useCallback(async () => {
    try {
      const res = await api.get('/user/communities');
      setCommunities(res.data.communities || []);
    } catch {}
  }, []);

  useEffect(() => { fetchCommunities(); }, [fetchCommunities]);

  const loadCommunityPosts = useCallback(async (commId) => {
    try {
      const res   = await api.get(`/communities/${commId}/posts`);
      const posts = res.data.posts || [];
      commSeenIds.current  = new Set(posts.map(p => p.id));
      commLastTime.current = res.data.server_time;
      setCommunityMessages(posts);
      scrollBottom();
    } catch {}
  }, [scrollBottom]);

  const pollCommunityPosts = useCallback(async (commId) => {
    try {
      const params    = commLastTime.current ? { since: commLastTime.current } : {};
      const res       = await api.get(`/communities/${commId}/posts`, { params });
      const posts     = res.data.posts || [];
      const newPosts  = posts.filter(p => !commSeenIds.current.has(p.id));
      if (newPosts.length > 0) {
        newPosts.forEach(p => commSeenIds.current.add(p.id));
        setCommunityMessages(prev => [...prev, ...newPosts]);
        scrollBottom();
      }
      if (res.data.server_time) commLastTime.current = res.data.server_time;
    } catch {}
  }, [scrollBottom]);

  useEffect(() => {
    clearInterval(commPollRef.current);
    if (!activeCommunityId) return;
    loadCommunityPosts(activeCommunityId);
    commPollRef.current = setInterval(() => pollCommunityPosts(activeCommunityId), 5000);
    return () => clearInterval(commPollRef.current);
  }, [activeCommunityId, loadCommunityPosts, pollCommunityPosts]);

  const sendCommunityPost = useCallback(async () => {
    if (!communityInput.trim() || !activeCommunityId || communitySending) return;
    const text = communityInput.trim();
    setCommunityInput('');
    setCommunitySending(true);

    const tempId = `temp_${Date.now()}`;
    const optimistic = {
      id: tempId, content: text, sender: 'me', time: 'just now',
      likes: 0, pending: true,
      author: { id: null, name: 'You', avatar: null, role: '' },
    };
    commSeenIds.current.add(tempId);
    setCommunityMessages(prev => [...prev, optimistic]);
    scrollBottom();

    try {
      const res = await api.post(`/communities/${activeCommunityId}/posts`, { content: text });
      if (res.data.post) {
        const p = res.data.post;
        commSeenIds.current.delete(tempId);
        commSeenIds.current.add(p.id);
        setCommunityMessages(prev => prev.map(m => m.id === tempId ? p : m));
      }
    } catch (err) {
      commSeenIds.current.delete(tempId);
      setCommunityMessages(prev => prev.filter(m => m.id !== tempId));
      setCommunityInput(text);
      if (err.response?.status === 403) alert('Join this community to post.');
    } finally {
      setCommunitySending(false);
    }
  }, [communityInput, activeCommunityId, communitySending, scrollBottom]);

  const handleLike = useCallback(async (commId, postId) => {
    try {
      const res = await api.post(`/communities/${commId}/posts/${postId}/like`);
      setCommunityMessages(prev => prev.map(m => m.id === postId ? { ...m, likes: res.data.likes } : m));
    } catch {}
  }, []);

  /* ─────────── New DM search ────────────────────────────────────────────── */
  // FIX: searches ALL users (resident + professional + business)
  const searchAllUsers = useCallback(async (q) => {
    if (!q.trim()) { setNewDmUsers([]); return; }
    try {
      setSearching(true);
      const res = await api.get('/search/users', { params: { q } });
      setNewDmUsers(res.data.users || []);
    } catch {
      setNewDmUsers([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => searchAllUsers(newDmSearch), 400);
    return () => clearTimeout(t);
  }, [newDmSearch, searchAllUsers]);

  const startDm = useCallback(async (recipientId) => {
    try {
      const res = await api.post('/messages/start', { recipient_id: recipientId });
      setShowNewDm(false);
      setNewDmSearch('');
      setNewDmUsers([]);
      const convRes = await api.get('/messages/conversations');
      const convs   = convRes.data.conversations || [];
      setConversations(convs);
      const target  = convs.find(c => c.id === res.data.conversation_id);
      if (target) { setTab('dm'); selectDm(target.id); }
    } catch {}
  }, []);

  /* ─────────── Filtered lists ───────────────────────────────────────────── */
  const filteredConvs  = conversations.filter(c =>
    c.user.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredComms  = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectDm = useCallback((id) => {
    setActiveDmId(id);
    dmSeenIds.current = new Set();
    setDmMessages([]);
    setMobileView('chat');
  }, []);

  const selectCommunity = useCallback((id) => {
    setActiveCommunityId(id);
    commSeenIds.current  = new Set();
    setCommunityMessages([]);
    commLastTime.current = null;
    setMobileView('chat');
  }, []);

  const handleBack = () => {
    setMobileView('list');
    setActiveDmId(null);
    setActiveCommunityId(null);
  };

  /* ─────────── Render ───────────────────────────────────────────────────── */
  const isDm        = tab === 'dm';
  const activeItem  = isDm ? activeDm : activeCommunity;
  const messages    = isDm ? dmMessages : communityMessages;
  const input       = isDm ? dmInput : communityInput;
  const setInput    = isDm ? setDmInput : setCommunityInput;
  const sending     = isDm ? dmSending : communitySending;
  const onSend      = isDm ? sendDm : sendCommunityPost;

  /* total unread count for header badge */
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  return (
    <DashboardLayout menuItems={menuItems} userType={userType}>
      {/* Page title */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
            Messages
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
            Direct messages &amp; community group chat
          </p>
        </div>
        {totalUnread > 0 && (
          <span style={{ background: '#6366f1', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 999, padding: '2px 9px' }}>
            {totalUnread} unread
          </span>
        )}
      </div>

      {/* Main container */}
      <div style={{
        position: 'relative', display: 'flex',
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-lg)',
        overflow: 'hidden',
        height: 'calc(100vh - 220px)', minHeight: 520,
      }}>

        {/* ── Left sidebar ── */}
        <div style={{
          width: 300, flexShrink: 0,
          borderRight: '0.5px solid var(--color-border-tertiary)',
          display: 'flex', flexDirection: 'column',
          // On mobile: hide sidebar when viewing chat
          ...(typeof window !== 'undefined' && window.innerWidth < 768 && mobileView === 'chat'
            ? { display: 'none' } : {}),
        }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            {[
              { id: 'dm',        label: 'Messages',    Icon: MessageCircle },
              { id: 'community', label: 'Communities', Icon: Users },
            ].map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setTab(id)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '11px 4px', background: 'none', border: 'none',
                borderBottom: tab === id ? '2px solid #6366f1' : '2px solid transparent',
                marginBottom: -1, cursor: 'pointer',
                fontSize: 12, fontWeight: tab === id ? 600 : 400,
                color: tab === id ? '#6366f1' : 'var(--color-text-secondary)',
              }}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>

          {/* Search + New Message button */}
          <div style={{ padding: '10px 12px 8px', display: 'flex', gap: 8, alignItems: 'center', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: 'var(--color-background-secondary)', borderRadius: 8, padding: '6px 10px' }}>
              <Search size={13} color="var(--color-text-tertiary)" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isDm ? 'Search conversations…' : 'Search communities…'}
                style={{ border: 'none', background: 'none', fontSize: 13, color: 'var(--color-text-primary)', outline: 'none', width: '100%' }}
              />
            </div>
            {isDm && (
              <button
                onClick={() => setShowNewDm(true)} aria-label="New message"
                style={{ width: 32, height: 32, borderRadius: 8, background: '#eef2ff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <Plus size={15} color="#6366f1" />
              </button>
            )}
          </div>

          {/* Conversation / Community list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {isDm ? (
              filteredConvs.length === 0 ? (
                <EmptyList
                  icon={<MessageCircle size={30} color="var(--color-text-tertiary)" />}
                  text="No conversations yet"
                  sub='Tap "+" to start one'
                />
              ) : (
                filteredConvs.map(c => (
                  <ConvItem key={c.id} conv={c} active={activeDmId === c.id} onClick={() => selectDm(c.id)} />
                ))
              )
            ) : (
              filteredComms.length === 0 ? (
                <EmptyList
                  icon={<Users size={30} color="var(--color-text-tertiary)" />}
                  text="No communities joined"
                  sub="Join one to chat"
                />
              ) : (
                filteredComms.map(c => (
                  <CommunityItem key={c.id} community={c} active={activeCommunityId === c.id} onClick={() => selectCommunity(c.id)} />
                ))
              )
            )}
          </div>
        </div>

        {/* ── Chat area ── */}
        {!activeItem ? (
          <EmptyChat
            icon={isDm ? <MessageCircle size={48} /> : <Users size={48} />}
            title={isDm ? 'Select a conversation' : 'Select a community'}
            sub={isDm ? 'Pick someone from the left or start a new chat ↖' : 'Pick a community to read and post'}
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Chat header */}
            <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-background-primary)' }}>
              {/* Mobile back button */}
              <button
                onClick={handleBack}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4, marginRight: 2 }}
              >
                <ArrowLeft size={18} color="var(--color-text-secondary)" />
              </button>

              {isDm ? (
                <>
                  <div style={{ position: 'relative' }}>
                    <Avatar src={activeItem.user.avatar} name={activeItem.user.name} size={38} />
                    {activeItem.user.online && (
                      <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: '2px solid #fff' }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {activeItem.user.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      {activeItem.user.role}
                      {activeItem.user.online ? ' · Online' : ''}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {activeItem.image
                      ? <img src={activeItem.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <Users size={16} color="var(--color-text-secondary)" />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{activeItem.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{activeItem.member_count} members</div>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', background: 'var(--color-background-secondary)' }}>
              {messages.length === 0 && (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 13 }}>
                  {isDm ? 'No messages yet. Say hello! 👋' : 'No posts yet. Be the first!'}
                </div>
              )}
              {messages.map((msg, i) => {
                const isMe      = msg.sender === 'me';
                const prevMsg   = messages[i - 1];
                const showAvatar = !isDm && (!prevMsg || prevMsg.author?.id !== msg.author?.id);
                return (
                  <Bubble
                    key={msg.id} msg={msg} isMe={isMe} showAvatar={showAvatar}
                    onLike={!isDm ? () => handleLike(activeItem.id, msg.id) : null}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <MessageInput
              value={input} onChange={setInput}
              onSubmit={onSend} sending={sending}
              placeholder={isDm ? 'Type a message… (Enter to send)' : 'Write a post… (Enter to post)'}
            />
          </div>
        )}

        {/* ── New DM modal — search ALL user types ── */}
        {showNewDm && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ width: 400, background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-lg)', border: '0.5px solid var(--color-border-tertiary)', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              {/* Modal header */}
              <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  New Message
                </span>
                <button onClick={() => { setShowNewDm(false); setNewDmSearch(''); setNewDmUsers([]); }} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Search input */}
              <div style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-background-secondary)', borderRadius: 8, padding: '8px 12px' }}>
                  <Search size={14} color="var(--color-text-tertiary)" />
                  <input
                    autoFocus
                    value={newDmSearch}
                    onChange={e => setNewDmSearch(e.target.value)}
                    placeholder="Search residents, professionals, businesses…"
                    style={{ border: 'none', background: 'none', fontSize: 13, color: 'var(--color-text-primary)', outline: 'none', width: '100%' }}
                  />
                </div>
                {searching && (
                  <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 8 }}>Searching…</p>
                )}
              </div>

              {/* Results */}
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {newDmUsers.length > 0 ? (
                  newDmUsers.map(u => (
                    <button key={u.id} onClick={() => startDm(u.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', borderTop: '0.5px solid var(--color-border-tertiary)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background-secondary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <Avatar src={u.image} name={u.name} size={36} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                          {u.profession}
                          {u.city && <span style={{ color: 'var(--color-text-tertiary)' }}> · {u.city}</span>}
                        </div>
                      </div>
                      {/* Role pill */}
                      <span style={{ marginLeft: 'auto', fontSize: 10, background: '#eef2ff', color: '#6366f1', borderRadius: 4, padding: '2px 6px', fontWeight: 500 }}>
                        {u.role}
                      </span>
                    </button>
                  ))
                ) : newDmSearch && !searching ? (
                  <div style={{ padding: 20, textAlign: 'center', fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                    No users found for "{newDmSearch}"
                  </div>
                ) : !newDmSearch ? (
                  <div style={{ padding: 20, textAlign: 'center', fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                    Type a name to search residents, professionals, or businesses
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}