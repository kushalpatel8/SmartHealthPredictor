import os
import random
import joblib
import pandas as pd
import numpy as np

# Load trained model artifacts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')
DATASETS_DIR = os.path.join(BASE_DIR, 'datasets')

try:
    rf_model = joblib.load(os.path.join(MODEL_DIR, 'symptoms_rf_model.pkl'))
    label_encoder = joblib.load(os.path.join(MODEL_DIR, 'symptoms_encoder.pkl'))
    all_symptoms = joblib.load(os.path.join(MODEL_DIR, 'symptoms_features.pkl'))
    
    # Load descriptions and precautions for lookup
    df_desc = pd.read_csv(os.path.join(DATASETS_DIR, 'symptom_Description.csv'))
    df_desc['Disease'] = df_desc['Disease'].str.strip().str.lower()
    
    df_prec = pd.read_csv(os.path.join(DATASETS_DIR, 'symptom_precaution.csv'))
    df_prec['Disease'] = df_prec['Disease'].str.strip().str.lower()
    
    MODEL_LOADED = True
except Exception as e:
    print(f"Warning: Could not load symptom ML model artifacts. {e}")
    MODEL_LOADED = False

def predict_disease_from_symptoms(symptoms: list[str], description: str = None) -> dict:
    """
    Predict diseases based on a list of symptoms and a text description using a trained Random Forest model.
    """
    # Combine list symptoms and paragraph description text
    all_text = " ".join(symptoms).lower()
    if description:
        all_text += " " + description.lower()
        
    all_text = all_text.replace(' ', '_')
        
    if not all_text.strip():
        return {
            "disease": "Unknown",
            "confidence_score": 0.0,
            "recommendations": ["Please provide at least one symptom or describe how you are feeling."],
            "urgency": "Low"
        }
        
    if not MODEL_LOADED:
        return {
            "disease": "Model Not Loaded",
            "confidence_score": 0.0,
            "recommendations": ["The ML model is currently unavailable."],
            "urgency": "Low"
        }
        
    # Create feature vector
    X = np.zeros((1, len(all_symptoms)))
    
    symptoms_found = 0
    # Match text keywords against the trained one-hot symptom vocabulary
    for idx, symp in enumerate(all_symptoms):
        if symp in all_text:
            X[0, idx] = 1
            symptoms_found += 1
            
    if symptoms_found == 0:
        # Fallback: Try semantic matching against disease descriptions
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity
            
            descriptions = df_desc['Description'].fillna('').tolist()
            diseases = df_desc['Disease'].tolist()
            
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf_matrix = vectorizer.fit_transform(descriptions)
            input_vec = vectorizer.transform([description if description else all_text])
            
            similarities = cosine_similarity(input_vec, tfidf_matrix)[0]
            best_match_idx = np.argmax(similarities)
            best_score = similarities[best_match_idx]
            
            if best_score > 0.3:  # Threshold for semantic match
                disease_name_raw = diseases[best_match_idx]
                predicted_disease_encoded = label_encoder.transform([disease_name_raw])[0]
                disease_name = str(disease_name_raw).title()
                disease_name_lower = str(disease_name_raw).strip().lower()
                confidence = best_score
            else:
                return {
                    "disease": "Unknown Condition",
                    "confidence_score": 0.0,
                    "recommendations": ["We could not map your input to known medical symptoms or descriptions. Please try being more specific."],
                    "urgency": "Low"
                }
        except Exception as e:
            print(f"Semantic fallback failed: {e}")
            return {
                "disease": "Unknown Condition",
                "confidence_score": 0.0,
                "recommendations": ["We could not map your input to known medical symptoms. Please try being more specific (e.g. 'fever', 'chest pain')."],
                "urgency": "Low"
            }
    else:
        # Predict using Random Forest
        pred_idx = rf_model.predict(X)[0]
        pred_probs = rf_model.predict_proba(X)[0]
        
        predicted_disease_encoded = pred_idx
        confidence = pred_probs[pred_idx]
        
        disease_name_raw = label_encoder.inverse_transform([predicted_disease_encoded])[0]
        disease_name = str(disease_name_raw).title()
        disease_name_lower = str(disease_name_raw).strip().lower()
    
    # Lookup descriptions and precautions
    recommendations = []
    urgency = "Low"
    
    try:
        desc_row = df_desc[df_desc['Disease'] == disease_name_lower]
        if not desc_row.empty:
            disease_desc = desc_row.iloc[0]['Description']
            recommendations.append(f"Description: {disease_desc}")
            
        prec_row = df_prec[df_prec['Disease'] == disease_name_lower]
        if not prec_row.empty:
            precs = prec_row.iloc[0][['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']].dropna().tolist()
            recommendations.extend([str(p).title() for p in precs])
            
            # Simple heuristic for urgency
            urgent_keywords = ['hospital', 'doctor', 'emergency', 'immediate']
            if any(uk in str(p).lower() for p in precs for uk in urgent_keywords):
                urgency = "High"
            elif confidence > 0.8:
                urgency = "Medium"
    except Exception as e:
        print(f"Lookup error: {e}")
        recommendations.append("Please consult a healthcare professional.")

    if not recommendations:
         recommendations.append("Please consult a healthcare professional.")

    return {
        "disease": disease_name,
        "confidence_score": round(float(confidence), 2),
        "recommendations": recommendations,
        "urgency": urgency
    }