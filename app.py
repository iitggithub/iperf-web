from flask import Flask, render_template, request, Response
import subprocess
import shlex
import re

app = Flask(__name__)

# Function to run a command and stream the output
def run_command(command):
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    while True:
        output = process.stdout.readline().decode('utf-8')
        if output:
            yield output + '<br>'
        elif process.poll() is not None:
            break

# Helper function to sanitize parameters
def sanitize_parameters(parameters):
    sanitized = shlex.split(parameters)  # Split safely without executing
    return sanitized

# Helper function to validate target addresses (e.g., IP or domain)
def validate_target(target):
    # Only allow alphanumeric, dots, hyphens (for domains) and IP addresses
    if re.match(r"^[a-zA-Z0-9.-]+$", target):
        return True
    return False

# Route to display the page
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle form submission and execute selected test
@app.route('/run_test', methods=['POST'])
def run_test():
    print("Form submitted")  # Debugging statement
    test_type = request.form.get('test_type')

    command = []

    if test_type == 'ping':
        target = request.form.get('ping_target')
        # Validate the target address
        if not validate_target(target):
            return Response("Invalid target address.", mimetype='text/plain')
        parameters = request.form.get('ping_parameters', '')
        sanitized_params = sanitize_parameters(parameters)
        command = ['ping'] + sanitized_params + [target]
    elif test_type == 'traceroute':
        target = request.form.get('traceroute_target')
        # Validate the target address
        if not validate_target(target):
            return Response("Invalid target address.", mimetype='text/plain')
        parameters = request.form.get('traceroute_parameters', '')
        sanitized_params = sanitize_parameters(parameters)
        command = ['traceroute'] + sanitized_params + [target]
    elif test_type == 'iperf':
        server = request.form.get('iperf_server')
        # Validate the target address
        if not validate_target(server):
            return Response("Invalid server address.", mimetype='text/plain')
        iperf_version = request.form.get('iperf_version')
        port = request.form.get('port')
        conn_type = request.form.get('conn_type')
        parameters = request.form.get('iperf_parameters', '-f m -i 5 -t 10')

        sanitized_params = sanitize_parameters(parameters)

        # Choose the correct iperf command based on version
        base_command = 'iperf3' if iperf_version == '3' else 'iperf'
        command = [base_command, '-c', server, '-p', port, '--forceflush'] + sanitized_params

        # Add -u flag for UDP connection type
        if conn_type == 'UDP':
            command.append('-u')

    print(f"Executing command: {' '.join(command)}")  # Debugging statement
    return Response(run_command(command), mimetype='text/html')

if __name__ == '__main__':
    app.run(debug=True,host=0.0.0.0)
