
function dropdown1() {
    for (var i = 0; i < parkNames.length; i++) {
        var $p = $('<p class="list">');
        $p.text(parkNames[i]);
        $('#myDropdown1').append($p);
    }
};

function dropdown() {
    for (var i = 0; i < parkNames.length; i++) {
        var $p = $('<p class="list">');
        $p.text(parkNames[i]);
        $('#myDropdown').append($p);
    }
};

function myFunction1() {
    $('#myDropdown1').toggle('show');
    dropdown1();
};

function myFunction() {
    $('#myDropdown').toggle('show');
    dropdown();
};

// function unsplash(input) {
//     console.log('unsplash: ' + input);

//     var queryURL = 'https://api.unsplash.com/search/photos?orientation=landscape&page=1&query=' + input + '&client_id=595205d0fab64dca9acc4912f7319d2869c29ff0834538b31167dbca9425a2f6&client_secret=00c14faa873902ff8dd494014545db17655595508ae0c67fe37a8774e4b7b45c';

//     $.ajax({
//         url: queryURL,
//         method: "GET",
//     }).then(function (response) {
//         console.log(response);
//         for(var i = 0; i < 1; i++){
//             var $img = $('<img>');
//             $img.attr({class: 'main-img'});
//             $img.attr({src: response.results[i].urls.regular});
//             $('#main-img-container').append($img);
//         }
//     });
// };

function parks(parkName) {
    console.log(parkName);

    var position = parkNames.indexOf(parkName);
    var parkCode = parkCodes[position];
    var parkImg = parkImages[position];
    console.log(parkCode);

    var $img = $('<img>');
    $img.attr({class: 'main-img'});
    $img.attr({src: 'assets/images/parkMain/' + parkImg});
    console.log($img);
    $('#main-img-container').append($img);

    var queryURL = 'https://developer.nps.gov/api/v1/parks?parkCode=' + parkCode + '&api_key=7saAAebFIxUpWP1IHtyJN3nKfo94xMzf009LSiHb';
    console.log('LOOK!', appObj);
    console.log($('#itinerary-add-btn'));

    $.ajax({
        url: queryURL,
        method: "GET",
        }).then(function(response){
            console.log(response);

            var latLong = response.data[0].latLong;

            var input = latLong.split(',');
            console.log(input);
            var lat = input[0].substring(4,16);
            console.log('latitude: ' + lat);
            var long = input[1].substring(6,18);
            console.log('longitude: ' + long);

            appObj.lastParkCode = parkCode;
            appObj.lastParkName = parkName;
            appObj.lastParkLat = lat;
            appObj.lastParkLong = long;
        
            var name = response.data[0].name;
            var $name = $('<h1>');
            $name.text(name);
            $('#title').prepend($name);

            var state = $('<p>');
            state.text('State: ' + response.data[0].states);

            var description = $('<p>');
            description.text(response.data[0].description);
            var directions = $('<p>');
            directions.text(response.data[0].directionsInfo);
            var weather = $('<p>');
            weather.text(response.data[0].weatherInfo);
            var h2ParkInfo = $('<h2>');
            h2ParkInfo.text('Park Information');
            $('#search-results').append(h2ParkInfo, state, description, directions, weather);

            var website = $('<a>');
            website.attr({href: response.data[0].url, target: "new"});
            website.text('Park Website');
            var websiteP = $('<p>');
            websiteP.append(website);

            var directionsURL = $('<a>');
            directionsURL.attr({href: response.data[0].directionsUrl, target: "new"});
            directionsURL.text('Park Directions');
            var directionsP = $('<p>');
            directionsP.append(directionsURL);

            var h2Links = $('<h2>');
            h2Links.text('Links');
            
            $('#links').prepend(h2Links);
            $('#links').append(directionsP, websiteP);

            var h2Weather = $('<h2>');
            h2Weather.attr({'id': 'h2Weather'});
            h2Weather.text('Weather');
            $('#home-weather-info').prepend(h2Weather);

            $('#itinerary-add-btn').prop('disabled', false);
            weatherObj.callHomeWeather();
            trails();

        });
};

function trails() {
    var lat = appObj.lastParkLat;
    var long = appObj.lastParkLong;
    var queryURL = 'https://www.hikingproject.com/data/get-trails?lat=' + lat + '&lon=' + long + '&key=200415723-df92bbbf592b6baa4ec5ef44ab0ffed8';

    $.ajax({
        url: queryURL,
        method: "GET",
        crossOrigin: true,
    }).then(function (response) {
        console.log(response);

        var h2Trails = $('<h2>');
        h2Trails.text('Trails');
        $('#trails').prepend(h2Trails);
        
        for (var i = 0; i < response.trails.length; i++) {

            var $trail = $('<div>');
            $trail.attr({id: 'trail'});

            var $name = $('<h3>');
            $name.attr({id: 'trail-name'});
            $name.text(response.trails[i].name);

            urlP = $('<p>');
            var $url = $('<a>');
            $url.attr({href: response.trails[i].url, target: 'new'});
            $url.text('Trail Map');
            urlP.append($url);

            var $description = $('<p>');
            $description.text(response.trails[i].summary);

            var $difficulty = $('<p>');
            $difficulty.text('Difficulty: ' + response.trails[i].difficulty);

            var $length = $('<p>');
            $length.text('Length: ' + response.trails[i].length + 'mi');

            var $ascent = $('<p>');
            $ascent.text('Ascent: ' + response.trails[i].ascent + 'ft');

            var $altitude = $('<p>');
            $altitude.text('Highest Point: ' + response.trails[i].high + 'ft');
            
            var $summary = $('<div>');
            $summary.attr({id: 'summary'});
            $summary.append($description, urlP);
            
            var $details = $('<div>');
            $details.attr({id: 'details'});
            $details.append($difficulty, $length, $ascent, $altitude);
            
            $trail.append($name, $summary, $details);
            $('#trails').append($trail);
        } 
    });
};

$('.navbar-brand').on('click', function(){
    $('#search-results').empty();
    $('#home-weather-info').empty();
    $('#main-img-container').empty();
    $('#title').empty();
    $('#trails').empty();
    $('#links').empty();
    $('#navbarDropdown').css({ 'display': 'none'});
    $('#initial').css({ 'display': 'block'});
    $('.grid').css({'display': 'none'});
})

$('#park-search-btn').on('click', function () {
    myFunction1();
}); 

$('#myDropdown1').on('click', 'p.list', function () {
    appObj.lastParkCode = '',
    appObj.lastParkName = '',
    appObj.lastParkLat = '',
    appObj.lastParkLong = '',
    $('#myDropdown1').toggle('hide');
    $('#navbarDropdown').css({ 'display': 'block'});
    $('#initial').css({ 'display': 'none'});
    console.log('dropdown-click', this);
    $('.grid').css({'display': 'grid'});
    // unsplash($(this).text());
    parks($(this).text());

});

$('#navbarDropdown').on('click', function () {
    myFunction();
});

$('#myDropdown').on('click', 'p.list', function () {
    $('#myDropdown').empty();
    $('#search-results').empty();
    $('#home-weather-info').empty();
    $('#main-img-container').empty();
    $('#title').empty();
    $('#trails').empty();
    $('#links').empty();
    $('#myDropdown').toggle('hide');
    // unsplash($(this).text());
    parks($(this).text());

});
