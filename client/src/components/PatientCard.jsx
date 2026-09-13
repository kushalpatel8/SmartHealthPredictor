import React from 'react';

const PatientCard = ({ patient }) => {
    return (
        <div className="glass-panel p-4 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">{patient?.name || 'Unknown Patient'}</h3>
            <p className="text-sm text-slate-500">Age: {patient?.age || 'N/A'}</p>
            <p className="text-sm text-slate-500">Gender: {patient?.gender || 'N/A'}</p>
        </div>
    );
};

export default PatientCard;
