import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAPI } from '../services/api';

const AddPatient = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [contactInfo, setContactInfo] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await patientAPI.create({ name, age: parseInt(age), gender, contact_info: contactInfo });
            navigate('/patients');
        } catch (error) {
            console.error('Failed to add patient:', error);
        }
    };

    return (
        <div className="max-w-xl mx-auto glass-panel p-8 rounded-lg shadow mt-10">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Add New Patient</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Age</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Contact Info (Phone/Email)</label>
                    <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="e.g. 555-1234 or email@example.com" />
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Add Patient
                </button>
            </form>
        </div>
    );
};

export default AddPatient;