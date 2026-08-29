class HeartDiseaseModel:
    def __init__(self):
        self.model = None # Load from .pkl in production

    def predict(self, features):
        # Placeholder prediction logic
        return {"risk_score": 0.45, "diagnosis": "Moderate Risk"}
