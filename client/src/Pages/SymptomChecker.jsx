import React, { useState } from 'react';
import { symptomAPI } from '../services/api';
import { Activity, Plus, X, AlertCircle, CheckCircle2, Loader2, Stethoscope, AlertTriangle } from 'lucide-react';

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState([]);
    const [currentSymptom, setCurrentSymptom] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleAddSymptom = (e) => {
        e.preventDefault();
        const trimmed = currentSymptom.trim();
        if (trimmed && !symptoms.includes(trimmed)) {
            setSymptoms([...symptoms, trimmed]);
            setCurrentSymptom('');
        }
    };

    const removeSymptom = (indexToRemove) => {
        setSymptoms(symptoms.filter((_, index) => index !== indexToRemove));
    };

    const handlePredict = async () => {
        if (symptoms.length === 0 && !description.trim()) {
            setError("Please add at least one symptom or a description.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await symptomAPI.predict({ symptoms, description });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || "An error occurred during prediction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Symptom Checker</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Enter your symptoms to get an AI-powered preliminary diagnosis.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="glass-panel p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
                        Are you experiencing any other symptoms?
                    </h2>
                    
                    <form onSubmit={handleAddSymptom} className="space-y-4 mb-8">
                        <input
                            type="text"
                            value={currentSymptom}
                            onChange={(e) => setCurrentSymptom(e.target.value)}
                            placeholder="Input your symptom:"
                            className="w-full px-4 py-3 glass-panel border-2 border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-primary-600 transition-colors placeholder:text-slate-400"
                        />
                        <div className="flex gap-4">
                            <button 
                                type="submit"
                                disabled={!currentSymptom.trim()}
                                className="flex-1 bg-primary-600 text-white font-medium py-2.5 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                Add Symptom
                            </button>
                            <button 
                                type="button"
                                onClick={() => setCurrentSymptom('')}
                                className="flex-1 glass-panel border-2 border-slate-300 text-slate-600 font-medium py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </form>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-900 mb-3">Added Symptoms:</label>
                        <div className="min-h-16 p-4 border-2 border-slate-200 rounded-xl bg-slate-50 flex flex-wrap gap-2 content-start">
                            {symptoms.length === 0 ? (
                                <span className="text-slate-400 text-sm">No symptoms added yet.</span>
                            ) : (
                                symptoms.map((symptom, index) => (
                                    <div key={index} className="flex items-center gap-2 glass-panel border border-slate-300 px-3 py-1.5 rounded-full shadow-sm text-sm font-medium text-slate-700 group">
                                        {symptom}
                                        <button 
                                            type="button"
                                            onClick={() => removeSymptom(index)}
                                            className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-900 mb-2">Detailed Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe how you are feeling in your own words..."
                            className="w-full px-4 py-3 glass-panel border-2 border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-primary-600 transition-colors h-24 resize-none placeholder:text-slate-400"
                        />
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <AlertCircle className="text-red-500 mt-0.5" size={20} />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <button 
                        onClick={handlePredict}
                        disabled={(symptoms.length === 0 && !description.trim()) || loading}
                        className="w-full bg-primary-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-primary-700 focus:outline-none disabled:bg-slate-300 transition-colors flex items-center justify-center gap-2 text-lg shadow-md hover:shadow-lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={24} className="animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Activity size={24} />
                                Next Step
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                <div className="glass-panel p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Diagnosis Results</h3>
                    
                    {result ? (
                        <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className={`p-6 rounded-xl border-2 ${result.urgency === 'High' ? 'bg-red-50 border-red-200' : result.urgency === 'Medium' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-bold uppercase tracking-wider text-slate-600">Predicted Condition</p>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${result.urgency === 'High' ? 'bg-red-100 text-red-700' : result.urgency === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {result.urgency === 'High' ? 'URGENT - CONTACT PROVIDER' : result.urgency === 'Medium' ? 'REVIEW RECOMMENDED' : 'SAFE / NORMAL'}
                                    </span>
                                </div>
                                <div className="text-3xl font-black text-slate-900">
                                    {result.disease}
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <p className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                                    <span>AI Confidence Score</span>
                                    <span className="font-black text-lg text-primary-700">{(result.confidence_score * 100).toFixed(0)}%</span>
                                </p>
                                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="bg-primary-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                                        style={{ width: `${result.confidence_score * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-900 mb-3">Recommendations</h4>
                                <ul className="space-y-3">
                                    {(result.recommendations || []).map((rec, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-primary-500 shrink-0"></div>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 mt-auto">
                                <AlertTriangle className="text-slate-500 mt-0.5" size={20} />
                                <p className="text-slate-600 text-xs font-medium leading-relaxed">
                                    This prediction is generated by an AI model and is for informational purposes only. It does not constitute medical advice. Please consult a qualified healthcare provider for an accurate diagnosis.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <Stethoscope size={48} className="mb-4 opacity-30 text-slate-400" />
                            <p className="font-medium text-slate-500">Add symptoms and predict to view AI generated diagnosis results.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SymptomChecker;
