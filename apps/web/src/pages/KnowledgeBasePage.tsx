import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { FAQ } from '@ai-receptionist/shared';
import { BookOpen, Plus, Trash2, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Pricing');

  const fetchFaqs = async () => {
    try {
      const data = await apiRequest<FAQ[]>('/faqs');
      setFaqs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/faqs', {
        method: 'POST',
        body: JSON.stringify({ question, answer, category })
      });
      setShowAdd(false);
      setQuestion('');
      setAnswer('');
      fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete FAQ?')) return;
    try {
      await apiRequest(`/faqs/${id}`, { method: 'DELETE' });
      fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-400" />
            Business Knowledge & FAQs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sarah uses these exact verified answers when responding to caller inquiries.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white">Add Knowledge Entry</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-sm text-white"
              >
                <option value="Pricing">Pricing & Rates</option>
                <option value="Services">Services & Coverage</option>
                <option value="Warranty">Warranty & Guarantees</option>
                <option value="General">General Inquiries</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Caller Question</label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Do you provide free estimates?"
                className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">AI Verified Answer</label>
              <textarea
                rows={3}
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="The verified answer Sarah should communicate over the phone."
                className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-sm text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 bg-slate-850 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold"
            >
              Save Knowledge Item
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {faq.category}
                </span>
                <span className="text-xs text-slate-500">• Verified Business Knowledge</span>
              </div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-400 shrink-0" />
                {faq.question}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-6 border-l-2 border-slate-800">
                {faq.answer}
              </p>
            </div>
            <button
              onClick={() => handleDelete(faq.id)}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-850 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
