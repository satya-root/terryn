'use client';

import { useEffect, useState } from 'react';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/custom/Navbar';
import Footer from '@/components/custom/Footer';
import { getAdminSubmissions, updateSubmissionStatus } from '@/app/actions/entity';
import { useRouter } from 'next/navigation';

const outfit = Outfit({ subsets: ['latin'] });
const jetbrains = JetBrains_Mono({ subsets: ['latin'] });

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await getAdminSubmissions();
    if (!data) {
        router.push('/admin-login?callbackUrl=/admin-dashboard');
        return;
    }
    setSubmissions(data || []);
    setLoading(false);
  }

  const handleStatusChange = async (id, newStatus) => {
    setProcessingId(id);
    let notes = "";
    if (newStatus === 'REJECTED') {
        notes = prompt("Please provide a reason for rejection:");
        if (notes === null) {
            setProcessingId(null);
            return;
        }
    }
    
    const res = await updateSubmissionStatus(id, newStatus, notes);
    if (res.success) {
        const updatedData = await getAdminSubmissions();
        if (updatedData) {
            setSubmissions(updatedData);
            
            // If the modal is currently open for this submission, update its data to reflect the change instantly
            const newSub = updatedData.find(s => s.id === id);
            if (newSub) {
                setSelectedSubmission(prev => prev && prev.id === id ? newSub : prev);
            }
        }
    } else {
        alert("Failed to update status");
    }
    setProcessingId(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
        case 'APPROVED': return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">APPROVED</span>;
        case 'REJECTED': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">REJECTED</span>;
        case 'UNDER_PROCESS': return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">UNDER PROCESS</span>;
        default: return <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">PENDING</span>;
    }
  };

  return (
    <div className={`min-h-screen bg-[#f7fafc] flex flex-col ${outfit.className}`}>
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold text-[#002045] tracking-tight">RI Portal - Approvals</h1>
                <p className="text-slate-500 mt-2">Manage land registration requests for your assigned district.</p>
            </div>
            <div className="hidden sm:block">
                <span className="material-symbols-outlined text-4xl text-slate-300">verified_user</span>
            </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input 
                        type="text" 
                        placeholder="Search Survey No. or Owner..." 
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg bg-white hover:bg-slate-50">Filter</button>
                    <button className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg bg-white hover:bg-slate-50 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">download</span> Export</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#002045] text-white">
                            <th className="p-4 text-xs font-medium tracking-wider uppercase">ID & Date</th>
                            <th className="p-4 text-xs font-medium tracking-wider uppercase">Owner</th>
                            <th className="p-4 text-xs font-medium tracking-wider uppercase">Details</th>
                            <th className="p-4 text-xs font-medium tracking-wider uppercase">Location</th>
                            <th className="p-4 text-xs font-medium tracking-wider uppercase">Status</th>
                            <th className="p-4 text-xs font-medium tracking-wider uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-slate-400">
                                    <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
                                </td>
                            </tr>
                        ) : submissions.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-slate-400">
                                    No pending requests for your district.
                                </td>
                            </tr>
                        ) : submissions.map((sub, idx) => (
                            <tr key={sub.id} onClick={() => setSelectedSubmission(sub)} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-slate-100 cursor-pointer transition-colors`}>
                                <td className="p-4 align-top">
                                    <div className={`text-xs font-bold text-slate-900 ${jetbrains.className}`}>#{String(sub.id).padStart(5, '0')}</div>
                                    <div className="text-xs text-slate-500 mt-1">{new Date(sub.created_at).toLocaleDateString()}</div>
                                </td>
                                <td className="p-4 align-top">
                                    <div className="text-sm font-bold text-slate-900">{sub.submitter?.username || 'Unknown'}</div>
                                    <div className="text-xs text-slate-500 mt-1">Citizen</div>
                                </td>
                                <td className="p-4 align-top">
                                    <div className="text-sm font-medium text-slate-900 capitalize">{sub.land_type}</div>
                                    <div className={`text-xs text-slate-500 mt-1 ${jetbrains.className}`}>{parseFloat(sub.area).toFixed(2)} sq ft</div>
                                </td>
                                <td className="p-4 align-top">
                                    <div className="text-sm text-slate-700">{sub.landmark}</div>
                                    <div className="text-xs text-slate-500 mt-1">{sub.district}, {sub.state}</div>
                                </td>
                                <td className="p-4 align-top">
                                    {getStatusBadge(sub.status)}
                                </td>
                                <td className="p-4 align-top text-right" onClick={(e) => e.stopPropagation()}>
                                    {processingId === sub.id ? (
                                        <span className="material-symbols-outlined animate-spin text-slate-400">sync</span>
                                    ) : sub.status === 'PENDING' ? (
                                        <div className="flex flex-col gap-2 items-end">
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => handleStatusChange(sub.id, 'UNDER_PROCESS')} className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded border border-indigo-200 transition-colors">PROCESS</button>
                                                <button onClick={() => handleStatusChange(sub.id, 'REJECTED')} className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200 transition-colors">REJECT</button>
                                            </div>
                                            <div className="flex gap-2 justify-end mt-2">
                                                {sub.land_photo && <a href={sub.land_photo} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold text-slate-500 hover:text-indigo-600">Photo</a>}
                                                {sub.ror_document && <a href={sub.ror_document} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold text-slate-500 hover:text-indigo-600">Doc</a>}
                                            </div>
                                        </div>
                                    ) : sub.status === 'UNDER_PROCESS' ? (
                                        <div className="flex flex-col gap-2 items-end">
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => handleStatusChange(sub.id, 'APPROVED')} className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded shadow-sm transition-colors">APPROVE</button>
                                                <button onClick={() => handleStatusChange(sub.id, 'REJECTED')} className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200 transition-colors">REJECT</button>
                                            </div>
                                            <div className="flex gap-2 justify-end mt-2">
                                                {sub.land_photo && <a href={sub.land_photo} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold text-slate-500 hover:text-indigo-600">Photo</a>}
                                                {sub.ror_document && <a href={sub.ror_document} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold text-slate-500 hover:text-indigo-600">Doc</a>}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2 items-end">
                                            <span className="text-xs text-slate-400 font-medium mb-1">LOCKED</span>
                                            <div className="flex gap-2 justify-end">
                                                {sub.land_photo && <a href={sub.land_photo} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold text-slate-500 hover:text-indigo-600">Photo</a>}
                                                {sub.ror_document && <a href={sub.ror_document} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold text-slate-500 hover:text-indigo-600">Doc</a>}
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
      
      <Footer />

      {/* Admin Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-5xl max-h-full flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-slate-800 text-lg">Review Submission - #{String(selectedSubmission.id).padStart(5, '0')}</h3>
                  {getStatusBadge(selectedSubmission.status)}
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                  <span className="material-symbols-outlined leading-none">close</span>
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Details Section */}
                  <div className="space-y-6">
                      <div>
                          <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Property Information</h4>
                          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="col-span-2">
                                      <p className="text-xs text-slate-400 font-medium mb-1">Submitter</p>
                                      <p className="font-medium text-slate-800">{selectedSubmission.submitter?.username || 'Unknown Citizen'}</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-slate-400 font-medium mb-1">Land Type</p>
                                      <p className="font-medium text-slate-800 capitalize">{selectedSubmission.land_type}</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-slate-400 font-medium mb-1">Submitted On</p>
                                      <p className={`font-medium text-slate-800 ${jetbrains.className}`}>
                                        {new Date(selectedSubmission.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                      </p>
                                  </div>
                                  <div className="col-span-2 border-t border-slate-200 pt-3">
                                      <p className="text-xs text-slate-400 font-medium mb-1">Full Location</p>
                                      <p className="font-medium text-slate-800">{selectedSubmission.landmark}, {selectedSubmission.district}, {selectedSubmission.state}</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-slate-400 font-medium mb-1">Total Area</p>
                                      <p className={`font-medium text-slate-800 ${jetbrains.className}`}>{parseFloat(selectedSubmission.area).toFixed(2)} sq ft</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-slate-400 font-medium mb-1">GPS Coordinates</p>
                                      <p className={`font-medium text-slate-800 ${jetbrains.className}`}>{selectedSubmission.geo_lat}, {selectedSubmission.geo_lng}</p>
                                  </div>
                                  {selectedSubmission.length && (
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-1">Length</p>
                                        <p className={`font-medium text-slate-800 ${jetbrains.className}`}>{selectedSubmission.length} ft</p>
                                    </div>
                                  )}
                                  {selectedSubmission.width && (
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-1">Width</p>
                                        <p className={`font-medium text-slate-800 ${jetbrains.className}`}>{selectedSubmission.width} ft</p>
                                    </div>
                                  )}
                              </div>
                          </div>
                      </div>

                      {/* RI Actions inside modal */}
                      <div className="pt-2">
                        <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Review Actions</h4>
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                          {processingId === selectedSubmission.id ? (
                            <div className="flex items-center justify-center p-4">
                                <span className="material-symbols-outlined animate-spin text-indigo-500 text-3xl">sync</span>
                            </div>
                          ) : selectedSubmission.status === 'PENDING' ? (
                            <div className="flex flex-col gap-3">
                                <p className="text-sm text-slate-600">Start the verification process to inspect the documents.</p>
                                <button onClick={() => handleStatusChange(selectedSubmission.id, 'UNDER_PROCESS')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-colors">
                                    Start Processing
                                </button>
                                <button onClick={() => handleStatusChange(selectedSubmission.id, 'REJECTED')} className="w-full py-3 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-lg transition-colors">
                                    Reject Immediately
                                </button>
                            </div>
                          ) : selectedSubmission.status === 'UNDER_PROCESS' ? (
                            <div className="flex flex-col gap-3">
                                <p className="text-sm text-slate-600 mb-2">Review the documents carefully before taking a final decision.</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => handleStatusChange(selectedSubmission.id, 'APPROVED')} className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span> Approve
                                    </button>
                                    <button onClick={() => handleStatusChange(selectedSubmission.id, 'REJECTED')} className="py-3 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-lg transition-colors flex justify-center items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">cancel</span> Reject
                                    </button>
                                </div>
                            </div>
                          ) : (
                            <div className="text-center py-2">
                                <p className="text-sm text-slate-500 font-medium mb-1">Decision has been made.</p>
                                {selectedSubmission.notes && (
                                    <div className="mt-3 text-left p-3 bg-slate-100 rounded text-sm text-slate-700">
                                        <strong>Notes:</strong> {selectedSubmission.notes}
                                    </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                  </div>

                  {/* Media Section */}
                  <div className="space-y-6">
                      <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Attached Documents</h4>
                      <div className="space-y-4">
                          {/* Photo */}
                          <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                              <div className="px-4 py-3 border-b border-slate-200 bg-white flex justify-between items-center">
                                  <p className="text-sm font-medium text-slate-700">Land Photo</p>
                                  {selectedSubmission.land_photo ? (
                                      <a href={selectedSubmission.land_photo} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700 text-sm font-bold">Open Full</a>
                                  ) : (
                                      <span className="text-xs text-slate-400">Not provided</span>
                                  )}
                              </div>
                              <div className="bg-slate-100 h-64 flex items-center justify-center p-2">
                                  {selectedSubmission.land_photo ? (
                                      <img src={selectedSubmission.land_photo} alt="Land Photo" className="max-w-full max-h-full object-contain rounded shadow-sm" />
                                  ) : (
                                      <span className="material-symbols-outlined text-4xl text-slate-300">image_not_supported</span>
                                  )}
                              </div>
                          </div>

                          {/* Document */}
                          <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                              <div className="px-4 py-3 border-b border-slate-200 bg-white flex justify-between items-center">
                                  <p className="text-sm font-medium text-slate-700">Record of Rights (RoR)</p>
                                  {selectedSubmission.ror_document ? (
                                      <a href={selectedSubmission.ror_document} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700 text-sm font-bold">Open Full</a>
                                  ) : (
                                      <span className="text-xs text-slate-400">Not provided</span>
                                  )}
                              </div>
                              <div className="bg-slate-100 h-64 flex items-center justify-center p-2">
                                  {selectedSubmission.ror_document ? (
                                      <iframe src={selectedSubmission.ror_document} className="w-full h-full bg-white rounded shadow-sm" title="RoR Document" />
                                  ) : (
                                      <span className="material-symbols-outlined text-4xl text-slate-300">description</span>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
