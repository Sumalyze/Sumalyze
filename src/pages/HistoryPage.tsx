import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  getAnalysisHistory,
  deleteAnalysisHistory,
  getAgentRuns,
  deleteAgentRun,
  getSavedOutputs,
  deleteSavedOutput,
} from '../services/database';

type HistoryTab = 'tools' | 'agents' | 'saved';

export default function HistoryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<HistoryTab>('tools');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data lists
  const [toolsHistory, setToolsHistory] = useState<any[]>([]);
  const [agentRuns, setAgentRuns] = useState<any[]>([]);
  const [savedOutputs, setSavedOutputs] = useState<any[]>([]);

  // Selected item modal state
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [modalType, setModalType] = useState<HistoryTab | null>(null);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [toolsRes, agentsRes, savedRes] = await Promise.all([
        getAnalysisHistory(),
        getAgentRuns(),
        getSavedOutputs(),
      ]);

      if (toolsRes.error) throw toolsRes.error;
      if (agentsRes.error) throw agentsRes.error;
      if (savedRes.error) throw savedRes.error;

      setToolsHistory(toolsRes.data || []);
      setAgentRuns(agentsRes.data || []);
      setSavedOutputs(savedRes.data || []);
    } catch (err: any) {
      console.error('[History] Failed to load data:', err);
      setError(err.message || 'Failed to load history database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleDelete = async (id: string, tab: HistoryTab) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      let err = null;
      if (tab === 'tools') {
        const res = await deleteAnalysisHistory(id);
        err = res.error;
        if (!err) setToolsHistory(prev => prev.filter(item => item.id !== id));
      } else if (tab === 'agents') {
        const res = await deleteAgentRun(id);
        err = res.error;
        if (!err) setAgentRuns(prev => prev.filter(item => item.id !== id));
      } else if (tab === 'saved') {
        const res = await deleteSavedOutput(id);
        err = res.error;
        if (!err) setSavedOutputs(prev => prev.filter(item => item.id !== id));
      }

      if (err) throw err;
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Content copied to clipboard!');
    } catch {
      alert('Failed to copy to clipboard.');
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '120px 20px 80px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, color: 'white', marginBottom: 16 }}>Your AI History</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
          Please sign in to save and access your analysis history, agent execution logs, and saved bookmarks.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '120px 20px 80px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Title */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 600, letterSpacing: '-0.02em', color: 'white', marginBottom: 8 }}>
          History & Saved Outputs
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>
          View, copy, and manage your past AI insights and saved response templates.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 6,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: 4, marginBottom: 32,
        maxWidth: 480,
      }}>
        {(['tools', 'agents', 'saved'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 9, fontSize: 13, fontWeight: 500,
              background: activeTab === tab ? 'rgba(226,62,87,0.1)' : 'transparent',
              border: activeTab === tab ? '1px solid rgba(226,62,87,0.3)' : '1px solid transparent',
              color: activeTab === tab ? '#ff8fa3' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
            }}
          >
            {tab === 'tools' ? 'Tools History' : tab === 'agents' ? 'Agent Runs' : 'Saved Bookmarks'}
          </button>
        ))}
      </div>

      {/* Content States */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="stepperPulse" style={{ display: 'inline-block', width: 28, height: 28, borderRadius: '50%', background: '#E23E57' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 12 }}>Loading records from Supabase...</p>
        </div>
      ) : error ? (
        <div style={{
          padding: 24, borderRadius: 16, background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center', color: '#f87171',
        }}>
          <p style={{ fontWeight: 600, margin: '0 0 8px' }}>Failed to Load History</p>
          <p style={{ fontSize: 13, margin: '0 0 16px', opacity: 0.8 }}>{error}</p>
          <button onClick={loadData} style={{
            padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.1)',
            border: 'none', color: 'white', cursor: 'pointer', fontWeight: 500, fontSize: 13,
          }}>Retry</button>
        </div>
      ) : (
        <div>
          {/* ─── TOOLS HISTORY ─── */}
          {activeTab === 'tools' && (
            toolsHistory.length === 0 ? (
              <EmptyState message="No tool history found. Paste text in 'Tools' to start analyzing." />
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {toolsHistory.map(item => (
                  <HistoryCard
                    key={item.id}
                    title={item.analysis_type.charAt(0).toUpperCase() + item.analysis_type.slice(1).replace('_', ' ')}
                    text={item.input_text}
                    date={new Date(item.created_at).toLocaleString()}
                    onView={() => { setSelectedItem(item); setModalType('tools'); }}
                    onDelete={() => handleDelete(item.id, 'tools')}
                  />
                ))}
              </div>
            )
          )}

          {/* ─── AGENT RUNS ─── */}
          {activeTab === 'agents' && (
            agentRuns.length === 0 ? (
              <EmptyState message="No agent runs found. Run 'Agent Mode' to perform complete analyses." />
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {agentRuns.map(item => (
                  <HistoryCard
                    key={item.id}
                    title={`Goal: ${item.goal.charAt(0).toUpperCase() + item.goal.slice(1).replace('_', ' ')}`}
                    text={item.final_summary || 'Task completed with log.'}
                    date={new Date(item.created_at).toLocaleString()}
                    status={item.status}
                    onView={() => { setSelectedItem(item); setModalType('agents'); }}
                    onDelete={() => handleDelete(item.id, 'agents')}
                  />
                ))}
              </div>
            )
          )}

          {/* ─── SAVED BOOKMARKS ─── */}
          {activeTab === 'saved' && (
            savedOutputs.length === 0 ? (
              <EmptyState message="No bookmarks saved. Click 'Save Output' on results cards to bookmark them." />
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {savedOutputs.map(item => (
                  <HistoryCard
                    key={item.id}
                    title={item.title}
                    text={item.content}
                    date={new Date(item.created_at).toLocaleString()}
                    badge={item.output_type.charAt(0).toUpperCase() + item.output_type.slice(1).replace('_', ' ')}
                    onView={() => { setSelectedItem(item); setModalType('saved'); }}
                    onDelete={() => handleDelete(item.id, 'saved')}
                    onCopy={() => copyToClipboard(item.content)}
                  />
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* ─── VIEW MODAL ─── */}
      {selectedItem && modalType && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5,2,8,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, zIndex: 1000,
        }} onClick={() => setSelectedItem(null)}>
          <div style={{
            background: '#12071a', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24, padding: 32, maxWidth: 640, width: '100%',
            maxHeight: '85vh', overflowY: 'auto', position: 'relative',
            boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedItem(null)} style={{
              position: 'absolute', top: 20, right: 20,
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', border: 'none',
              color: 'rgba(255,255,255,0.6)', fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>

            {/* Modal header */}
            <div style={{ marginBottom: 24 }}>
              <span style={{
                display: 'inline-flex', padding: '4px 12px', borderRadius: 99,
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                background: 'rgba(226,62,87,0.1)', color: '#ff8fa3',
                marginBottom: 12, letterSpacing: '0.05em',
              }}>
                {modalType === 'tools' ? 'Tools Analysis' : modalType === 'agents' ? 'Agent Mode Run' : 'Saved Bookmark'}
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'white', margin: 0 }}>
                {modalType === 'tools'
                  ? selectedItem.analysis_type.charAt(0).toUpperCase() + selectedItem.analysis_type.slice(1).replace('_', ' ')
                  : modalType === 'agents'
                  ? `Agent: ${selectedItem.goal.charAt(0).toUpperCase() + selectedItem.goal.slice(1).replace('_', ' ')}`
                  : selectedItem.title}
              </h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{new Date(selectedItem.created_at).toLocaleString()}</p>
            </div>

            {/* Modal content body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Input section */}
              {selectedItem.input_text && (
                <div>
                  <h4 style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Input text</h4>
                  <div style={{
                    padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)', fontSize: 14, color: 'rgba(255,255,255,0.85)',
                    lineHeight: '22px', whiteSpace: 'pre-wrap', maxHeight: 150, overflowY: 'auto',
                  }}>
                    {selectedItem.input_text}
                  </div>
                </div>
              )}

              {/* Output result */}
              {modalType === 'tools' && selectedItem.results && (
                <div>
                  <h4 style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Output results</h4>
                  <div style={{
                    padding: 14, borderRadius: 12, background: 'rgba(226,62,87,0.03)',
                    border: '1px solid rgba(226,62,87,0.1)', fontSize: 14, color: 'rgba(255,255,255,0.9)',
                    lineHeight: '22px', whiteSpace: 'pre-wrap',
                  }}>
                    {selectedItem.results.output || JSON.stringify(selectedItem.results)}
                  </div>
                </div>
              )}

              {modalType === 'agents' && (
                <div>
                  {selectedItem.final_summary && (
                    <div style={{ marginBottom: 16 }}>
                      <h4 style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Final summary</h4>
                      <div style={{
                        padding: 14, borderRadius: 12, background: 'rgba(226,62,87,0.03)',
                        border: '1px solid rgba(226,62,87,0.1)', fontSize: 14, color: 'rgba(255,255,255,0.9)',
                        lineHeight: '22px', whiteSpace: 'pre-wrap',
                      }}>
                        {selectedItem.final_summary}
                      </div>
                    </div>
                  )}

                  {/* Execution logs */}
                  {selectedItem.execution_log && Array.isArray(selectedItem.execution_log) && (
                    <div>
                      <h4 style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Execution Log</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {selectedItem.execution_log.map((step: any, idx: number) => (
                          <div key={idx} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.04)', fontSize: 13,
                          }}>
                            <span style={{ color: '#34d399', fontWeight: 600 }}>✓</span>
                            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{step.label || step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {modalType === 'saved' && (
                <div>
                  <h4 style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Saved content</h4>
                  <div style={{
                    padding: 16, borderRadius: 12, background: 'rgba(226,62,87,0.03)',
                    border: '1px solid rgba(226,62,87,0.1)', fontSize: 14, color: 'rgba(255,255,255,0.9)',
                    lineHeight: '22px', whiteSpace: 'pre-wrap',
                  }}>
                    {selectedItem.content}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <button onClick={() => copyToClipboard(selectedItem.content)} style={{
                      flex: 1, padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                      border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
                      color: 'white', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                    }}>
                      Copy Content
                    </button>
                    <button onClick={() => handleDelete(selectedItem.id, 'saved')} style={{
                      padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                      border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)',
                      color: '#f87171', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                    }}>
                      Delete Bookmark
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Subcomponents ───────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      padding: '48px 24px', borderRadius: 20, background: 'rgba(255,255,255,0.01)',
      border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center',
    }}>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: 0 }}>{message}</p>
    </div>
  );
}

interface HistoryCardProps {
  title: string;
  text: string;
  date: string;
  status?: string;
  badge?: string;
  onView: () => void;
  onDelete: () => void;
  onCopy?: () => void;
}

function HistoryCard({ title, text, date, status, badge, onView, onDelete, onCopy }: HistoryCardProps) {
  const clipText = (t: string) => {
    return t.length > 140 ? t.substring(0, 140) + '...' : t;
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.015)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16, padding: 20, display: 'flex',
      flexDirection: 'column', gap: 12,
      transition: 'border-color 0.2s ease',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(226,62,87,0.2)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', margin: 0 }}>{title}</h3>
            {status && (
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4,
                background: status === 'completed' ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)',
                color: status === 'completed' ? '#34d399' : '#fbbf24',
              }}>
                {status}
              </span>
            )}
            {badge && (
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
              }}>
                {badge}
              </span>
            )}
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'block', marginTop: 4 }}>{date}</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          {onCopy && (
            <button onClick={onCopy} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'inherit',
            }}>Copy</button>
          )}
          <button onClick={onView} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            background: 'rgba(226,62,87,0.1)', border: '1px solid rgba(226,62,87,0.2)',
            color: '#ff8fa3', cursor: 'pointer', fontFamily: 'inherit',
          }}>View</button>
          <button onClick={onDelete} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
            color: '#f87171', cursor: 'pointer', fontFamily: 'inherit',
          }}>Delete</button>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: '20px' }}>
        {clipText(text)}
      </p>
    </div>
  );
}
