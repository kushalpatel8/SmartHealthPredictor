def train_heart_model(dataset_path: str):
    print(f"Training heart model on {dataset_path}...")
    return {"status": "success", "accuracy" :0.85}

if __name__  == "__main__":
    train_heart_model("../datasets/heart-disease.csv")