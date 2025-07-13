from flask import Flask, request, jsonify, session
from flask_cors import CORS
import pandas as pd
import os
import io
import tempfile

app = Flask(__name__)
CORS(app)
app.secret_key='abcdef98765'

@app.route("/preview", methods=["POST"])
def preview():    
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    
    try:
        # Create a temporary file to save the uploaded file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xls') as tmp_file:
            file.save(tmp_file.name)
            tmp_file_path = tmp_file.name
        
        # Read the Excel file from the temporary file
        df = pd.read_excel(tmp_file_path)

        # Store the DataFrame in the sessions
        session['df_csv'] = df.to_csv(index=False)
        
        # Clean up the temporary file
        os.unlink(tmp_file_path)
        
        preview_data = df.head(50).to_dict(orient="records")
        
        print(f"Successfully processed file with {len(df)} rows and {len(df.columns)} columns")
        
        return jsonify({
            "columns": df.columns.tolist(),
            "preview": preview_data
        })
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route("/clean", methods=["GET"])
def clean_data():
    if 'df_csv' not in session:
        return jsonify({"error": "No data found in session. Please upload a file first."}), 400

    try:
        # Load DataFrame from session
        df = pd.read_csv(io.StringIO(session['df_csv']))

        # Step 1: Remove completely empty rows and columns
        df.dropna(axis=0, how='all', inplace=True)  # remove empty rows
        df.dropna(axis=1, how='all', inplace=True)  # remove empty columns

        # Step 2: Fill missing values
        for col in df.columns:
            if df[col].dtype == 'object':
                df[col].fillna('Unknown', inplace=True)
            else:
                median = df[col].median()
                df[col].fillna(median, inplace=True)

        # Save cleaned data back to session
        session['df_csv'] = df.to_csv(index=False)

        print(f"Data cleaned. New shape: {df.shape}")
        
        return jsonify({
            "shape": {"rows": df.shape[0], "columns": df.shape[1]},
            "columns": df.columns.tolist(),
            "preview": df.head(50).to_dict(orient="records")
        })

    except Exception as e:
        print(f"Error cleaning data: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')