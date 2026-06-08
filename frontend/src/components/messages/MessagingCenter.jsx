import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Send, Search, Users, MessageCircle, Plus, Heart, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

/* ─── Avatar ─────────────────────────────────────────────────────────────── */
const Avatar = memo(function Avatar({ src, name, size = 36 }) {
  const [err, setErr] = useState(false);
  const initials = (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const bg = { background: 'var(--color-background-info)', color: 'var(--color-text-info)' };
  const style = { width: size, height: size, borderRadius: '50%', flexShrink: 0 };

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
    <div style={{ ...style, ...bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size < 32 ? 11 : 13, fontWeight: 500 }}>
      {initials}
    </div>
  );
});

/* ─── ConvItem ───────────────────────────────────────────────────────────── */
const ConvItem = memo(function ConvItem({ conv, active, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: active ? 'var(--color-background-info)' : 'transparent', border: 'none', borderBottom: '0.5px solid var(--color-border-tertiary)', cursor: 'pointer', textAlign: 'left' }}>
      <div style={{ position: 'relative' }}>
        <Avatar src={conv.user.avatar} name={conv.user.name} size={38} />
        {conv.user.online && (
          <span style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: 'var(--color-background-success)', border: '2px solid var(--color-background-primary)' }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.user.name}</span>
          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', flexShrink: 0, marginLeft: 6 }}>{conv.last_message_time}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.last_message}</span>
          {conv.unread_count > 0 && (
            <span style={{ background: 'var(--color-background-danger)', color: 'var(--color-text-danger)', fontSize: 11, fontWeight: 500, borderRadius: 999, padding: '1px 6px', marginLeft: 6, flexShrink: 0 }}>
              {conv.unread_count > 99 ? '99+' : conv.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
});

/* ─── CommunityItem ──────────────────────────────────────────────────────── */
const CommunityItem = memo(function CommunityItem({ community, active, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: active ? 'var(--color-background-info)' : 'transparent', border: 'none', borderBottom: '0.5px solid var(--color-border-tertiary)', cursor: 'pointer', textAlign: 'left' }}>
      <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
        {community.image
          ? <img src={community.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <Users size={18} color="var(--color-text-secondary)" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{community.name}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 1 }}>{community.member_count} members</div>
      </div>
    </button>
  );
});

/* ─── Bubble ─────────────────────────────────────────────────────────────── */
const Bubble = memo(function Bubble({ msg, isMe, showAvatar, onLike }) {
  return (
    <div style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8, marginBottom: showAvatar ? 12 : 4 }}>
      {!isMe && (
        <div style={{ width: 28, flexShrink: 0 }}>
          {showAvatar && <Avatar src={msg.author?.avatar} name={msg.author?.name} size={28} />}
        </div>
      )}
      <div style={{ maxWidth: '68%' }}>
        {!isMe && showAvatar && (
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 3, paddingLeft: 2 }}>
            {msg.author?.name}
            {msg.author?.role && <span style={{ marginLeft: 4, opacity: 0.65 }}>· {msg.author.role}</span>}
          </div>
        )}
        <div style={{ padding: '9px 13px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isMe ? '#6366f1' : 'var(--color-background-secondary)', color: isMe ? '#fff' : 'var(--color-text-primary)', fontSize: 13, lineHeight: 1.55, border: isMe ? 'none' : '0.5px solid var(--color-border-tertiary)', wordBreak: 'break-word' }}>
          {msg.message || msg.content}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 3, textAlign: isMe ? 'right' : 'left', paddingLeft: isMe ? 0 : 2 }}>{msg.time}</div>
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
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
        ref={ref}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKey}
        placeholder={placeholder}
        rows={1}
        style={{ flex: 1, resize: 'none', border: '0.5px solid var(--color-border-secondary)', borderRadius: 12, padding: '9px 13px', fontSize: 13, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', outline: 'none', minHeight: 38, maxHeight: 120, lineHeight: 1.5, fontFamily: 'inherit' }}
      />
      <button
        onClick={onSubmit}
        disabled={!canSend}
        aria-label="Send"
        style={{ width: 38, height: 38, borderRadius: 12, background: canSend ? '#6366f1' : 'var(--color-background-secondary)', border: 'none', cursor: canSend ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
      >
        <Send size={15} color={canSend ? '#fff' : 'var(--color-text-tertiary)'} />
      </button>
    </div>
  );
});

/* ─── EmptyState helpers ─────────────────────────────────────────────────── */
function EmptyList({ icon, text, sub }) {
  return (
    <div style={{ padding: '40px 16px', textAlign: 'center' }}>
      <div style={{ marginBottom: 10, opacity: 0.4 }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)' }}>{text}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function EmptyChat({ icon, title, sub }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--color-background-secondary)' }}>
      <div style={{ opacity: 0.3 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-secondary)' }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>{sub}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MessagingCenter — universal for all user types
   ═══════════════════════════════════════════════════════════════════════════ */
export default function MessagingCenter({ menuItems, userType, DashboardLayout }) {
  const { user } = useAuth();

  const [tab, setTab] = useState('dm');
  const [search, setSearch] = useState('');

  /* ── DM state ── */
  const [conversations, setConversations] = useState([]);
  const [activeDmId, setActiveDmId] = useState(null);
  const [dmMessages, setDmMessages] = useState([]);    // authoritative list
  const [dmInput, setDmInput] = useState('');
  const [dmSending, setDmSending] = useState(false);
  const dmPollRef = useRef(null);
  // Track IDs we've already received to prevent duplicates
  const dmSeenIds = useRef(new Set());

  /* ── Community state ── */
  const [communities, setCommunities] = useState([]);
  const [activeCommunityId, setActiveCommunityId] = useState(null);
  const [communityMessages, setCommunityMessages] = useState([]);
  const [communityInput, setCommunityInput] = useState('');
  const [communitySending, setCommunitySending] = useState(false);
  const commPollRef = useRef(null);
  const commLastTime = useRef(null);
  const commSeenIds = useRef(new Set());

  /* ── New DM modal ── */
  const [showNewDm, setShowNewDm] = useState(false);
  const [newDmUsers, setNewDmUsers] = useState([]);
  const [newDmSearch, setNewDmSearch] = useState('');

  const messagesEndRef = useRef(null);
  const scrollBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  /* ── Derived active objects ── */
  const activeDm = conversations.find(c => c.id === activeDmId) ?? null;
  const activeCommunity = communities.find(c => c.id === activeCommunityId) ?? null;

  /* ─────────────────────── DM logic ───────────────────────────────────── */
  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data.conversations || []);
    } catch {}
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // Full reload of DM messages — called when switching conversation
  const loadDmMessages = useCallback(async (convId) => {
    try {
      const res = await api.get(`/messages/conversations/${convId}`);
      const msgs = res.data.messages || [];
      dmSeenIds.current = new Set(msgs.map(m => m.id));
      setDmMessages(msgs);
      scrollBottom();
    } catch {}
  }, [scrollBottom]);

  // Poll — only add NEW messages (deduplicated by id)
  const pollDmMessages = useCallback(async (convId) => {
    try {
      const res = await api.get(`/messages/conversations/${convId}`);
      const msgs = res.data.messages || [];
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
    const text = dmInput.trim();
    setDmInput('');
    setDmSending(true);
    try {
      const res = await api.post('/messages', { conversation_id: activeDmId, message: text });
      if (res.data.data) {
        const msg = res.data.data;
        // Only add if we haven't seen this id yet (prevents poll double-add)
        if (!dmSeenIds.current.has(msg.id)) {
          dmSeenIds.current.add(msg.id);
          setDmMessages(prev => [...prev, msg]);
          scrollBottom();
        }
      }
      fetchConversations();
    } catch {
      setDmInput(text);
    } finally {
      setDmSending(false);
    }
  }, [dmInput, activeDmId, dmSending, fetchConversations, scrollBottom]);

  /* ─────────────────── Community logic ────────────────────────────────── */
  const fetchCommunities = useCallback(async () => {
    try {
      const res = await api.get('/user/communities');
      setCommunities(res.data.communities || []);
    } catch {}
  }, []);

  useEffect(() => { fetchCommunities(); }, [fetchCommunities]);

  // Full load of community posts — called when switching community
  const loadCommunityPosts = useCallback(async (commId) => {
    try {
      const res = await api.get(`/communities/${commId}/posts`);
      const posts = res.data.posts || [];
      commSeenIds.current = new Set(posts.map(p => p.id));
      commLastTime.current = res.data.server_time;
      setCommunityMessages(posts);
      scrollBottom();
    } catch {}
  }, [scrollBottom]);

  // Poll — only fetch posts newer than last known time, deduplicate by id
  const pollCommunityPosts = useCallback(async (commId) => {
    try {
      const params = commLastTime.current ? { since: commLastTime.current } : {};
      const res = await api.get(`/communities/${commId}/posts`, { params });
      const posts = res.data.posts || [];
      const newPosts = posts.filter(p => !commSeenIds.current.has(p.id));
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
    try {
      const res = await api.post(`/communities/${activeCommunityId}/posts`, { content: text });
      if (res.data.post) {
        const p = res.data.post;
        if (!commSeenIds.current.has(p.id)) {
          commSeenIds.current.add(p.id);
          setCommunityMessages(prev => [...prev, p]);
          scrollBottom();
        }
      }
    } catch (err) {
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

  /* ─────────────────── New DM modal ───────────────────────────────────── */
  const searchUsers = useCallback(async (q) => {
    if (!q.trim()) { setNewDmUsers([]); return; }
    try {
      const res = await api.get('/search/professionals', { params: { search: q } });
      setNewDmUsers(res.data.professionals || []);
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => searchUsers(newDmSearch), 400);
    return () => clearTimeout(t);
  }, [newDmSearch, searchUsers]);

  const startDm = useCallback(async (recipientId) => {
    try {
      const res = await api.post('/messages/start', { recipient_id: recipientId });
      setShowNewDm(false);
      setNewDmSearch('');
      setNewDmUsers([]);
      const convRes = await api.get('/messages/conversations');
      const convs = convRes.data.conversations || [];
      setConversations(convs);
      const target = convs.find(c => c.id === res.data.conversation_id);
      if (target) { setTab('dm'); setActiveDmId(target.id); }
    } catch {}
  }, []);

  /* ─────────────────── Filtered lists ─────────────────────────────────── */
  const filteredConvs = conversations.filter(c =>
    c.user.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredComms = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ─────────────────── Switch active items ─────────────────────────────── */
  const selectDm = useCallback((id) => {
    setActiveDmId(id);
    dmSeenIds.current = new Set();
    setDmMessages([]);
  }, []);

  const selectCommunity = useCallback((id) => {
    setActiveCommunityId(id);
    commSeenIds.current = new Set();
    setCommunityMessages([]);
    commLastTime.current = null;
  }, []);

  /* ─────────────────── Render ─────────────────────────────────────────── */
  const isDm = tab === 'dm';
  const activeItem = isDm ? activeDm : activeCommunity;
  const messages = isDm ? dmMessages : communityMessages;
  const input = isDm ? dmInput : communityInput;
  const setInput = isDm ? setDmInput : setCommunityInput;
  const sending = isDm ? dmSending : communitySending;
  const onSend = isDm ? sendDm : sendCommunityPost;

  return (
    <DashboardLayout menuItems={menuItems} userType={userType}>
      {/* Page title */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>Messages</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>
          Direct messages and community group chat
        </p>
      </div>

      {/* Main container */}
      <div style={{ position: 'relative', display: 'flex', background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', height: 'calc(100vh - 220px)', minHeight: 500 }}>

        {/* ── Sidebar ── */}
        <div style={{ width: 280, flexShrink: 0, borderRight: '0.5px solid var(--color-border-tertiary)', display: 'flex', flexDirection: 'column' }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            {[
              { id: 'dm', label: 'Direct', Icon: MessageCircle },
              { id: 'community', label: 'Communities', Icon: Users },
            ].map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setTab(id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '11px 4px', background: 'none', border: 'none', borderBottom: tab === id ? '2px solid #6366f1' : '2px solid transparent', marginBottom: -1, cursor: 'pointer', fontSize: 13, fontWeight: tab === id ? 500 : 400, color: tab === id ? '#6366f1' : 'var(--color-text-secondary)' }}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Search row */}
          <div style={{ padding: '10px 12px 8px', display: 'flex', gap: 8, alignItems: 'center', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: 'var(--color-background-secondary)', borderRadius: 8, padding: '6px 10px' }}>
              <Search size={13} color="var(--color-text-tertiary)" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isDm ? 'Search…' : 'Search communities…'}
                style={{ border: 'none', background: 'none', fontSize: 13, color: 'var(--color-text-primary)', outline: 'none', width: '100%' }}
              />
            </div>
            {isDm && (
              <button onClick={() => setShowNewDm(true)} aria-label="New message" style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-background-info)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Plus size={15} color="var(--color-text-info)" />
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {isDm
              ? filteredConvs.length === 0
                ? <EmptyList icon={<MessageCircle size={28} color="var(--color-text-tertiary)" />} text="No conversations yet" sub='Tap "+" to start one' />
                : filteredConvs.map(c => <ConvItem key={c.id} conv={c} active={activeDmId === c.id} onClick={() => selectDm(c.id)} />)
              : filteredComms.length === 0
                ? <EmptyList icon={<Users size={28} color="var(--color-text-tertiary)" />} text="No communities joined" sub="Join one to chat" />
                : filteredComms.map(c => <CommunityItem key={c.id} community={c} active={activeCommunityId === c.id} onClick={() => selectCommunity(c.id)} />)
            }
          </div>
        </div>

        {/* ── Chat area ── */}
        {!activeItem ? (
          <EmptyChat
            icon={isDm ? <MessageCircle size={40} /> : <Users size={40} />}
            title={isDm ? 'Select a conversation' : 'Select a community'}
            sub={isDm ? 'Choose from the left or start a new chat' : 'Pick a community to read and post'}
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Header */}
            <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-background-primary)' }}>
              {isDm ? (
                <>
                  <div style={{ position: 'relative' }}>
                    <Avatar src={activeItem.user.avatar} name={activeItem.user.name} size={36} />
                    {activeItem.user.online && (
                      <span style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: 'var(--color-background-success)', border: '2px solid var(--color-background-primary)' }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{activeItem.user.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{activeItem.user.online ? 'Online' : 'Offline'} · {activeItem.user.role}</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {activeItem.image
                      ? <img src={activeItem.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <Users size={16} color="var(--color-text-secondary)" />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{activeItem.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{activeItem.member_count} members</div>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', background: 'var(--color-background-secondary)' }}>
              {messages.length === 0 && (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 13 }}>
                  {isDm ? 'No messages yet. Say hello!' : 'No posts yet. Be the first!'}
                </div>
              )}
              {messages.map((msg, i) => {
                const isMe = msg.sender === 'me';
                const prevMsg = messages[i - 1];
                const showAvatar = !isDm && (!prevMsg || prevMsg.author?.id !== msg.author?.id);
                return (
                  <Bubble
                    key={msg.id}
                    msg={msg}
                    isMe={isMe}
                    showAvatar={showAvatar}
                    onLike={!isDm ? () => handleLike(activeItem.id, msg.id) : null}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <MessageInput
              value={input}
              onChange={setInput}
              onSubmit={onSend}
              sending={sending}
              placeholder={isDm ? 'Type a message… (Enter to send)' : 'Write a post… (Enter to post)'}
            />
          </div>
        )}

        {/* ── New DM modal ── */}
        {showNewDm && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ width: 380, background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-lg)', border: '0.5px solid var(--color-border-tertiary)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>New message</span>
                <button onClick={() => { setShowNewDm(false); setNewDmSearch(''); setNewDmUsers([]); }} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ padding: '12px 16px' }}>
                <input
                  autoFocus
                  value={newDmSearch}
                  onChange={e => setNewDmSearch(e.target.value)}
                  placeholder="Search users by name…"
                  style={{ width: '100%', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, padding: '8px 12px', fontSize: 13, background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {newDmUsers.map(u => (
                  <button key={u.id} onClick={() => startDm(u.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'none', border: 'none', borderTop: '0.5px solid var(--color-border-tertiary)', cursor: 'pointer', textAlign: 'left' }}>
                    <Avatar src={u.image} name={u.name} size={34} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{u.profession}</div>
                    </div>
                  </button>
                ))}
                {newDmSearch && newDmUsers.length === 0 && (
                  <div style={{ padding: 16, textAlign: 'center', fontSize: 13, color: 'var(--color-text-tertiary)' }}>No results</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Reverb tip */}
      <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 10 }}>
        Polling every 3s (DM) / 5s (community). For instant delivery, install{' '}
        <a href="https://reverb.laravel.com" target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-info)' }}>Laravel Reverb</a>{' '}
        and replace polling with <code>Echo.channel()</code>.
      </p>
    </DashboardLayout>
  );
}