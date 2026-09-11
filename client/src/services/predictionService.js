const API_URL = 'http://localhost:8000/api/predictions';

export const predictionService = {
    createPrediction: async (patientId, data) => {
        return { 
            patient_id: patientId, 
            risk_score: 0.75, 
            diagnosis: 'High Risk' 
        };
    },

    getPredictionsByPatientId: async (patientId) => {
        return [
            { id: 1, patient_id: patientId, risk_score: 0.75, diagnosis: 'High Risk', created_at: new Date() }
        ];
    }
};
