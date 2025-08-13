import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllTerms } from '../../Redux/Slice/TermsCondition.slice';
import BackgroundColor from '../BackgroundColor';
import { motion, AnimatePresence } from 'framer-motion';

const TermsCondition = () => {

    const dispatch = useDispatch();
    const { Terms: terms = [], loading } = useSelector((state) => state.term || {});

    useEffect(() => {
        dispatch(getAllTerms());
    }, [dispatch]);

    const [openIndex, setOpenIndex] = useState(null);
    const [allOpen, setAllOpen] = useState(false);
    const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef([]);

  const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const highlight = (text = '', q = '') => {
    if (!q) return text;
    const parts = String(text).split(new RegExp(`(${escapeRegex(q)})`, 'ig'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase()
        ? <span key={i} className="bg-yellow-500/20 text-white rounded px-0.5">{part}</span>
        : <React.Fragment key={i}>{part}</React.Fragment>
    );
  };

  useEffect(() => {
    const hash = window.location.hash?.slice(1);
    if (!hash) return;
    const idIndex = terms.findIndex((t, idx) => `term-${t?._id || idx}` === hash);
    if (idIndex >= 0) {
      setAllOpen(false);
      setOpenIndex(idIndex);
      setTimeout(() => {
        const el = itemRefs.current[idIndex];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [terms]);

  useEffect(() => {
    const onScroll = () => {
      const offsets = itemRefs.current.map((el) => {
        if (!el) return Number.POSITIVE_INFINITY;
        const rect = el.getBoundingClientRect();
        return Math.abs(rect.top - 120);
      });
      let min = Number.POSITIVE_INFINITY;
      let idx = 0;
      offsets.forEach((v, i) => { if (v < min) { min = v; idx = i; } });
      setActiveIndex(idx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

    const filteredTerms = useMemo(() => {
        if (!Array.isArray(terms)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return terms;
        return terms.filter((t) =>
            (String(t?.title || '').toLowerCase().includes(q)) ||
            (String(t?.description || '').toLowerCase().includes(q))
        );
    }, [terms, query]);

    return (
        <BackgroundColor className="pt-28 pb-16">
            <div className="container mx-auto px-4">
                <div className="max-w-[80%] mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold">
                        <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Terms & Conditions</span>
                    </h1>
                    <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                        Please read these terms carefully before using YOYO. By accessing or using our services, you agree to these terms.
                    </p>
                </div>

                <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-6">
                  {/* Controls + List */}
                  <div className="lg:col-span-3">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => { setQuery(e.target.value); setOpenIndex(null); }}
                          placeholder="Search by title or keyword..."
                          className="w-full pr-10 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
                        />
                        {query && (
                          <button
                            onClick={() => setQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
                            aria-label="Clear search"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { const next = !allOpen; setAllOpen(next); setOpenIndex(null); }}
                          aria-pressed={allOpen}
                          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${allOpen ? 'bg-white/20 border-white/20' : 'bg-white/10 hover:bg-white/20 border-white/10'}`}
                          title={allOpen ? 'Collapse all' : 'Expand all'}
                        >
                          {allOpen ? 'Collapse all' : 'Expand all'}
                        </button>
                        <div className="hidden sm:block text-sm text-gray-400 ml-1">
                          {filteredTerms.length} results
                        </div>
                      </div>
                    </div>

                    {/* List */}
                    <div className="mt-6 space-y-3">
                    {loading && (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-lg border border-white/10 bg-white/5 animate-pulse">
                                <div className="h-12 px-4 py-3" />
                            </div>
                        ))
                    )}

                    {!loading && filteredTerms.length === 0 && (
                        <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-gray-400">
                            No terms found.
                        </div>
                    )}

                    {!loading && filteredTerms.map((term, idx) => {
                        const isOpen = allOpen || openIndex === idx;
                        const anchorId = `term-${term?._id || idx}`;
                        return (
                          <motion.div
                            key={term?._id || idx}
                            ref={(el) => { itemRefs.current[idx] = el; }}
                            id={anchorId}
                            className="group rounded-lg border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-colors"
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className="flex items-center justify-between">
                              <button
                                className="flex-1 flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors"
                                onClick={() => setOpenIndex(isOpen ? null : idx)}
                              >
                                <strong className="text-white md:text-base text-sm">{highlight(term?.title || `Term ${idx + 1}`, query)}</strong>
                                <svg
                                  className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              
                            </div>
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  key="content"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="px-4 pb-4 pt-2 border-t border-white/10 text-gray-300"
                                >
                                  <p className="text-sm leading-relaxed whitespace-pre-line">{highlight(term?.description, query)}</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                    })}
                    </div>
                  </div>

                  {/* TOC */}
                  <aside className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-28 space-y-2">
                      <div className="text-xs uppercase tracking-wider text-gray-400">On this page</div>
                      <div className="space-y-1">
                        {filteredTerms.map((t, i) => {
                          const anchorId = `term-${t?._id || i}`;
                          const isActive = i === activeIndex;
                          return (
                            <button
                              key={anchorId}
                              onClick={() => {
                                setOpenIndex(i);
                                const el = itemRefs.current[i];
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                window.history.replaceState(null, '', `#${anchorId}`);
                              }}
                              className={`w-full text-left text-sm rounded px-2 py-1.5 transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                            >
                              {t?.title || `Term ${i + 1}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </aside>
                </div>
                </div>
            </div>
        </BackgroundColor>
    )
}

export default TermsCondition
