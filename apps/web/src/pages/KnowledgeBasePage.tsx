import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { FAQ } from '@ai-receptionist/shared';
import { BookOpen, Plus, Trash2, HelpCircle } from 'lucide-react';

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
          <h1 className="font-serif text-3xl font-normal tracking-tight text-[#140206] flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#140206] text-[#1bd944] flex items-center justify-center border-2 border-[#140206] shadow-brutal-sm">
              <BookOpen className="w-5 h-5" />
            </span>
            Knowledge Graph & Verified FAQs
          </h1>
          <p className="text-xs font-mono text-[#5e5850] mt-1">
            Ground-truth corporate knowledge referenced in real time during live speech synthesis.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-5 py-2.5 bg-[#140206] hover:bg-[#1bd944] text-[#f5f3ef] hover:text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal transition flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <Plus className="w-4 h-4" /> Add Knowledge Item
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-white border-2 border-[#140206] p-6 rounded-3xl space-y-4 shadow-brutal-lg">
          <h3 className="font-serif text-xl font-normal text-[#140206]">Provision Knowledge Entry</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Domain Taxonomy</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-mono text-[#140206] focus:outline-none focus:bg-white"
              >
                <option value="Pricing">Pricing & Rates</option>
                <option value="Services">Services & Coverage</option>
                <option value="Warranty">Warranty & Guarantees</option>
                <option value="General">General Inquiries</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Anticipated Caller Inquiry</label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Do you provide upfront diagnostic estimates?"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-mono text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Authoritative Verified Response</label>
              <textarea
                rows={3}
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Sarah will recite this verified guidance over the voice channel."
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-mono text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 bg-[#fbf8f1] text-[#140206] border-2 border-[#140206] rounded-full text-xs font-mono uppercase font-bold hover:bg-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1bd944] text-[#140206] border-2 border-[#140206] rounded-full text-xs font-mono uppercase font-extrabold shadow-brutal-sm hover:bg-[#3bdb5d] transition"
            >
              Commit Knowledge Item
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white border-2 border-[#140206] p-6 rounded-3xl shadow-brutal hover:shadow-brutal-lg transition flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-mono font-bold px-3 py-0.5 rounded-full bg-[#ffb4c5] text-[#140206] border-2 border-[#140206] shadow-brutal-sm">
                  {faq.category}
                </span>
                <span className="text-xs font-mono text-[#856f58]">Ground-Truth Knowledge Entry</span>
              </div>
              <h3 className="font-serif text-lg font-normal text-[#140206] flex items-center gap-2 mt-1">
                <HelpCircle className="w-4 h-4 text-[#140206] shrink-0" />
                {faq.question}
              </h3>
              <p className="text-xs font-sans text-[#4b2c22] leading-relaxed pl-6 border-l-2 border-[#140206]/20">
                {faq.answer}
              </p>
            </div>
            <button
              onClick={() => handleDelete(faq.id)}
              className="p-2 text-[#856f58] hover:text-[#ff6183] hover:bg-[#ffb4c5]/20 rounded-xl border border-transparent hover:border-[#140206] transition"
              title="Delete knowledge item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
