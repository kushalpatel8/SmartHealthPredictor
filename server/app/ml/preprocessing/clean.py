import pandas as pd

def handle_missing_data(df : pd.DataFrame) -> pd.DataFrame:
    return df.dropna

def remove_outliers(df: pd.DataFrame) -> pd.DataFrame:
    return df