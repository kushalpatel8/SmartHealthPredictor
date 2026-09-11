const API_URL = 'http://localhost:8000/api/patients';

export const patientService = {
    getAllPatients: async () => {
        // Placeholder
        return [
            { id: 1, name: 'John Doe', age: 45, gender: 'Male' },
            { id: 2, name: 'Jane Smith', age: 32, gender: 'Female' }
        ];
    },

    getPatientById: async (id) => {
        return { id, name: 'John Doe', age: 45, gender: 'Male' };
    },

    createPatient: async (patientData) => {
        return { id: 3, ...patientData };
    }
};
