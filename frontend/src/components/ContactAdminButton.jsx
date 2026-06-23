import { LifeBuoy } from 'lucide-react';
import { openContactAdmin } from './ContactAdminModal';

/**
 * Small floating button, always available (logged in or not), letting
 * anyone reach the admin support team directly. Lives on the opposite
 * corner from the AI ChatBot so the two never overlap.
 */
export default function ContactAdminButton() {
  return (
    <button
      onClick={() => openContactAdmin({})}
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 rounded-full pl-3 pr-4 py-2.5 shadow-lg hover:shadow-xl hover:border-primary-300 hover:text-primary-700 transition-all duration-200"
      title="Contact Admin Support"
    >
      <LifeBuoy className="w-4 h-4" />
      <span className="text-sm font-medium hidden sm:inline">Contact Admin</span>
    </button>
  );
}
