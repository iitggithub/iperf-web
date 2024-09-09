from flask import Flask, render_template, request, Response
import subprocess
import select
import shlex
import re
import os

app = Flask(__name__)

# function to convert a string to boolean
def str_to_boolean(s):
    return str(s).lower() == "true"

# Function to run a command and stream the output
def run_command(command):
    try:
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except FileNotFoundError as e:
        yield f"Error: {str(e)}<br>"
        return
    except OSError as e:
        yield f"Error: {str(e)}<br>"
        return

    yield 'Executing command: ' + ' '.join(command) + '<br><br>'

    # Monitor both stdout and stderr streams
    while True:
        # Use select to monitor stdout and stderr
        reads = [process.stdout, process.stderr]
        readable, _, _ = select.select(reads, [], [])

        for stream in readable:
            if stream == process.stdout:
                stdout_line = process.stdout.readline().decode('utf-8')
                if stdout_line:
                    yield stdout_line + '<br>'

            if stream == process.stderr:
                stderr_line = process.stderr.readline().decode('utf-8')
                if stderr_line:
                    yield f"<span style='color:red;'>{stderr_line}</span><br>"

        # Break if the process has terminated and there's no more output
        if process.poll() is not None:
            break

    # Ensure that any remaining output is read after the process terminates
    remaining_stdout = process.stdout.read().decode('utf-8')
    if remaining_stdout:
        yield remaining_stdout + '<br>'
    
    remaining_stderr = process.stderr.read().decode('utf-8')
    if remaining_stderr:
        yield f"<span style='color:red;'>{remaining_stderr}</span><br>"

    yield '<br>Execution finished!<br>'

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

def is_valid_port(port):
    try:
        port = int(port)
        return 1 <= port <= 65535
    except (ValueError, TypeError):
        return False

app_port = os.getenv('IPERF_WEB_PORT', '5000')
debug_mode = str_to_boolean(os.getenv('IPERF_WEB_DEBUG_MODE', False))

# Route to display the page
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle form submission and execute selected test
@app.route('/run_test', methods=['POST'])
def run_test():
    test_type = request.form.get('test_type')
    output = ""
    sanitized_params = ""
    command = []

    # Only run tests for valid test types
    TEST_TYPES = {'dig', 'iperf', 'mtr', 'nc', 'nslookup', 'ping', 'traceroute'}
    if test_type in TEST_TYPES:
        target = request.form.get(test_type + '_target')
        # Validate the target address
        if not validate_target(target):
            return Response("'" + str(target) + "' is not a valid target address.", mimetype='text/plain')
        parameters = request.form.get(test_type + '_parameters', '')

        # MTR specific parameters
        if test_type == 'mtr':
            mtr_reportcycles = int(request.form.get('mtr_reportcycles', '200'))
            parameters += ' --report --report-wide --report-cycles ' + str(mtr_reportcycles)

        # netcat specific parameters
        if test_type == 'nc':
            port = request.form.get('nc_port')

            if not is_valid_port(port):
                return Response("'" + str(port) + "' is not a valid TCP port.", mimetype='text/plain')

            command = [test_type, '-vz', target, port]

        # netcat specific parameters
        if test_type == 'nslookup':
            server = request.form.get('nslookup_dns_server')
            if server:
                parameters = server
                sanitized_params = sanitize_parameters(parameters)
                command = [test_type, target] + sanitized_params

        # ping specific parameters
        if test_type == 'ping':
            count = int(request.form.get('ping_count', '4'))
            parameters += ' -c' + str(count)

        # iperf specific parameters
        if test_type == 'iperf':
            iperf_version = request.form.get('iperf_version')
            port = request.form.get('iperf_port')

            if not is_valid_port(port):
                port = 5001

            conn_type = request.form.get('iperf_conn_type')

            # Choose the correct iperf command based on version
            base_command = 'iperf3' if iperf_version == '3' else 'iperf'

            timeout = int(request.form.get('iperf_timeout', '10'))

            sanitized_params = sanitize_parameters(parameters)

            command = [base_command, '-c', target, '-p', port, '--forceflush', '-t', str(timeout)] + sanitized_params

            # Add -u flag for UDP connection type
            if conn_type == 'UDP':
                command.append('-u')

        if not sanitized_params:
            sanitized_params = sanitize_parameters(parameters)

        if not command:
            command = [test_type] + sanitized_params + [target]

        print(f"Executing command: {' '.join(command)}")  # Debugging statement

    return Response(run_command(command), mimetype='text/html')

if __name__ == '__main__':
    app.run(debug=debug_mode,host='0.0.0.0',port=app_port)