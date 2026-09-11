import { useState, useCallback } from 'react';
import { predictionService } from '../services/predictionService';

export const usePrediction = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const makePrediction = useCallback(async (patientId, data) => {
        setLoading(true);
        setError(null);
        try {
            const prediction = await predictionService.createPrediction(patientId, data);
            setResult(prediction);
            return prediction;
        } catch (err) {
            setError(err.message || 'Failed to make prediction');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { makePrediction, loading, error, result };
};
