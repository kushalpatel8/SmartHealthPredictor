import os
import re
import joblib
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')
DATASETS_DIR = os.path.join(BASE_DIR, 'datasets')

# Global artifacts
rf_model = None
label_encoder = None
all_symptoms = []
df_desc = pd.DataFrame()
df_prec = pd.DataFrame()
tfidf_vectorizer = None
tfidf_matrix = None
MODEL_LOADED = False

def load_or_train_models():
    global rf_model, label_encoder, all_symptoms, df_desc, df_prec, tfidf_vectorizer, tfidf_matrix, MODEL_LOADED
    try:
        desc_path = os.path.join(DATASETS_DIR, 'symptom_Description.csv')
        if os.path.exists(desc_path):
            df_desc = pd.read_csv(desc_path)
            df_desc['Disease_Clean'] = df_desc['Disease'].astype(str).str.strip().str.lower()
            
            # Pre-compute TF-IDF matrix for semantic matching
            tfidf_vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
            tfidf_matrix = tfidf_vectorizer.fit_transform(df_desc['Description'].fillna('').astype(str))
        else:
            df_desc = pd.DataFrame(columns=['Disease', 'Description', 'Disease_Clean'])
            
        prec_path = os.path.join(DATASETS_DIR, 'symptom_precaution.csv')
        if os.path.exists(prec_path):
            df_prec = pd.read_csv(prec_path)
            df_prec['Disease_Clean'] = df_prec['Disease'].astype(str).str.strip().str.lower()
        else:
            df_prec = pd.DataFrame(columns=['Disease', 'Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4', 'Disease_Clean'])
    except Exception as e:
        print(f"Notice: CSV metadata loading error: {e}")

    model_path = os.path.join(MODEL_DIR, 'symptoms_rf_model.pkl')
    encoder_path = os.path.join(MODEL_DIR, 'symptoms_encoder.pkl')
    features_path = os.path.join(MODEL_DIR, 'symptoms_features.pkl')

    if os.path.exists(model_path) and os.path.exists(encoder_path) and os.path.exists(features_path):
        try:
            rf_model = joblib.load(model_path)
            label_encoder = joblib.load(encoder_path)
            all_symptoms = joblib.load(features_path)
            MODEL_LOADED = True
            return
        except Exception as e:
            print(f"Warning: Error loading pre-existing symptom model: {e}")

    # Train model on dataset.csv
    dataset_file = os.path.join(DATASETS_DIR, 'dataset.csv')
    if os.path.exists(dataset_file):
        try:
            from sklearn.preprocessing import LabelEncoder
            from sklearn.ensemble import RandomForestClassifier

            df = pd.read_csv(dataset_file)
            symptom_columns = [col for col in df.columns if col.startswith('Symptom')]
            all_symps_set = set()
            for col in symptom_columns:
                for val in df[col].dropna().unique():
                    cleaned = str(val).strip().lower().replace(' ', '_')
                    if cleaned:
                        all_symps_set.add(cleaned)
            
            all_symptoms = sorted(list(all_symps_set))
            X_list = []
            y_list = []
            for _, row in df.iterrows():
                disease = str(row['Disease']).strip()
                row_symps = set(str(row[c]).strip().lower().replace(' ', '_') for c in symptom_columns if pd.notna(row[c]))
                vec = [1 if s in row_symps else 0 for s in all_symptoms]
                X_list.append(vec)
                y_list.append(disease)

            X = np.array(X_list)
            label_encoder = LabelEncoder()
            y = label_encoder.fit_transform(y_list)

            rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
            rf_model.fit(X, y)

            os.makedirs(MODEL_DIR, exist_ok=True)
            joblib.dump(rf_model, model_path)
            joblib.dump(label_encoder, encoder_path)
            joblib.dump(all_symptoms, features_path)

            MODEL_LOADED = True
            print("Successfully trained and loaded symptom Random Forest model.")
            return
        except Exception as e:
            print(f"Error training symptom ML model: {e}")

    MODEL_LOADED = True if not df_desc.empty else False

load_or_train_models()


def predict_disease_from_symptoms(symptoms: list[str], description: str = None) -> dict:
    """
    Predict disease based on reported symptoms and/or paragraph description using
    a hybrid Random Forest and TF-IDF Semantic Engine.
    """
    symptoms_list = [str(s).strip() for s in (symptoms or []) if str(s).strip()]
    raw_desc = (description or "").strip()
    full_text = " ".join(symptoms_list) + (" " + raw_desc if raw_desc else "")
    full_text_lower = full_text.lower()

    if not full_text.strip():
        return {
            "disease": "Unknown",
            "confidence_score": 0.0,
            "recommendations": ["Please provide at least one symptom or describe your symptoms."],
            "urgency": "Low"
        }

    # 1. Semantic Similarity Assessment via TF-IDF
    best_semantic_disease = None
    best_semantic_score = 0.0

    if tfidf_vectorizer is not None and tfidf_matrix is not None and not df_desc.empty:
        try:
            query_vec = tfidf_vectorizer.transform([full_text])
            similarities = cosine_similarity(query_vec, tfidf_matrix)[0]
            best_idx = int(np.argmax(similarities))
            best_semantic_score = float(similarities[best_idx])
            best_semantic_disease = df_desc.iloc[best_idx]['Disease']
        except Exception as e:
            print(f"TF-IDF similarity calculation notice: {e}")

    # 2. Symptom Feature Vector Matching for Random Forest
    rf_disease = None
    rf_confidence = 0.0
    symptoms_matched = 0

    if rf_model is not None and all_symptoms:
        X = np.zeros((1, len(all_symptoms)))
        normalized_text = full_text_lower.replace(' ', '_').replace('-', '_')
        
        # Word boundary tokens
        words = set(re.findall(r'\b[a-z0-9_]+\b', normalized_text))

        for idx, symp in enumerate(all_symptoms):
            symp_clean = symp.strip().lower()
            symp_spaced = symp_clean.replace('_', ' ')
            
            # Exact match or token containment
            if (symp_clean in normalized_text or 
                symp_spaced in full_text_lower or 
                symp_clean in words or 
                any(symp_clean == s.lower().replace(' ', '_') for s in symptoms_list)):
                X[0, idx] = 1
                symptoms_matched += 1

        if symptoms_matched > 0:
            try:
                pred_idx = rf_model.predict(X)[0]
                pred_probs = rf_model.predict_proba(X)[0]
                rf_confidence = float(pred_probs[pred_idx])
                rf_disease = str(label_encoder.inverse_transform([pred_idx])[0]).strip()
            except Exception as e:
                print(f"RF prediction notice: {e}")

    # 3. Decision Logic: Combine Semantic & RF Output
    # If the semantic similarity is strong (e.g. description matches a known condition definition like Pneumonia),
    # or if RF has no matched features, prioritize the semantic match.
    if best_semantic_disease and (best_semantic_score >= 0.25 or symptoms_matched == 0):
        if symptoms_matched == 0 or best_semantic_score >= 0.40 or rf_confidence < 0.5:
            final_disease = best_semantic_disease
            final_confidence = min(0.98, max(best_semantic_score, 0.75))
        else:
            final_disease = rf_disease or best_semantic_disease
            final_confidence = max(rf_confidence, best_semantic_score)
    elif rf_disease and symptoms_matched > 0:
        final_disease = rf_disease
        final_confidence = min(0.99, rf_confidence)
    else:
        return {
            "disease": "Inconclusive / Unknown Condition",
            "confidence_score": 0.0,
            "recommendations": [
                "The symptoms or description provided did not match known medical patterns.",
                "Please provide specific symptoms (e.g. 'cough', 'fever', 'chest pain') or consult a doctor."
            ],
            "urgency": "Low"
        }

    # 4. Lookup Medical Descriptions and Precautions
    disease_clean = str(final_disease).strip().lower()
    recommendations = []
    urgency = "Low"

    try:
        if not df_desc.empty and 'Disease_Clean' in df_desc.columns:
            desc_matches = df_desc[df_desc['Disease_Clean'] == disease_clean]
            if not desc_matches.empty:
                disease_desc = desc_matches.iloc[0]['Description']
                if pd.notna(disease_desc):
                    recommendations.append(f"Condition Info: {disease_desc}")

        if not df_prec.empty and 'Disease_Clean' in df_prec.columns:
            prec_matches = df_prec[df_prec['Disease_Clean'] == disease_clean]
            if not prec_matches.empty:
                precs = prec_matches.iloc[0][['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']].dropna().tolist()
                recommendations.extend([str(p).strip().title() for p in precs if str(p).strip()])

        # Urgency scoring
        urgent_keywords = ['hospital', 'emergency', 'immediate', 'doctor', 'antibiotic', 'oxygen']
        all_rec_text = " ".join(recommendations).lower()
        if any(uk in all_rec_text for uk in urgent_keywords) or final_confidence >= 0.85:
            urgency = "High" if ("emergency" in all_rec_text or "hospital" in all_rec_text) else "Medium"
        elif final_confidence >= 0.7:
            urgency = "Medium"
    except Exception as e:
        print(f"Precautions lookup error: {e}")

    if not recommendations:
        recommendations.append("Please consult a certified healthcare professional for clinical examination.")

    return {
        "disease": str(final_disease).strip().title(),
        "confidence_score": round(float(final_confidence), 2),
        "recommendations": recommendations,
        "urgency": urgency
    }