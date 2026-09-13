import React, { useState, useEffect } from 'react';
import PredictionForm from '../components/PredictionForm';
import { patientAPI, predictionAPI } from '../services/api';
import { AlertCircle, CheckCircle2, Activity } from 'lucide-react';

const Prediction = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await patientAPI.getAll();
                setPatients(res.data);
            } catch (err) {
                console.error("Failed to load patients", err);
            }
        };
        fetchPatients();
    }, []);

    const handlePredict = async (data) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Pass 'anonymous' if no patient is selected
            const res = await predictionAPI.predict(selectedPatientId || 'anonymous', {
                age: parseInt(data.age) || 45,
                gender: 1,
                chest_pain_type: 0,
                resting_bp: parseInt(data.bloodPressure) || 120,
                cholesterol: parseInt(data.cholesterol) || 200,
                fasting_bs: parseInt(data.fasting_bs) || 0,
                resting_ecg: 1,
                max_hr: 150,
                exercise_angina: parseInt(data.exercise_angina) || 0,
                oldpeak: parseFloat(data.oldpeak) || 1.0,
                st_slope: 2,
                major_vessels: parseInt(data.major_vessels) || 0,
                thalassemia: 2
            });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || "An error occurred during prediction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Risk Prediction</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Run an AI-powered health risk assessment for a patient.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="glass-panel dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Patient (Optional)</label>
                        <select 
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                        >
                            <option value="">Anonymous / Quick Check</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <PredictionForm onSubmit={handlePredict} loading={loading} />
                    
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                            <AlertCircle className="text-red-500 mt-0.5" size={20} />
                            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                <div className="lg:pl-4">
                    {result ? (
                        <div className="glass-panel dark:bg-slate-800 p-8 pt-10 rounded-2xl shadow-md border-t-4 border-t-primary-500 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 relative mt-8">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 ring-8 ring-slate-50 dark:ring-slate-900 shadow-sm">
                                <Activity size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2 mt-4">Prediction Results</h2>
                            
                            <div className="mt-8 space-y-6">
                                <div className="text-center p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Risk Score</p>
                                    <div className="text-5xl font-black text-slate-900 dark:text-white">
                                        {((result.risk_score || 0) * 100).toFixed(1)}<span className="text-2xl text-slate-400">%</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                                    <CheckCircle2 className="text-blue-500 mt-1" size={24} />
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white text-lg">{result.diagnosis || 'Analysis Complete'}</h4>
                                        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                                            Based on the provided health metrics, the AI model has generated the above risk score. Please consult with a specialist for a formal diagnosis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50">
                            <Activity className="text-slate-300 dark:text-slate-600 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400">Awaiting Data</h3>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Select a patient and run a prediction to see the results here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Prediction;
