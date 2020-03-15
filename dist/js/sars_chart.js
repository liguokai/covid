/////////////SARS Data

var global = {
  "cases": {
    "COVIDCount": 0,
    "SARSCount": 0,
    "DayCount": 0
  },
  "countries": {
    /*"Mainland China": {
      name: countryName,
      cases: {
      confirmed: 123,
      deaths: 456,
      recovered: 78
      },
      states: ['Hubei']
    }*/
  },
  "states": {
    /*'Mainland China___Hubei': {
      name: 'Hubei',
      country: 'Mainland China',
      lat: 12.34,
      long: 56.78,
      cases: {
      confirmed: 123,
      deaths: 456,
      recovered: 78
      }
    }*/
  }
};

var $countryTbody = $('#total-confirmed-by-country');

function onDataReterived(data) {
  $(data).find('row').each(function () {
    var countryName = $(this).find("Country").text();
    var COVIDCount = parseInt($(this).find("COVIDCount").text(), 10);
    var SARSCount = $(this).find("SARSCount").text();
    var DayCount = $(this).find("DayCount").text();


    if (global.countries[countryName] == undefined) {
      global.countries[countryName] = {
        name: countryName,
        cases: {
          COVIDCount: COVIDCount,
          SARSCount: SARSCount,
          DayCount: DayCount
        },
        states: []
      };
    }
  });

  dataInitialized = true;
}

function renderTable() {

  var countriesArray = Object.keys(global.countries).map(key => global.countries[key]);
  var countriesByConfirmed = _.sortBy(countriesArray, ['cases.COVIDCount', 'name']).reverse();
  for (var key in countriesByConfirmed) {
    var country = countriesByConfirmed[key];

    if (country.name == "global" || country.name == "Global")
      continue;

    if (country.cases.SARSCount == null || country.cases.SARSCount == "null") {

      $('<tr class="ot-cases" data-country="' + country.name + '"><td><span class="covid-label">COVID</span></td><td>' + country.name + '</td></tr>').appendTo($countryTbody);
    } else {
      $('<tr class="ot-cases" data-country="' + country.name + '"><td><span class="sars-label">SARS</span>&<span class="covid-label">COVID</span></td><td>' + country.name + '</td></tr>').appendTo($countryTbody);

    }

  }
  ;
}


$.ajax({
  type: "GET",
  url: "dist/data/SARs_and_COVID.xml",
  cache: false,
  dataType: "xml"
}).done(function (data, textStatus, jqXHR) {
  console.log("ajax success");
  onDataReterived(data);
  renderTable();
}).fail(function (qXHR, textStatus, errorThrown) {
  console.log("ajax error");
});
