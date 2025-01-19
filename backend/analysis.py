import pandas as pd

def load_data(file_path):
    """Load the dataset into a pandas DataFrame."""
    try:
        df = pd.read_csv(file_path)
        return df
    except FileNotFoundError:
        raise Exception("Dataset not found. Ensure the file path is correct.")

def analyze_data(df):
    """Perform data analysis and return a summary."""
    # Analysis over years (using 'Crop_Year' and 'Yield')
    yearly_summary = df.groupby('Crop_Year').agg({
        'Yield': ['mean', 'sum', 'count']
    }).reset_index()
    yearly_summary.columns = ['Year', 'Average Yield', 'Total Yield', 'Data Points']

    # Analysis by crop
    crop_summary = df.groupby('Crop').agg({
        'Yield': ['mean', 'sum', 'count'],
        'Area': 'sum',
        'Production': 'sum'
    }).reset_index()
    crop_summary.columns = ['Crop', 'Average Yield', 'Total Yield', 'Data Points', 'Total Area', 'Total Production']

    # Return as a dictionary for JSON serialization
    return {
        "yearly_summary": yearly_summary.to_dict(orient="records"),
        "crop_summary": crop_summary.to_dict(orient="records"),
        "columns": df.columns.tolist()
    }

# Example usage
# file_path = 'path_to_file.csv'
# df = load_data(file_path)
# result = analyze_data(df)
# print(result)
