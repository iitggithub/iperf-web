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

// Initialize fields visibility on page load
window.onload = showTestFields;

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

// Attach hideLoading to the iframe's onload event
document.getElementById("output_frame").onload = function() {
    hideLoading(); // Hide the loading animation
    scrollIframe(); // Attach scrollIframe to the iframe's onload event
};