// Stolen from http://stackoverflow.com/questions/13250976/write-to-div-as-data-streams-in
    var count;
    $(function(){
        $('#formx').submit(function(){
            setTimeout(function(){ check_div(); }, 500);
            $('#dynamic').empty();
            count = 0;
            return true;
        });
        $('#formy').submit(function(){
            setTimeout(function(){ check_div(); }, 500);
            $('#dynamic').empty();
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
            setTimeout(function(){ check_div(); }, 5000);
            count = 0;
        }
        else
        {
            count++;
            if(count < 12) setTimeout(function(){ check_div(); }, 5000);
            else console.log('timed out');
        }       
    }
