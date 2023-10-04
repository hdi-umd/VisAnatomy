# Setup Instructions
## Setting up the virtual environment
You'll first need to create a virtual environment to run the Flask application. First, navigate to the directory where this repo has been cloned. Then run the following command in your terminal ```python -m venv venv```

This will create a virtual environment named "venv" contained in a folder named *venv* in the parent directory. Next, you active the virtual environment with the following command 
```source venv/bin/activate```

## Installing relevant packages
To install all the relevant packages, run ```pip install -r requirements.txt``` in the terminal

## Running Flask app
Finally, run ```flask run``` in the terminal to start an instance of the flask app. The interface should now be accessible in your browser at ```http://127.0.0.1:5000``` or ```http://localhost:5000```
