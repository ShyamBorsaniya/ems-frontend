import React, { useState, useEffect } from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';
import CustomSelect from '../../components/common/CustomSelect';

export default function EmployeeDashboard({ user, onLogout }) {
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const [punchTime, setPunchTime] = useState('09:00 AM');
  const [workSeconds, setWorkSeconds] = useState(14520);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Leave Form State
  const [leaveType, setLeaveType] = useState('Paid Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // Sample Leave History Data
  const [leaveHistory, setLeaveHistory] = useState([
    { id: 1, type: 'Paid Leave', from: '2026-07-10', to: '2026-07-12', days: 3, status: 'Approved' },
    { id: 2, type: 'Sick Leave', from: '2026-06-01', to: '2026-06-01', days: 1, status: 'Approved' },
    { id: 3, type: 'Casual Leave', from: '2026-08-20', to: '2026-08-21', days: 2, status: 'Pending' }
  ]);

  // Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Submit weekly sprint update report', priority: 'high', completed: false, due: 'Today' },
    { id: 2, title: 'Review API specification for auth endpoint', priority: 'medium', completed: true, due: 'Yesterday' },
    { id: 3, title: 'Update personal emergency contact details', priority: 'low', completed: false, due: 'Aug 15' },
    { id: 4, title: 'Complete annual cybersecurity awareness quiz', priority: 'high', completed: false, due: 'Aug 18' }
  ]);

  // Live Timer
  useEffect(() => {
    let interval = null;
    if (isPunchedIn) {
      interval = setInterval(() => {
        setWorkSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn]);

  const formatTimer = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const togglePunchStatus = () => {
    if (isPunchedIn) {
      setIsPunchedIn(false);
    } else {
      setIsPunchedIn(true);
      setPunchTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const toggleTaskCompleted = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleApplyLeaveSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    const newLeave = {
      id: Date.now(),
      type: leaveType,
      from: startDate,
      to: endDate,
      days: 1,
      status: 'Pending'
    };
    setLeaveHistory([newLeave, ...leaveHistory]);
    setShowLeaveModal(false);
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const userName = user?.name || user?.username || 'Employee User';

  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  const getLeaveStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <EmployeeLayout
      user={user}
      onLogout={onLogout}
      isPunchedIn={isPunchedIn}
      togglePunchStatus={togglePunchStatus}
    >
      <div className="relative min-h-full p-6 sm:p-8 flex flex-col gap-6 items-center">
        {/* Ambient Lighting Orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute rounded-full blur-[140px] opacity-35 w-[500px] h-[500px] bg-emerald-200/70 -top-28 -right-24"></div>
          <div className="absolute rounded-full blur-[140px] opacity-35 w-[450px] h-[450px] bg-teal-200/70 -bottom-36 -left-20"></div>
        </div>

        {/* Main Content */}
        <main className="relative z-10 w-full max-w-[1350px] flex flex-col gap-6">
          {/* Hero Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-900/5 gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 m-0">Good Day, {userName.split(' ')[0]}! 👋</h1>
              <p className="text-sm text-slate-500 mt-1">Here is your daily work summary, attendance status, and pending tasks.</p>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <div className="text-2xl font-bold font-mono text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-200">{formatTimer(workSeconds)}</div>
              <div className="text-xs text-slate-400 mt-1">
                {isPunchedIn ? `Logged in at ${punchTime}` : 'Currently Clocked Out'}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-500">Attendance Rate</span>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg">📅</div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">96.8%</div>
              <div className="text-xs text-slate-400">21 Days Present this month</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-500">Leave Balance</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">🏖️</div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">14 Days</div>
              <div className="text-xs text-slate-400">10 Paid / 4 Sick leaves available</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-500">Work Hours Logged</span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">⏱️</div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">38.5 hrs</div>
              <div className="text-xs text-slate-400">Target: 40.0 hrs / week</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-500">My Tasks</span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">📋</div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{tasks.filter(t => !t.completed).length} Pending</div>
              <div className="text-xs text-slate-400">{tasks.filter(t => t.completed).length} Completed</div>
            </div>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div className="flex flex-col gap-6">
              {/* Tasks Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <span className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"></path>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    My Tasks & Action Items
                  </span>
                  <span className="text-xs text-slate-400">
                    {tasks.filter(t => t.completed).length}/{tasks.length} Completed
                  </span>
                </div>

                <div className="flex flex-col divide-y divide-slate-100">
                  {tasks.map(task => (
                    <div key={task.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4.5 h-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          checked={task.completed}
                          onChange={() => toggleTaskCompleted(task.id)}
                        />
                        <span className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${getPriorityBadgeStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-slate-400">
                          Due: {task.due}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leave History Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <span className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    My Leave Requests & History
                  </span>

                  <button
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    onClick={() => setShowLeaveModal(true)}
                  >
                    + Apply New Leave
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                        <th className="py-3 px-4">Leave Type</th>
                        <th className="py-3 px-4">From Date</th>
                        <th className="py-3 px-4">To Date</th>
                        <th className="py-3 px-4">Days</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leaveHistory.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{item.type}</td>
                          <td className="py-3.5 px-4 text-slate-600">{item.from}</td>
                          <td className="py-3.5 px-4 text-slate-600">{item.to}</td>
                          <td className="py-3.5 px-4 text-slate-600">{item.days} Day(s)</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getLeaveStatusStyle(item.status)}`}>
                              ● {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column / Announcements */}
            <div className="flex flex-col gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="mb-4 pb-3 border-b border-slate-100">
                  <span className="text-lg font-bold text-slate-900 flex items-center gap-2">📢 Announcements</span>
                </div>
                <div className="flex flex-col gap-3.5">
                  <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-600">
                    <div className="font-semibold text-sm text-slate-900">Annual All-Hands Meeting</div>
                    <div className="text-xs text-slate-500 mt-1">Aug 25 at 10:00 AM • Main Auditorium & Virtual</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-600">
                    <div className="font-semibold text-sm text-slate-900">Q3 Performance Appraisals</div>
                    <div className="text-xs text-slate-500 mt-1">Self-evaluation portal opens Sep 01</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Apply Leave Modal */}
        {showLeaveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-7 text-slate-900 shadow-2xl animate-cardFadeUp">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-slate-900">Apply for Time Off</h3>
                <button className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer" onClick={() => setShowLeaveModal(false)}>✕</button>
              </div>

              <form onSubmit={handleApplyLeaveSubmit} className="flex flex-col gap-4">
                <CustomSelect
                  label="Leave Category"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  options={[
                    { value: 'Paid Leave', label: 'Paid Annual Leave' },
                    { value: 'Sick Leave', label: 'Medical / Sick Leave' },
                    { value: 'Casual Leave', label: 'Casual Leave' },
                    { value: 'Unpaid Leave', label: 'Unpaid Leave' }
                  ]}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Start Date</label>
                    <input
                      type="date"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">End Date</label>
                    <input
                      type="date"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Reason / Note</label>
                  <textarea
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    rows="3"
                    placeholder="Briefly state reason for leave request..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                    onClick={() => setShowLeaveModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    Submit Leave Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
