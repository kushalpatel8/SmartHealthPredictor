import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { patientAPI } from '../services/api.js';
import { Plus, Search, ChevronRight, Users, Trash2 } from 'lucide-react';
const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await patientAPI.getAll();
      setPatients(res.data);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientAPI.delete(id);
        fetchPatients();
      } catch (error) {
        console.error('Failed to delete patient', error);
      }
    }
  };

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patients</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage patient records and run risk predictions.</p>
        </div>
        <Link to="/add-patient" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto justify-center">
          <Plus size={20} />
          Add Patient
        </Link>
      </div>

      <div className="glass-panel dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search patients by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading patients...</div>
        ) : filteredPatients.length > 0 ? (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredPatients.map((patient) => (
              <div 
                key={patient.id} 
                onClick={() => navigate(`/patients/${patient.id}`)}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold flex items-center justify-center">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {patient.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {patient.contact_info || 'No contact info provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleDelete(e, patient.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                    title="Delete Patient"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No patients found</h3>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Try adjusting your search or add a new patient.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
