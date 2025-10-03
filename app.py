# requestbin/app.py
from flask import Flask, render_template
from bin.routes import bin_bp

def create_app():
    app = Flask(__name__, template_folder='templates') # Set root template folder
    # A secret key is needed for security features, though not critical for this demo
    app.config['SECRET_KEY'] = 'a_very_secret_key_for_demo' 
    
    # Register the Blueprint
    app.register_blueprint(bin_bp, url_prefix='/bin')

    # Add a simple root route for an About page (as requested)
    @app.route('/')
    def about():
        # Renders the about page using the base layout
        return render_template('about.html')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=8000)