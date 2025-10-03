from flask import Blueprint, request, render_template, jsonify
import json
from datetime import datetime

# Initialize the Blueprint
bin_bp = Blueprint('bin', __name__, template_folder='templates')

# In-memory storage for captured requests
REQUEST_LOG = []
MAX_LOG_SIZE = 100

# Helper function to save the request data
def log_incoming_request(req):
    """Captures the request details and stores them."""
    global REQUEST_LOG
    
    log_entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'method': req.method,
        'path': req.path,
        # Only capture query params for GET requests, 
        # but capture all available data for the log.
        'headers': dict(req.headers),
        'query_params': dict(req.args),
        'body': req.get_data(as_text=True)
        
    }

    # Insert at the beginning (newest first)
    REQUEST_LOG.insert(0, log_entry) 
    
    # Trim the log if it exceeds the max size
    if len(REQUEST_LOG) > MAX_LOG_SIZE:
        REQUEST_LOG = REQUEST_LOG[:MAX_LOG_SIZE]
    
    # Returning True allows us to use this helper function
    return True

# Route for the capture instructions page (Handles GET requests only)
@bin_bp.route('/demo', methods=['GET'])
def demo_instructions():
    """Logs the GET request and then renders the instructions page."""
 
    log_incoming_request(request)
    
    # Now, render the template as usual
    return render_template('demo.html')


# Route to capture any request (Handles non-GET requests only, which are used to send data)
@bin_bp.route('/demo', methods=['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'])
def capture_request():
    """Captures the request details and stores them."""
    
    # Log the POST/PUT/DELETE request
    log_incoming_request(request)

    # Return a simple response to the sender (e.g., curl or Postman)
    return jsonify({"message": "Request captured successfully!", "method": request.method}), 200


# Route to view the log
@bin_bp.route('/demo/view')
def view_requests():
    """Renders the view page and passes the current log data."""
    global REQUEST_LOG
    return render_template('view.html', requests=REQUEST_LOG)
