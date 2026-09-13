import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { patientAPI, predictionAPI } from '../services/api';
import { User, Phone, Mail, Calendar, Activity, ArrowLeft, Trash2 } from 'lucide-react';

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [patientRes, historyRes] = await Promise.all([
                    patientAPI.getById(id),
                    predictionAPI.getHistory(id)
                ]);
                setPatient(patientRes.data);
                setHistory(historyRes.data);
            } catch (error) {
                console.error('Error fetching patient details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
            try {
                await patientAPI.delete(id);
                navigate('/patients');
            } catch (error) {
                console.error('Failed to delete patient', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Patient not found</h2>
                <Link to="/patients" className="text-primary-600 hover:underline mt-4 inline-block">Return to Patients List</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/patients" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="text-slate-600 dark:text-slate-400" />
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Patient Profile</h1>
                </div>
                <button 
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg font-medium transition-colors border border-red-200 dark:border-red-800"
                >
                    <Trash2 size={18} />
                    Delete Patient
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1 glass-panel dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                    <div className="text-center">
                        <div className="h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-4xl flex items-center justify-center mx-auto mb-4">
                            {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{patient.name}</h2>
                        <p className="text-slate-500 dark:text-slate-400">ID: {patient.id.slice(-6)}</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <Calendar size={18} className="text-slate-400" />
                            <span>{patient.age ? `${patient.age} years old` : 'Age N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <User size={18} className="text-slate-400" />
                            <span className="capitalize">{patient.gender || 'Gender N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <Phone size={18} className="text-slate-400" />
                            <span>{patient.contact_info || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* History & Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="glass-panel dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Medical History</h3>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                            {patient.medical_history || 'No medical history provided.'}
                        </p>
                    </div>

                    <div className="glass-panel dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Prediction History</h3>
                            <Link to="/prediction" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                Run New Prediction
                            </Link>
                        </div>
                        
                        {history.length > 0 ? (
                            <div className="space-y-4">
                                {history.map((record) => (
                                    <div key={record.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-start gap-4">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                            <Activity size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                                    {record.result.diagnosis || 'Analysis Completed'}
                                                </h4>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(record.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 grid grid-cols-2 gap-2">
                                                <div>Risk Score: <span className="font-medium text-slate-900 dark:text-white">{((record.result.risk_score || 0) * 100).toFixed(1)}%</span></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                <p>No AI predictions run for this patient yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;
