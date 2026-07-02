'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/language';
import { createTicket, getUserTickets } from '@/lib/api';
import { SupportTicket } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Send, MessageSquare } from 'lucide-react';

export default function SupportPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  async function loadTickets() {
    if (!user) return;
    setLoading(true);
    const data = await getUserTickets(user.id);
    setTickets(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    await createTicket(user.id, subject, description);
    setSubject('');
    setDescription('');
    setShowForm(false);
    setSubmitting(false);
    loadTickets();
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t.support.title}
          </h1>
          <div className="w-20 h-1 bg-gold-primary mx-auto" />
        </div>

        {user && (
          <div className="mb-8">
            <Button onClick={() => setShowForm(!showForm)}>
              <MessageSquare size={16} className="mr-2" />
              {t.support.createTicket}
            </Button>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-bg-secondary rounded-xl border border-zinc-800 p-6 mb-8 space-y-4">
            <Input
              label={t.support.subject}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gold-light mb-1">
                {t.support.description}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-colors h-32"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                {t.admin.cancel}
              </Button>
              <Button type="submit" loading={submitting}>
                <Send size={16} className="mr-2" />
                {t.support.submit}
              </Button>
            </div>
          </form>
        )}

        <div>
          <h2 className="text-2xl font-semibold text-gold-light mb-6">{t.support.myTickets}</h2>

          {loading ? (
            <div className="text-center py-8 text-zinc-500">{t.common.loading}</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">{t.support.noTickets}</div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="bg-bg-secondary rounded-lg border border-zinc-800 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium">{ticket.subject}</h3>
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
                  <p className="text-zinc-400 text-sm mb-2">{ticket.description}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                  {ticket.admin_reply && (
                    <div className="mt-3 p-3 bg-zinc-800/50 rounded">
                      <p className="text-xs text-gold-primary mb-1">{t.support.reply}:</p>
                      <p className="text-sm text-zinc-300">{ticket.admin_reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
