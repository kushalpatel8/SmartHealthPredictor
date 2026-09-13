import React from 'react';

const PatientTable = ({ patients = [] }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full glass-panel border border-slate-200 rounded-lg shadow-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-500">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-500">Age</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-500">Gender</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {patients.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                            <td className="px-4 py-2 text-sm text-slate-700">{p.name}</td>
                            <td className="px-4 py-2 text-sm text-slate-700">{p.age}</td>
                            <td className="px-4 py-2 text-sm text-slate-700">{p.gender}</td>
                        </tr>
                    ))}
                    {patients.length === 0 && (
                        <tr>
                            <td colSpan="3" className="px-4 py-4 text-center text-slate-500 text-sm">No patients found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PatientTable;
