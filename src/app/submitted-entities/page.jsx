'use client';

import { useEffect, useState } from 'react';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/custom/Navbar';
import Footer from '@/components/custom/Footer';
import { getMySubmissions } from '@/app/actions/entity';

const outfit = Outfit({ subsets: ['latin'] });
const jetbrains = JetBrains_Mono({ subsets: ['latin'] });

export default function SubmittedEntities() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getMySubmissions();
      setSubmissions(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
        case 'APPROVED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
        case 'REJECTED': return 'bg-red-500/10 text-red-600 border-red-500/20';
        case 'UNDER_PROCESS': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
        default: return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
        case 'APPROVED': return 'verified';
        case 'REJECTED': return 'cancel';
        case 'UNDER_PROCESS': return 'sync';
        default: return 'pending_actions';
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col relative overflow-hidden ${outfit.className}`}>
      {/* Light Wire mesh background element */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/4 translate-y-1/4"></div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Submissions</h1>
            <p className="text-slate-500 mt-2">Track the status of your land registration requests.</p>
        </div>

        {loading ? (
            <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-4xl text-indigo-500">progress_activity</span>
            </div>
        ) : submissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">description</span>
                <h3 className="text-xl font-bold text-slate-700">No submissions found</h3>
                <p className="text-slate-500 mt-2">You haven't submitted any entities for registration yet.</p>
            </div>
        ) : (
            <div className="grid gap-6">
                {submissions.map((sub) => (
                    <div key={sub.id} onClick={() => setSelectedSubmission(sub)} className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden transition-all hover:shadow-[0_4px_25px_rgb(0,0,0,0.06)] flex flex-col relative cursor-pointer">
                        <div className="flex flex-col md:flex-row">
                            {/* Status Strip */}
                            <div className={`w-full md:w-2 ${getStatusColor(sub.status).split(' ')[0]} bg-opacity-100`}></div>
                            
                            <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(sub.status)}`}>
                                            <span className="material-symbols-outlined text-[14px]">{getStatusIcon(sub.status)}</span>
                                            {sub.status.replace('_', ' ')}
                                        </span>
                                        <span className={`text-xs text-slate-400 ${jetbrains.className}`}>
                                            ID: #{String(sub.id).padStart(5, '0')}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            • {new Date(sub.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1 capitalize">
                                        {sub.land_type} Land
                                    </h3>
                                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                        {sub.landmark}, {sub.district}, {sub.state}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:border-l md:border-slate-100 md:pl-8">
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-1">Total Area</p>
                                        <p className={`font-bold text-slate-800 ${jetbrains.className}`}>{parseFloat(sub.area).toFixed(2)} sq ft</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-1">Coordinates</p>
                                        <p className={`font-medium text-slate-700 text-sm ${jetbrains.className}`}>{sub.geo_lat}, {sub.geo_lng}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {sub.notes && (
                            <div className="bg-slate-50 border-t border-slate-100 px-6 md:px-8 py-4 w-full">
                                <p className="text-sm text-slate-600"><strong className="text-slate-800">RI Note:</strong> {sub.notes}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
        </main>
        
        <Footer />
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 sm:p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-5xl max-h-full flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800 text-lg">Submission Details - #{String(selectedSubmission.id).padStart(5, '0')}</h3>
                <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                  <span className="material-symbols-outlined leading-none">close</span>
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Details Section */}
                  <div className="space-y-6">
                      <div>
                          <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Property Details</h4>
                          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <p className="text-xs text-slate-400 font-medium mb-1">Land Type</p>
                                      <p className="font-medium text-slate-800 capitalize">{selectedSubmission.land_type}</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-slate-400 font-medium mb-1">Status</p>
                                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(selectedSubmission.status)}`}>
                                          {selectedSubmission.status.replace('_', ' ')}
                                      </span>
                                  </div>
                                  <div className="col-span-2 border-t border-slate-200 pt-3">
                                      <p className="text-xs text-slate-400 font-medium mb-1">Location</p>
                                      <p className="font-medium text-slate-800">{selectedSubmission.landmark}, {selectedSubmission.district}, {selectedSubmission.state}</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-slate-400 font-medium mb-1">Area</p>
                                      <p className={`font-medium text-slate-800 ${jetbrains.className}`}>{parseFloat(selectedSubmission.area).toFixed(2)} sq ft</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-slate-400 font-medium mb-1">GPS Coordinates</p>
                                      <p className={`font-medium text-slate-800 ${jetbrains.className}`}>{selectedSubmission.geo_lat}, {selectedSubmission.geo_lng}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                      {selectedSubmission.notes && (
                          <div>
                              <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Official Notes</h4>
                              <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                                  <p className="text-sm text-slate-700">{selectedSubmission.notes}</p>
                              </div>
                          </div>
                      )}

                      {/* Progress Tracker */}
                      <div className="pt-2">
                          <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Progress Tracker</h4>
                          <div className="flex flex-col">
                              {/* Step 1: Submitted */}
                              <div className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                      <div className="w-8 h-8 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center shrink-0">
                                          <span className="material-symbols-outlined text-[16px] text-white font-bold">check</span>
                                      </div>
                                      <div className={`w-0.5 h-full my-1 rounded-full ${selectedSubmission.status !== 'PENDING' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                                  </div>
                                  <div className="pb-8 pt-1">
                                      <p className="font-bold text-slate-900 text-sm">Application Submitted</p>
                                      <p className="text-xs text-slate-500 mt-1">Your application was successfully sent.</p>
                                      <p className={`text-xs mt-1.5 font-semibold ${jetbrains.className} text-emerald-600`}>
                                          {new Date(selectedSubmission.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                      </p>
                                  </div>
                              </div>
                              
                              {/* Step 2: Under Process */}
                              <div className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                          selectedSubmission.status !== 'PENDING' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-100 border-2 border-slate-200'
                                      }`}>
                                          {selectedSubmission.status !== 'PENDING' ? (
                                              <span className="material-symbols-outlined text-[16px] text-white font-bold">check</span>
                                          ) : (
                                              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                          )}
                                      </div>
                                      <div className={`w-0.5 h-full my-1 rounded-full ${
                                          selectedSubmission.status === 'APPROVED' || selectedSubmission.status === 'REJECTED' ? 'bg-emerald-500' : 'bg-slate-200'
                                      }`}></div>
                                  </div>
                                  <div className="pb-8 pt-1">
                                      <p className={`font-bold text-sm ${selectedSubmission.status !== 'PENDING' ? 'text-slate-900' : 'text-slate-400'}`}>Verification by RI</p>
                                      <p className="text-xs text-slate-500 mt-1">Revenue Inspector reviewing documents.</p>
                                      {selectedSubmission.under_process_at && (
                                          <p className={`text-xs mt-1.5 font-semibold ${jetbrains.className} text-emerald-600`}>
                                              {new Date(selectedSubmission.under_process_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                          </p>
                                      )}
                                  </div>
                              </div>

                              {/* Step 3: Decision */}
                              <div className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                          selectedSubmission.status === 'APPROVED' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' 
                                          : selectedSubmission.status === 'REJECTED' ? 'bg-red-500 shadow-lg shadow-red-500/30'
                                          : 'bg-slate-100 border-2 border-slate-200'
                                      }`}>
                                          {selectedSubmission.status === 'APPROVED' && <span className="material-symbols-outlined text-[16px] text-white font-bold">check</span>}
                                          {selectedSubmission.status === 'REJECTED' && <span className="material-symbols-outlined text-[16px] text-white font-bold">close</span>}
                                          {selectedSubmission.status !== 'APPROVED' && selectedSubmission.status !== 'REJECTED' && (
                                              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                          )}
                                      </div>
                                  </div>
                                  <div className="pt-1">
                                      <p className={`font-bold text-sm ${
                                          selectedSubmission.status === 'APPROVED' ? 'text-emerald-600' 
                                          : selectedSubmission.status === 'REJECTED' ? 'text-red-600'
                                          : 'text-slate-400'
                                      }`}>
                                          {selectedSubmission.status === 'APPROVED' ? 'Approved' 
                                          : selectedSubmission.status === 'REJECTED' ? 'Rejected'
                                          : 'Final Decision'}
                                      </p>
                                      <p className="text-xs text-slate-500 mt-1">Final status of your application.</p>
                                      {selectedSubmission.decision_at && (
                                          <p className={`text-xs mt-1.5 font-semibold ${jetbrains.className} ${selectedSubmission.status === 'APPROVED' ? 'text-emerald-600' : 'text-red-600'}`}>
                                              {new Date(selectedSubmission.decision_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                          </p>
                                      )}
                                  </div>
                              </div>
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
