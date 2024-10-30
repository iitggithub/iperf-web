function showTestFields() {
    // Map of test types to the associated fields and required attributes
    const fieldMap = {
        'dig': {
            fieldsToShow: ['dig_fields'],
            requiredFields: ['dig_target'],
            defaults: { 'dig_parameters': '+short' }
        },
        'iperf': {
            fieldsToShow: ['iperf_fields'],
            requiredFields: ['iperf_target', 'iperf_port', 'iperf_timeout'],
            defaults: { 'iperf_parameters': '--format m', 'iperf_timeout': '10' }
        },
        'mtr': {
            fieldsToShow: ['mtr_fields'],
            requiredFields: ['mtr_target', 'mtr_reportcycles'],
            defaults: { 'mtr_reportcycles': '200', 'mtr_parameters': '-n -T' }
        },
        'nc': {
            fieldsToShow: ['nc_fields'],
            requiredFields: ['nc_target', 'nc_port'],
            defaults: {}
        },
        'nslookup': {
            fieldsToShow: ['nslookup_fields'],
            requiredFields: ['nslookup_target'],
            defaults: {}
        },
        'ping': {
            fieldsToShow: ['ping_fields'],
            requiredFields: ['ping_target', 'ping_count'],
            defaults: { 'ping_count': '4' }
        },
        'traceroute': {
            fieldsToShow: ['traceroute_fields'],
            requiredFields: ['traceroute_target'],
            defaults: { 'traceroute_parameters': '--icmp'}
        }
    };

    // Get the selected test type
    var testType = document.getElementById("test_type").value;

    // Hide all fields initially
    const allFields = ['dig_fields', 'iperf_fields', 'mtr_fields', 'nc_fields', 'nslookup_fields', 'ping_fields', 'traceroute_fields'];
    allFields.forEach(field => {
        document.getElementById(field).style.display = 'none';
    });

    // Remove 'required' from all input fields
    const allInputFields = ['dig_target', 'iperf_target', 'iperf_port', 'iperf_timeout', 'mtr_target', 'mtr_reportcycles', 'nc_target', 'nc_port', 'nslookup_target', 'ping_target', 'ping_count', 'traceroute_target'];
    allInputFields.forEach(field => {
        document.getElementById(field).removeAttribute('required');
    });

    // Set defaults and show relevant fields based on the selected test type
    if (fieldMap[testType]) {
        // Show the relevant fields
        fieldMap[testType].fieldsToShow.forEach(field => {
            document.getElementById(field).style.display = 'block';
        });

        // Set required attributes for relevant fields
        fieldMap[testType].requiredFields.forEach(field => {
            document.getElementById(field).setAttribute('required', 'required');
        });

        // Apply default values if any
        for (const [field, value] of Object.entries(fieldMap[testType].defaults)) {
            document.getElementById(field).value = value;
        }
    }
}

// Scroll the iframe automatically
function scrollIframe() {
    var iframe = document.getElementById("output_frame");
    iframe.contentWindow.scrollTo(0, iframe.contentWindow.document.body.scrollHeight);
}

// Loading animation functions
function showLoading() {
    document.getElementById("loading-spinner").style.display = "block";
}

function hideLoading() {
    document.getElementById("loading-spinner").style.display = "none";
}

// Fetch settings for the selected test_type from the server
function fetchSettings(testType) {
    fetch(`/get_settings/${testType}`)
        .then(response => response.json())
        .then(data => {
            populateConfigurations(data);
        })
        .catch(error => console.error('Error fetching settings:', error));
}

// Populate the configurations dropdown based on fetched data
function populateConfigurations(settings) {
    const configurationsWrapper = document.getElementById("configuration-wrapper");
    const configurationsSelect = document.getElementById("configurations");

    configurationsSelect.innerHTML = '<option value="">-- Select a Configuration --</option>';

    if (settings.length > 0) {
        settings.forEach((config, index) => {
            const option = document.createElement("option");
            option.value = index; // Use the index to identify the selected configuration
            option.text = config.name; // Use the "name" field from the JSON data
            configurationsSelect.add(option);
        });
        configurationsWrapper.style.display = "block"; // Show the entire wrapper if there are options
    } else {
        configurationsWrapper.style.display = "none"; // Hide the wrapper if there are no options
    }
}

// Load the selected configuration into the form fields
function loadSelectedConfiguration() {
    const selectedIndex = document.getElementById("configurations").value;
    const testType = document.getElementById("test_type").value;
    
    if (selectedIndex === "") return;

    fetch(`/get_settings/${testType}`)
        .then(response => response.json())
        .then(data => {
            const selectedConfig = data[selectedIndex];

            // Populate form fields based on the selected configuration
            Object.keys(selectedConfig).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = selectedConfig[key];
                }
            });
        })
        .catch(error => console.error('Error loading configuration:', error));
}

// Attach event to load configurations when the test_type changes
document.getElementById("test_type").addEventListener("change", function () {
    const testType = this.value;
    fetchSettings(testType);
});

// Initialize fields visibility on page load
//window.onload = showTestFields;

// Call fetchSettings on page load to pre-fill configurations for the default test_type
window.onload = function() {
    const defaultTestType = document.getElementById("test_type").value;
    fetchSettings(defaultTestType);
    showTestFields(); // Ensure fields visibility is updated
};

// Attach hideLoading to the iframe's onload event
document.getElementById("output_frame").onload = function() {
    hideLoading(); // Hide the loading animation
    scrollIframe(); // Attach scrollIframe to the iframe's onload event
};
