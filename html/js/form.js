// Stolen from http://stackoverflow.com/questions/13250976/write-to-div-as-data-streams-in
// modified to suit
    var count;
    $(function(){
        $('#formx').submit(function(){
            setTimeout(function(){ check_div(); }, 1000);
            count = 0;
            return true;
        });
        $('#formy').submit(function(){
            setTimeout(function(){ check_div(); }, 1000);
            count = 0;
            return true;
        });
    });

    function check_div()
    {
        var timeout = $('#timeout').val() * 1000;
        var $iframetxt = $('#iframex').contents().text();
        var $div = $('#dynamic');
        if( $iframetxt != $div.text() )
        {
            console.log('rewritten!');
            $div.html( $iframetxt );
            setTimeout(function(){ check_div(); }, 1000);
        }
        else
        {
            count = count + 1000;
            console.log('timeout is ' + timeout + '.');
            console.log('count is ' + count + '.');
            if(count < timeout) setTimeout(function(){ check_div(); }, 1000);
        }
    }
