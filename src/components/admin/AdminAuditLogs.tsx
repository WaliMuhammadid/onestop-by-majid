import React from 'react';
import { useStore } from '../../store/useStore';
import { ShieldCheck, Terminal, Filter } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">Cryptographic Security Audit Log</h2>
          <p className="text-xs text-stone-500">
            Immutable administrative event trace stored in public.audit_logs for ISO/SOC2 compliance.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[11px] font-mono text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span>{auditLogs.length} Events Captured</span>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-x-auto bg-white dark:bg-stone-900 shadow-sm">
        <table className="w-full text-left text-xs font-mono min-w-[650px]">
          <thead className="bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            <tr>
              <th className="py-3 px-4">Timestamp (UTC)</th>
              <th className="py-3 px-4">Admin Principal</th>
              <th className="py-3 px-4">Action Type</th>
              <th className="py-3 px-4">Entity</th>
              <th className="py-3 px-4">Event Details</th>
              <th className="py-3 px-4 text-right">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-[11px]">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                <td className="py-2.5 px-4 text-stone-400 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleTimeString()} &bull;{' '}
                  {new Date(log.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2.5 px-4 font-semibold text-stone-800 dark:text-stone-200">{log.adminEmail}</td>
                <td className="py-2.5 px-4">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                      log.action.includes('LOCKOUT')
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : log.action.includes('LOGIN')
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="py-2.5 px-4 uppercase text-stone-500 text-[10px]">{log.entityType}</td>
                <td className="py-2.5 px-4 text-stone-700 dark:text-stone-300 max-w-xs truncate">{log.details}</td>
                <td className="py-2.5 px-4 text-right text-stone-400 font-mono text-[10px]">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
