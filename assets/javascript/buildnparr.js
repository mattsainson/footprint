
var i = -1;
var newParkNames = [];
var newParkCodes = [];

$('#buildnparr-btn').on('click', function () {
    myLoopCall();
});

function myLoopCall() {
    myLoop();
    //print arrays
    $('#arr').append(newParkCodes);
    $('#arr').append(newParkNames);
}

function myLoop() {           //  create a loop function
    setTimeout(function () {    //  call a 3s setTimeout when the loop is called              //  increment the counter
        i++;
        if (i < parkCodes.length) {            //  if the counter < 10, call the loop function

            console.log(parkCodes[i]);
            var myURL = 'https://developer.nps.gov/api/v1/parks?parkCode=' + parkCodes[i] + '&api_key=7saAAebFIxUpWP1IHtyJN3nKfo94xMzf009LSiHb';

            $.ajax({
                url: myURL,
                method: "GET",
            }).then(function (nspObj) {
                console.log(nspObj);
                var desig = nspObj.data[0].designation;
                var name = nspObj.data[0].name;
                var code = nspObj.data[0].parkCode;
                if (desig === 'National Park') {
                    newParkNames.push(name);
                    newParkCodes.push(code);
                }
            });
            myLoop();             //  ..  again which will trigger another 
        }
    }, 3000);
}
