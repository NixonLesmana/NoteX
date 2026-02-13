from flask import jsonify

def response_success(data=None, message="Success", status_code=200, meta=None):
    response = {
        "data": data,
        "status": "success",
        "message": message
    }
    if meta is not None:
        response["meta"] = meta
    
    return jsonify(response), status_code

def response_error(message="An error occurred", status_code=400, hint=None):
    response = {
        "status": "error",
        "message": message
    }
    if hint is not None:
        response["password hint"] = hint
    return jsonify(response), status_code