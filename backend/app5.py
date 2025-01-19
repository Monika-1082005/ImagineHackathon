import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "http://localhost:5174"}})
 # Allow any origin for the chat route

# Load the JSON file at the start of the application
with open("chat_responses.json", "r") as file:
    chat_responses = json.load(file)

@app.route("/chat", methods=["POST"])
def chat():
    # Get user input from request
    user_message = request.json.get("message", "").lower()
    response_data = handle_message(user_message)
    return jsonify(response_data)

def handle_message(message):
    # Iterate over all responses in the JSON file to find the most relevant response
    

    for response in chat_responses:
        if any(keyword in message for keyword in response["keywords"]):
            return {"response": f'{response["answer"]}'}
    
    # Return a default response if no match is found
    return {
        "question": "No relevant question found.",
        "answer": "I'm sorry, I don't have information on that topic right now."
    }

if __name__ == "__main__":
    app.run(debug=True,port=5005)