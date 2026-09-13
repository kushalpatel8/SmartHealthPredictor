import React, { useState } from 'react';

const PredictionForm = ({ onSubmit, loading }) => {
    const [data, setData] = useState({ 
        age: '',
        bloodPressure: '', 
        cholesterol: '',
        fasting_bs: '0',
        exercise_angina: '0',
        major_vessels: '0',
        oldpeak: '0'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md glass-panel p-6 rounded-lg shadow border border-slate-200">
            <h2 className="text-xl font-bold mb-4 text-slate-800">New Prediction</h2>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input 
                        type="number" 
                        value={data.age}
                        onChange={(e) => setData({...data, age: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 45"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Blood Pressure</label>
                    <input 
                        type="number" 
                        value={data.bloodPressure}
                        onChange={(e) => setData({...data, bloodPressure: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 120"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cholesterol</label>
                    <input 
                        type="number" 
                        value={data.cholesterol}
                        onChange={(e) => setData({...data, cholesterol: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Oldpeak (ST Dep)</label>
                    <input 
                        type="number" 
                        step="0.1"
                        value={data.oldpeak}
                        onChange={(e) => setData({...data, oldpeak: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 1.0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Major Vessels (0-4)</label>
                    <input 
                        type="number" 
                        min="0"
                        max="4"
                        value={data.major_vessels}
                        onChange={(e) => setData({...data, major_vessels: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fasting Blood Sugar</label>
                    <select 
                        value={data.fasting_bs}
                        onChange={(e) => setData({...data, fasting_bs: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="0">&lt;= 120 mg/dl</option>
                        <option value="1">&gt; 120 mg/dl</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Exercise Induced Angina</label>
                    <select 
                        value={data.exercise_angina}
                        onChange={(e) => setData({...data, exercise_angina: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 transition-colors"
            >
                {loading ? 'Predicting...' : 'Generate Prediction'}
            </button>
        </form>
    );
};

export default PredictionForm;
