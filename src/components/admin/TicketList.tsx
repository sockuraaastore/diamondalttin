'use client';

import { useState, useEffect } from 'react';
import { SupportTicket } from '@/types';
import { getAllTickets, replyToTicket } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';
import { MessageSquare, Check } from 'lucide-react';

export default function TicketList() {
  const { t } = useLanguage();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    setLoading(true);
    const data = await getAllTickets();
    setTickets(data);
    setLoading(false);
  }

  async function handleReply(ticketId: string) {
    if (!replyText.trim()) return;

    await replyToTicket(ticketId, replyText);
    setReplyText('');
    setReplyingId(null);
    loadTickets();
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gold-light">{t.admin.tickets}</h3>

      {loading ? (
        <div className="text-center py-8 text-zinc-500">{t.common.loading}</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">{t.support.noTickets}</div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium">{ticket.subject}</h4>
                  <p className="text-sm text-zinc-500">
                    {ticket.user?.full_name} • {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    ticket.status === 'open'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              <p className="text-zinc-300 mb-3">{ticket.description}</p>

              {ticket.admin_reply && (
                <div className="bg-zinc-800 rounded p-3 mb-3">
                  <p className="text-sm text-gold-primary mb-1">{t.support.reply}:</p>
                  <p className="text-zinc-300">{ticket.admin_reply}</p>
                </div>
              )}

              {ticket.status === 'open' && (
                <>
                  {replyingId === ticket.id ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm"
                      />
                      <Button size="sm" onClick={() => handleReply(ticket.id)}>
                        <Check size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setReplyingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReplyingId(ticket.id)}
                    >
                      <MessageSquare size={16} className="mr-1" />
                      {t.admin.reply}
                    </Button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
