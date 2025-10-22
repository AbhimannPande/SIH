# app.py

from flask import Flask, request, jsonify
from hybrid import generate_timetable_hybrid

app = Flask(__name__)

@app.route('/api/generate-timetable', methods=['POST'])
def generate_timetable():
    """
    API endpoint to generate timetables.
    Receives JSON data from the frontend and returns a list of timetable options.
    """
    try:
        # Get the JSON data sent from the frontend
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Invalid JSON data'}), 400
        
        # Call the timetable generation function from your model
        generated_options = generate_timetable_hybrid(data)
        
        # Return the generated options as a JSON response
        return jsonify(generated_options), 200

    except Exception as e:
        # Handle any errors that occur during processing
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, port=5000)