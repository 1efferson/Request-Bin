# requestbin/app.py
from flask import Flask, render_template
from bin.routes import bin_bp

def create_app():
    app = Flask(__name__, template_folder='templates') # root template folder

    
    app.config['SECRET_KEY'] = 'a_very_secret_key_for_demo' # later use
    
    # Register the Blueprint
    app.register_blueprint(bin_bp, url_prefix='/bin')

    # root route for About page 
    @app.route('/')
    def about():
        # Renders the about page using the base layout
        return render_template('about.html')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=8000)