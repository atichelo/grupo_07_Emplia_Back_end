jQuery(function($) {
    $.get("http://localhost:5000/bdempleos", function(data){
        data.forEach(function(empleo){
            $('#job-select').append(new Option(empleo, empleo));
        });
    });
});
jQuery(function($) {
    $.get("http://localhost:5000/bdlocalidades", function(data){
        data.forEach(function(localidad){
            $('#location-select').append(new Option(localidad, localidad));
        });
    });
});

