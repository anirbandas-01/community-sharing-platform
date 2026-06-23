import { useState, useEffect } from 'react';
import {
  Home, Users, Building2, FileText, Settings,
  ShieldCheck, Clock, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Phone, Mail, MapPin,
  Briefcase, DollarSign, Hash, User, ExternalLink,
  AlertTriangle, RefreshCw
, LifeBuoy} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';

// ── Menu (same across all admin pages, now with Verifications) ──────────────
const menuItems = [
  { icon: Home,        label: 'Dashboard',     path: '/admin/dashboard' },
  { icon: Users,       label: 'Users',          path: '/admin/users' },
  { icon: Building2,   label: 'Communities',    path: '/admin/communities' },
  { icon: ShieldCheck, label: 'Verifications',  path: '/admin/verifications' },
  { icon: LifeBuoy, label: 'Support Inbox', path: '/admin/support' },
    { icon: FileText,    label: 'Reports',        path: '/admin/reports' },
  { icon: Settings,    label: 'Settings',       path: '/admin/settings' },
];

// ── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:  { variant: 'warning', Icon: Clock,         label: 'Pending Review' },
    approved: { variant: 'success', Icon: CheckCircle,   label: 'Approved' },
    rejected: { variant: 'danger',  Icon: XCircle,       label: 'Rejected' },
  };
  const { variant, Icon, label } = map[status] ?? map.pending;
  return (
    <Badge variant={variant}>
      <span className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </span>
    </Badge>
  );
}

// ── Detail row ───────────────────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
      </div>
    </div>
  );
}

// ── Enterprise Card ──────────────────────────────────────────────────────────
function EnterpriseCard({ enterprise, onAction, acting }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes]       = useState('');

  const isPending = enterprise.status === 'pending';

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* ── Header ── */}
      <div className="p-5 flex items-start gap-4">
        {/* Company photo */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0">
          {enterprise.photo_url ? (
            <img
              src={enterprise.photo_url}
              alt={enterprise.company_name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {enterprise.company_name}
            </h3>
            <StatusBadge status={enterprise.status} />
          </div>
          <p className="text-sm text-gray-500 mb-2">{enterprise.industry_type}</p>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {enterprise.city}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              Owner: <strong className="text-gray-700">{enterprise.user?.name}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Applied {enterprise.created_at}
            </span>
          </div>
        </div>
      </div>

      {/* ── Expand / collapse toggle ── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-2.5 bg-gray-50 border-t border-gray-100 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium">
          {expanded ? 'Hide Details' : 'View Full Details'}
        </span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* ── Expanded details ── */}
      {expanded && (
        <div className="px-5 py-4 border-t border-gray-100 grid md:grid-cols-2 gap-x-8 gap-y-1">
          {/* Left column */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Business Info
            </p>
            <DetailRow icon={Hash}        label="Registration Number"  value={enterprise.registration_number} />
            <DetailRow icon={Briefcase}   label="Industry"             value={enterprise.industry_type} />
            <DetailRow icon={DollarSign}  label="Annual Revenue"       value={enterprise.annual_revenue} />
            <DetailRow icon={Building2}   label="Description"          value={enterprise.description} />
          </div>

          {/* Right column */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Contact Details
            </p>
            <DetailRow icon={User}    label="Contact Person"  value={`${enterprise.contact_person} (${enterprise.phone})`} />
            <DetailRow icon={Mail}    label="Business Email"  value={enterprise.email} />
            <DetailRow icon={Phone}   label="Phone"           value={enterprise.phone} />
            <DetailRow icon={MapPin}  label="City"            value={enterprise.city} />

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 mt-4">
              Account Owner
            </p>
            <DetailRow icon={User}  label="Name"   value={enterprise.user?.name} />
            <DetailRow icon={Mail}  label="Email"  value={enterprise.user?.email} />
          </div>

          {/* Business photo (full width) */}
          {enterprise.photo_url && (
            <div className="md:col-span-2 mt-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Business Photo
              </p>
              <img
                src={enterprise.photo_url}
                alt="Business"
                className="w-full max-h-64 object-cover rounded-xl border border-gray-200"
              />
            </div>
          )}
        </div>
      )}

      {/* ── Action panel (only for pending) ── */}
      {isPending && (
        <div className="px-5 py-4 bg-amber-50 border-t border-amber-100">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Admin Notes (optional — sent to applicant)
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a reason for rejection, or leave blank for approval..."
            rows={2}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white resize-none focus:ring-2 focus:ring-amber-400 focus:border-transparent mb-3"
          />
          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex-1 bg-green-600 hover:bg-green-700 focus:ring-green-500"
              onClick={() => onAction(enterprise.id, 'approved', notes)}
              loading={acting === `${enterprise.id}-approved`}
              disabled={!!acting}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Business
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => onAction(enterprise.id, 'rejected', notes)}
              loading={acting === `${enterprise.id}-rejected`}
              disabled={!!acting}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>
      )}

      {/* Already actioned — read-only footer */}
      {!isPending && (
        <div className={`px-5 py-3 border-t text-sm font-medium flex items-center gap-2
          ${enterprise.status === 'approved'
            ? 'bg-green-50 border-green-100 text-green-700'
            : 'bg-red-50 border-red-100 text-red-700'
          }`}>
          {enterprise.status === 'approved'
            ? <><CheckCircle className="w-4 h-4" /> This business has been approved and is live.</>
            : <><XCircle className="w-4 h-4" /> This business was rejected. Owner may re-apply.</>
          }
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main page
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminVerifications() {
  const [all, setAll]         = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing]   = useState(null); // `${id}-${status}` while mutating
  const [tab, setTab]         = useState('pending'); // pending | approved | rejected | all
  const [toast, setToast]     = useState(null);

  useEffect(() => { fetchVerifications(); }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      // Fetch pending from the dedicated endpoint
      const res = await api.get('/admin/verifications');
      setAll(res.data.verifications ?? []);
    } catch (err) {
      console.error('Error fetching verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status, notes) => {
    const key = `${id}-${status}`;
    try {
      setActing(key);
      await api.put(`/admin/verifications/${id}`, { status, notes });

      // Optimistically update local state
      setAll((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );

      setToast({
        type: status === 'approved' ? 'success' : 'danger',
        message: status === 'approved'
          ? 'Business approved successfully. Owner now has full access.'
          : 'Business rejected. Owner can re-apply with corrected details.',
      });

      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      setToast({ type: 'danger', message: err.response?.data?.message || 'Action failed. Please try again.' });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setActing(null);
    }
  };

  // ── Derived counts ──────────────────────────────────────────────────────────
  const counts = {
    pending:  all.filter((e) => e.status === 'pending').length,
    approved: all.filter((e) => e.status === 'approved').length,
    rejected: all.filter((e) => e.status === 'rejected').length,
    all:      all.length,
  };

  const displayed = tab === 'all' ? all : all.filter((e) => e.status === tab);

  const TABS = [
    { id: 'pending',  label: 'Pending',  color: 'text-amber-600  bg-amber-100' },
    { id: 'approved', label: 'Approved', color: 'text-green-600  bg-green-100' },
    { id: 'rejected', label: 'Rejected', color: 'text-red-600    bg-red-100' },
    { id: 'all',      label: 'All',      color: 'text-gray-600   bg-gray-100' },
  ];

  return (
    <DashboardLayout menuItems={menuItems} userType="admin">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium
          ${toast.type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
          }`}>
          {toast.type === 'success'
            ? <CheckCircle className="w-4 h-4" />
            : <XCircle className="w-4 h-4" />
          }
          {toast.message}
        </div>
      )}

      {/* ── Page header ── */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Business Verifications</h1>
          <p className="text-gray-500">
            Review enterprise applications before granting full business access.
          </p>
        </div>
        <Button variant="outline" onClick={fetchVerifications} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending Review', value: counts.pending,  bg: 'bg-amber-50',  icon: Clock,        text: 'text-amber-600',  border: 'border-amber-200' },
          { label: 'Approved',       value: counts.approved, bg: 'bg-green-50',  icon: CheckCircle,  text: 'text-green-600',  border: 'border-green-200' },
          { label: 'Rejected',       value: counts.rejected, bg: 'bg-red-50',    icon: XCircle,      text: 'text-red-600',    border: 'border-red-200' },
          { label: 'Total',          value: counts.all,      bg: 'bg-indigo-50', icon: Building2,    text: 'text-indigo-600', border: 'border-indigo-200' },
        ].map(({ label, value, bg, icon: Icon, text, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-4 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${text}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pending alert banner ── */}
      {counts.pending > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>{counts.pending} business application{counts.pending > 1 ? 's' : ''}</strong> awaiting
            your review. Approved businesses get immediate access to inventory, orders, and sales.
          </p>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors
              ${tab === id
                ? color
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {label}
            <span className="ml-1.5 text-xs opacity-70">({counts[id]})</span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading applications...</p>
          </div>
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-2xl">
          <ShieldCheck className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {tab === 'pending' ? 'No Pending Applications' : `No ${tab} Applications`}
          </h3>
          <p className="text-sm text-gray-400">
            {tab === 'pending'
              ? 'All caught up! New business applications will appear here.'
              : `Switch to a different tab to see other applications.`}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {displayed.map((enterprise) => (
            <EnterpriseCard
              key={enterprise.id}
              enterprise={enterprise}
              onAction={handleAction}
              acting={acting}
            />
          ))}
        </div>
      )}

    </DashboardLayout>
  );
}