import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { patientAPI } from '../services/api';
import { Users, FileText, Activity, Plus, HeartPulse, Stethoscope, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '@clerk/clerk-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalPatients: 0 });
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await patientAPI.getAll();
        setStats({ totalPatients: res.data.length });
      } catch (error) {
        console.error('Failed to fetch patients', error);
      }
    };
    fetchStats();
  }, []);

  const data = [
    { name: 'Mon', patients: 4 },
    { name: 'Tue', patients: 3 },
    { name: 'Wed', patients: 7 },
    { name: 'Thu', patients: 2 },
    { name: 'Fri', patients: 6 },
    { name: 'Sat', patients: 1 },
    { name: 'Sun', patients: 0 },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 p-8 sm:p-10 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Welcome back, {user?.firstName || 'Doctor'}! 👋
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Here's what's happening in your clinic today. You have {stats.totalPatients} registered patients and the system is running smoothly.
          </p>
        </div>
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <Activity size={300} />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate('/add-patient')}
            className="group flex flex-col items-start p-6 glass-panel dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Add Patient</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1">Register a new patient into the system to begin tracking.</p>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              Get Started <ArrowRight size={16} />
            </span>
          </button>

          <button 
            onClick={() => navigate('/prediction')}
            className="group flex flex-col items-start p-6 glass-panel dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-purple-500/50 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HeartPulse size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Risk Prediction</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1">Run AI-powered risk assessment for cardiovascular diseases.</p>
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              Analyze Risk <ArrowRight size={16} />
            </span>
          </button>

          <button 
            onClick={() => navigate('/symptom-checker')}
            className="group flex flex-col items-start p-6 glass-panel dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Stethoscope size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Symptom Checker</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1">Identify potential diseases based on reported symptoms.</p>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              Check Symptoms <ArrowRight size={16} />
            </span>
          </button>
        </div>
      </div>

      {/* Stats and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Patients</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalPatients}</h3>
            </div>
            <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400 flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <Users size={28} />
            </div>
          </div>
          
          <div className="glass-panel dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Predictions Run</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">1,492</h3>
            </div>
            <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400 flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <FileText size={28} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Patient Influx (This Week)</h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">+12% vs last week</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="patients" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
