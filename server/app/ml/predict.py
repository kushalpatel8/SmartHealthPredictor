from app.ml.models.heart import HeartDiseaseModel
from app.ml.models.others import GeneralDiseaseModel

def generate_prediction(features: dict, model_type: str = "heart") -> dict:
    if model_type == "heart":
        model = HeartDiseaseModel()
        return model.predict(features)
    else:
        model = GeneralDiseaseModel()
        return model.predict(features)