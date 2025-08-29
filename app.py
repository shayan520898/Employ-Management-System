from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from bson.errors import InvalidId
from werkzeug.utils import secure_filename
import os
import uuid
import secrets


app = Flask(__name__)
app.secret_key = 'your_secret_key'
CORS(app, origins=["http://172.16.3.174:3000"], supports_credentials=True)

app.config.update(
    SESSION_COOKIE_SAMESITE="Lax", 
    SESSION_COOKIE_SECURE=False
)

# MongoDB setup
client = MongoClient("mongodb+srv://-/")
db = client["data"]
collection = db["value"]

# Upload folder and allowed extensions
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ------------------ Utility ------------------

def parse_nested_form_data(form):
    """
    Parses flat form keys like private_details[name] into nested dicts.
    """
    data = {}
    for key in form:
        if '[' in key and ']' in key:
            base, sub = key.split('[')
            sub = sub.strip(']')
            if base not in data:
                data[base] = {}
            data[base][sub] = form[key]
        else:
            data[key] = form[key]
    return data

# ------------------ Serve Uploaded Images ------------------

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ------------------ Employee Routes ------------------

@app.route('/api/employee', methods=['POST'])
def save_employee():
    try:
        data = dict(request.form)
        files = request.files.getlist('images')
        image_filenames = []

        for file in files:
            if file and allowed_file(file.filename):
                ext = file.filename.rsplit('.', 1)[1].lower()
                unique_name = f"{uuid.uuid4().hex}.{ext}"
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_name)
                file.save(file_path)
                image_filenames.append(unique_name)

        data['images'] = image_filenames
        result = collection.insert_one(data)
        return jsonify({"message": "Employee saved", "id": str(result.inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/employee/<id>', methods=['GET'])
def get_employee(id):
    try:
        employee = collection.find_one({"_id": ObjectId(id)})
        if not employee:
            return jsonify({"error": "Employee not found"}), 404
        employee["_id"] = str(employee["_id"])
        return jsonify(employee)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/employee/<id>', methods=['DELETE'])
def delete_employee(id):
    try:
        result = collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Employee deleted"})
        else:
            return jsonify({"error": "Employee not found"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid ID"}), 400

@app.route('/api/employee/<id>', methods=['POST'])
def update_employee(id):
    try:
        employee = collection.find_one({"_id": ObjectId(id)})
        if not employee:
            return jsonify({"error": "Employee not found"}), 404

        # Parse nested form data
        form = parse_nested_form_data(request.form)

        existing_images = request.form.getlist('existing_images')
        new_files = request.files.getlist('images')
        image_filenames = []

        # Add back the images user kept
        if existing_images:
            image_filenames.extend(existing_images)

        # Save new uploaded images
        for file in new_files:
            if file and allowed_file(file.filename):
                ext = file.filename.rsplit('.', 1)[1].lower()
                unique_name = f"{uuid.uuid4().hex}.{ext}"
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_name)
                file.save(file_path)
                image_filenames.append(unique_name)

        # Remove deleted images from disk
        old_images = employee.get('images', [])
        removed_images = set(old_images) - set(existing_images)
        for img in removed_images:
            img_path = os.path.join(app.config['UPLOAD_FOLDER'], img)
            if os.path.exists(img_path):
                os.remove(img_path)

        # Update employee with new data and image list
        update_data = {**form, 'images': image_filenames}

        collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        return jsonify({"message": "Employee updated successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/employee', methods=['GET'])
def get_all_employees():
    try:
        employees = list(collection.find())
        for emp in employees:
            emp["_id"] = str(emp["_id"])
        return jsonify(employees)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ Admin Routes ------------------

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if data['username'] == 'shayan' and data['password'] == '123':
        token = secrets.token_hex(16)
        session['admin_token'] = token
        session['admin_logged_in'] = True
        return jsonify({"message": "Login successful", "token": token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_logged_in', None)
    return jsonify({"message": "Logged out"}), 200

@app.route('/api/admin/check', methods=['GET'])
def check_login():
    print("Session content:", dict(session))  # For debugging
    is_logged_in = session.get('admin_logged_in', False)
    if is_logged_in:
        return jsonify({"logged_in": True}), 200
    else:
        return jsonify({"logged_in": False}), 401


# ------------------ Run Server ------------------

if __name__ == '__main__':
    app.run(host='172.16.3.174', port=5000, debug=True)

 
