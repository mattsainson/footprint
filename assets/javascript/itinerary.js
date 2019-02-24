
var itineraryObj = {

    itineraryUpdate: false,

    doRefresh: function (snapshot) {

        var row = $('<div>');
        var key = snapshot.key;
        console.log('key', key);
        row.attr({ class: 'row itinerary-data-row', id: key });

        var editDiv = $('<div>');
        editDiv.attr({ class: 'col-md-1 col-sm-1 col-1' });

        var edit = $('<i>');
        edit.attr({ class: 'fas fa-pen-square fa-lg', 'data-toggle': 'modal', 'data-target': '#editItinModal', 'data-key': key });
        editDiv.append(edit);
        row.append(editDiv);

        var parkName = $('<div>');
        parkName.attr({ class: 'col-md-5 col-sm-7 col-7 parkname-display' });
        parkName.text(snapshot.val().parkName);
        row.append(parkName);

        var itineraryStart = $('<div>');
        itineraryStart.attr({ class: 'col-md-2 text-center start-display' });
        itineraryStart.text(snapshot.val().itineraryStart);
        row.append(itineraryStart);

        var itineraryEnd = $('<div>');
        itineraryEnd.attr({ class: 'col-md-2 text-center end-display' });
        itineraryEnd.text(snapshot.val().itineraryEnd);
        row.append(itineraryEnd);

        var itineraryDuration = $('<div>');
        itineraryDuration.attr({ class: 'col-md-1 col-sm-3 col-3 text-center days-display' });
        itineraryDuration.text(snapshot.val().itineraryDuration);
        row.append(itineraryDuration);

        var removeDiv = $('<div>');
        removeDiv.attr({ class: 'col-md-1 text-center col-sm-1 col-1' });

        var remove = $('<i>');
        remove.attr({ class: 'fas fa-trash-alt fa-sm  itinerary-remove', removekey: key });
        removeDiv.append(remove);
        row.append(remove);

        //append to row
        $('#itinerary-data').append(row);

        //set edit buttons
        $('.itinerary-remove').on('click', itineraryObj.remove);

    },
    remove: function () {
        var key = $(this).attr('removekey');
        $('#' + key).remove();
        database.ref().child(key).remove();
    },
    // select: function (event) {

    //     var key = $(this).attr('id');
    //     console.log(key);
    //     // $('#itinerary-add-btn').attr({ datakey: key }); //set the submit key
    //     var row = database.ref().child(key);
    //     row.once('value').then(function (snapshot) {
    //         //open modal form

    //     });
    // },
    checkDates: function () {
        // currently assumes the dates entered are valid in MM/DD/YYYY format
        // once this is done, will try to enter through widget only
        var start = $('#start-date').val();
        var startMoment = moment(start);
        console.log('startMoment', startMoment);
        var end = $('#end-date').val();
        var endMoment = moment(end);
        var numDays = moment.duration(endMoment.diff(startMoment)).asDays() + 1;
        console.log('numDays', numDays);
        //is start null
        //is end null
        //is end before start; okay if same
        $('#modal-weather-info').empty();
        if (endMoment.isBefore(startMoment, 'days')) {
            $('#input-err').text('The start date must be before or the same as the end date.');
            $('#num-days').val('');
        } else {
            $('#input-err').empty();
            $('#updateItin-btn').prop('disabled', false);
            //calculate numdays and update page
            $('#num-days').val(numDays);
            var lat = $('#updateItin-btn').attr('lat');
            var long = $('#updateItin-btn').attr('long');
            weatherObj.getWeather(lat, long, start, end, 'modal');
        }
    },
    updateRow: function () {
        itineraryObj.itineraryUpdate = true;
        console.log('updateRow');
        var postData = {
            uid: $('#updateItin-btn').attr('uid'),
            parkCode: $('#updateItin-btn').attr('parkCode'),
            parkName: $('#updateItin-btn').attr('parkName'),
            parkLat: $('#updateItin-btn').attr('lat'),
            parkLong: $('#updateItin-btn').attr('long'),
            itineraryStart: $('#start-date').val(),
            itineraryEnd: $('#end-date').val(),
            itineraryDuration: $('#num-days').val()
        };
        var updates = {};
        var datakey = $('#updateItin-btn').attr('datakey');
        console.log('datakey', datakey);
        updates[datakey] = postData;
        $('#editItinModal').modal('hide');
        return firebase.database().ref().update(updates);

    },
    getItinerary: function () {
        //call this from login
        console.log('getItinerary');
        // $('#itinerary-add-btn').css({'display': 'block'});
        
    },
    clearItinerary: function () {
        //call this from logout
        console.log('clearItinerary');
        $('#itinerary-data').empty();
        // $('#itinerary-add-btn').css({'display': 'none'});
        
    }
};

//open modal dialog

$('#itinerary-add-btn').on('click', function () {

    event.preventDefault();

    $('#itinerary-add-btn').prop('disabled', true);

    //add form data 
    var parkCode = appObj.lastParkCode;
    var parkName = appObj.lastParkName;
    var parkLat = appObj.lastParkLat;
    var parkLong = appObj.lastParkLong;
    var itineraryStart = moment().format('MM/DD/YYYY');
    var itineraryEnd = moment().format('MM/DD/YYYY');
    var itineraryDuration = 1; //this will be calculated when changed
    var uid = appObj.currUserUid;

    database.ref().push({
        parkCode: parkCode,
        parkName: parkName,
        parkLat: parkLat,
        parkLong: parkLong,
        itineraryStart: itineraryStart,
        itineraryEnd: itineraryEnd,
        itineraryDuration: itineraryDuration,
        uid: uid
    });

});

database.ref().on('child_added', function (snapshot) {
    itineraryObj.doRefresh(snapshot);
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

database.ref().on('child_changed', function (snapshot) {
    console.log('child_changed', snapshot);
    if (itineraryObj.itineraryUpdate) {
        itineraryObj.itineraryUpdate = false;
        console.log('parkName',snapshot.val()); //parkName
        console.log('#'+snapshot.key);
        $('#' + snapshot.key).children('.parkname-display').text(snapshot.val().parkName);
        $('#' + snapshot.key).children('.start-display').text(snapshot.val().itineraryStart);
        $('#' + snapshot.key).children('.end-display').text(snapshot.val().itineraryEnd);
        $('#' + snapshot.key).children('.days-display').text(snapshot.val().itineraryDuration);
        // itineraryObj.doRefresh(snapshot);
    }
});

$('#start-date').change(itineraryObj.checkDates);
$('#end-date').change(itineraryObj.checkDates);
$('#updateItin-btn').on('click', itineraryObj.updateRow);

$('#editItinModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var key = button.data('key'); // Extract info from data-* attributes
    console.log(key);

    var row = database.ref().child(key);
    row.once('value').then(function (snapshot) {
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);

        //get data from database
        var uid = snapshot.val().uid;
        var parkCode = snapshot.val().parkCode;
        var parkName = snapshot.val().parkName;
        var lat = snapshot.val().parkLat;
        var long = snapshot.val().parkLong;
        var start = snapshot.val().itineraryStart;
        var end = snapshot.val().itineraryEnd;
        var days = snapshot.val().itineraryDuration;
        // console.log('start', start, 'end', end);

        //set input values
        $('#editItinModalLabel').text(parkName);
        $('#start-date').val(start);
        $('#end-date').val(end);
        $('#num-days').val(days);

        //clear weather and input err if anything
        $('#modal-weather-info').empty();
        $('#input-err').empty();
        //since the data is valid by default; disable the Update button; enable if data changes
        $('#updateItin-btn').attr({ datakey: key, lat: lat, long: long, uid: uid, parkCode: parkCode, parkName: parkName });
        $('#updateItin-btn').prop('disabled', true);
        //get weather
        weatherObj.getWeather(lat, long, start, end, 'modal');

        //open modal form

    });


});
