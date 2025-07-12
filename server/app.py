from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import tempfile

app = Flask(__name__)
CORS(app)

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

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')