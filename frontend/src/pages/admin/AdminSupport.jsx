import { useState, useEffect } from 'react';
import { LifeBuoy, Search, Mail, Clock, CheckCircle, Loader2, Send, Building2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, Users, Building2 as Building2Icon, FileText, Settings, ShieldCheck } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Building2Icon, label: 'Communities', path: '/admin/communities' },
  { icon: ShieldCheck, label: 'Verifications', path: '/admin/verifications' },
  { icon: LifeBuoy, label: 'Support Inbox', path: '/admin/support' },
  { icon: FileText, label: 'Reports', path: '/admin/reports' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const STATUS_STYLES = {
  open: 'warning',
  in_progress: 'primary',
  resolved: 'success',
};

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [counts, setCounts] = useState({ all: 0, open: 0, in_progress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/support', { params: { status: statusFilter } });
      setTickets(res.data.tickets || []);
      setCounts(res.data.counts || {});
    } catch (err) {
      console.error('Error loading support tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.name?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.message?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q)
    );
  });

  const openTicket = (ticket) => {
    setSelected(ticket);
    setReplyText(ticket.admin_reply || '');
  };

  const markInProgress = async (ticket) => {
    try {
      await api.put(`/admin/support/${ticket.id}`, { status: 'in_progress' });
      fetchTickets();
      setSelected((s) => (s && s.id === ticket.id ? { ...s, status: 'in_progress' } : s));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ticket');
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selected) return;
    setSendingReply(true);
    try {
      await api.post(`/admin/support/${selected.id}/reply`, { reply: replyText });
      alert('Reply sent and emailed to the user!');
      fetchTickets();
      setSelected(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} userType="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Inbox</h1>
        <p className="text-gray-600">Every "Contact Admin" message from residents, professionals, businesses — and guests</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <LifeBuoy className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{counts.all || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Open</p>
              <p className="text-2xl font-bold text-gray-900">{counts.open || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{counts.in_progress || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{counts.resolved || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input icon={Search} placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'open', label: 'Open' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'resolved', label: 'Resolved' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${statusFilter === f.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <LifeBuoy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Messages</h3>
          <p className="text-gray-600">Nobody has contacted admin support yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((t) => (
            <Card key={t.id} hover className="cursor-pointer" onClick={() => openTicket(t)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{t.subject || 'No subject'}</h3>
                    <Badge variant={STATUS_STYLES[t.status]} size="sm" className="capitalize">{t.status.replace('_', ' ')}</Badge>
                    {t.community && (
                      <Badge variant="default" size="sm" className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {t.community.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{t.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{t.name}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{t.email}</span>
                    <span>{t.created_at}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{selected.subject || 'Message'}</h2>
              <Badge variant={STATUS_STYLES[selected.status]} className="capitalize">{selected.status.replace('_', ' ')}</Badge>
            </div>

            <div className="text-sm text-gray-500 mb-4 space-y-1">
              <p><span className="font-medium text-gray-700">From:</span> {selected.name} ({selected.email})</p>
              {selected.community && <p><span className="font-medium text-gray-700">About community:</span> {selected.community.name}</p>}
              <p><span className="font-medium text-gray-700">Sent:</span> {selected.created_at}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg text-gray-800 text-sm whitespace-pre-wrap mb-4">
              {selected.message}
            </div>

            {selected.admin_reply && (
              <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg text-sm text-gray-800 whitespace-pre-wrap mb-4">
                <p className="text-xs font-semibold text-primary-700 mb-1">Your previous reply ({selected.replied_at}):</p>
                {selected.admin_reply}
              </div>
            )}

            <form onSubmit={sendReply} className="space-y-3">
              <textarea
                rows={4}
                placeholder="Write a reply — it will be emailed to the sender..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
              />
              <div className="flex gap-3">
                <Button type="submit" variant="primary" loading={sendingReply} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Send Reply &amp; Email
                </Button>
                {selected.status === 'open' && (
                  <Button type="button" variant="outline" onClick={() => markInProgress(selected)}>
                    Mark In Progress
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminSupport;
