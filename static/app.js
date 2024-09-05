function showTestFields() {
    var testType = document.getElementById("test_type").value;

    if (testType === 'ping') {
        document.getElementById("ping_fields").style.display = 'block';
        document.getElementById("traceroute_fields").style.display = 'none';
        document.getElementById("iperf_fields").style.display = 'none';

        // Reset parameters and target for Ping
        document.getElementById("ping_target").value = '';
        document.getElementById("ping_parameters").value = '-c4';

        // Enable required for Ping, disable for others
        document.getElementById("ping_target").setAttribute('required', 'required');
        document.getElementById("traceroute_target").removeAttribute('required');
        document.getElementById("iperf_server").removeAttribute('required');
        document.getElementById("port").removeAttribute('required');
    } else if (testType === 'traceroute') {
        document.getElementById("ping_fields").style.display = 'none';
        document.getElementById("traceroute_fields").style.display = 'block';
        document.getElementById("iperf_fields").style.display = 'none';

        // Reset parameters and target for Traceroute
        document.getElementById("traceroute_target").value = '';
        document.getElementById("traceroute_parameters").value = '';

        // Enable required for Traceroute, disable for others
        document.getElementById("traceroute_target").setAttribute('required', 'required');
        document.getElementById("ping_target").removeAttribute('required');
        document.getElementById("iperf_server").removeAttribute('required');
        document.getElementById("port").removeAttribute('required');
    } else if (testType === 'iperf') {
        document.getElementById("ping_fields").style.display = 'none';
        document.getElementById("traceroute_fields").style.display = 'none';
        document.getElementById("iperf_fields").style.display = 'block';

        // Set default parameters for IPerf
        document.getElementById("iperf_parameters").value = '-f m -i 5 -t 30';

        // Enable required for IPerf, disable for others
        document.getElementById("iperf_server").setAttribute('required', 'required');
        document.getElementById("port").setAttribute('required', 'required');
        document.getElementById("ping_target").removeAttribute('required');
        document.getElementById("traceroute_target").removeAttribute('required');
    }
}

// Initialize fields visibility on page load
window.onload = showTestFields;


function scrollIframe() {
    var iframe = document.getElementById("output_frame");
    iframe.contentWindow.scrollTo(0, iframe.contentWindow.document.body.scrollHeight);
}

// Attach scrollIframe to the iframe's onload event
document.getElementById("output_frame").onload = scrollIframe;