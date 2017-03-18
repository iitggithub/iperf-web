// Stolen from http://stackoverflow.com/questions/13250976/write-to-div-as-data-streams-in
    var count;
    $(function(){
        $('#formx').submit(function(){
            setTimeout(function(){ check_div(); }, 500);
            count = 0;
            return true;
        });
    });

    function check_div()
    {
        var $iframetxt = $('#iframex').contents().text();
        var $div = $('#dynamic');
        if( $iframetxt != $div.text() )
        {
            console.log('rewritten!');
            $div.html( $iframetxt );
            setTimeout(function(){ check_div(); }, 500);
            count = 0;
        }
        else
        {
            count++;
            if(count < 40) setTimeout(function(){ check_div(); }, 500);
            else console.log('timed out');
        }       
    }
