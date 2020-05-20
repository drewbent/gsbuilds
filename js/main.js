$(document).ready(function () {
  const noResultsStr = `
      No company was found. Consider <a href="https://docs.google.com/forms/d/e/1FAIpQLSe9ueOYAXAr74CIY4S5jBBZ8006jop2JVqMl6ib6Uz7sCypsQ/viewform?usp=sf_link" target="_blank">adding the company here</a>.
      `;
  $('.dataTables_length').addClass('bs-select');

  // https://datatables.net/reference/option/
  const dt = $('#dt').DataTable({
    "pageLength": 50,
    "language": {
      "zeroRecords": noResultsStr
    },
    "columnDefs": [
      {
          "targets": [ 7 ],
          "visible": false,
          "searchable": true
      }
    ]
  });

  var prevSearchTerm = "";
  dt.on("search.dt", function() {
    const newSearchTerm = dt.search();

    if (newSearchTerm != prevSearchTerm) {
      prevSearchTerm = newSearchTerm;
      
      setTimeout(checkIfSearchTermRemainedSame.bind(
          undefined, dt, prevSearchTerm),
        1000);
    }
  });

  const formResultsURL = "https://spreadsheets.google.com/feeds/list/1XNMmiIgk03lnqzphlzxRBN1_u8BLXbarHzVhaXVwnKo/1/public/values?alt=json";
  $.getJSON(formResultsURL, function(data) {
    const entries = data.feed.entry;

    dt.rows().remove();

    $.each(entries, function(index, entry) {
      var company = "";
      const companyName = entry["gsx$companyname"]["$t"];
      const companyWebsite = entry["gsx$companywebsite"]["$t"];

      const trackingCodeWebsite = `onClick="gtag('event', 'click', { event_category: 'CompanyWebsite', event_label: '${companyName}'});"`;

      if (companyWebsite && companyWebsite!="-") {
        company += `<a href="${linkify(companyWebsite)}" target="_blank" ${trackingCodeWebsite}>${companyName}</a>`;
      } else {
        company += `${companyName}`;
      }

      var founders = "";
      const founder1 = entry["gsx$gsber1onfoundingteam-nameandclassyear"]["$t"];
      const linkedin1 = entry["gsx$gsber1linkedin"]["$t"];
      const founder2 = entry["gsx$gsber2onfoundingteam-nameandclassyear"]["$t"];
      const linkedin2 = entry["gsx$gsber2linkedin"]["$t"];
      const founder3 = entry["gsx$gsber3onfoundingteam-nameandclassyear"]["$t"];
      const linkedin3 = entry["gsx$gsber3linkedin"]["$t"];
      const trackingCodeFounder1 = `onClick="gtag('event', 'click', { event_category: 'FounderLinkedIn', event_label: '${$.trim(founder1.split(/[(']/)[0])}', value: '1'});"`;
      const trackingCodeFounder2 = `onClick="gtag('event', 'click', { event_category: 'FounderLinkedIn', event_label: '${$.trim(founder2.split(/[(']/)[0])}', value: '2'});"`;
      const trackingCodeFounder3 = `onClick="gtag('event', 'click', { event_category: 'FounderLinkedIn', event_label: '${$.trim(founder3.split(/[(']/)[0])}', value: '3'});"`;
      if (founder1) {
        if (linkedin1) {
          founders += `<a href="${linkedin1}" target="_blank" ${trackingCodeFounder1}>${founder1}</a>`;
        } else {
          founders += `${founder1}`;
        }
      }
      if (founder2) {
        if (founder2 && linkedin2) {
          founders += `, <a href="${linkedin2}" target="_blank" ${trackingCodeFounder2}>${founder2}</a>`;
        } else if (founder2) {
          founders += `, ${founder2}`;
        }
      }
      if (founder3) {
        if (linkedin3 && linkedin3) {
          founders += `, <a href="${linkedin3}" target="_blank" ${trackingCodeFounder3}>${founder3}</a>`;
        } else if (founder3) {
          founders += `, ${founder3}`;
        }
      }

      const founder1Components = founder1.split(/[ ,]+/);
      var alumComponents = [];
      $.each(founder1Components, function(index, component) {
        if (!/\d/.test(component)) {
          alumComponents.push(component);
        }
      });
      const founder1First = alumComponents[0];
      const founder1Last = alumComponents[alumComponents.length - 1];
      const alumURL = `https://alumni.stanford.edu/get/page/directory/search/results-basic?first_name=${founder1First}&last_name=${founder1Last}`
      const trackingCodeContactFounder= `onClick="gtag('event', 'click', { event_category: 'FounderContact', event_label: '${founder1First} ${founder1Last}'});"`;
      const alumLink = `<a href="${alumURL}" target="_blank" ${trackingCodeContactFounder}>Contact Founder</a>`

      const foundersAffiliation1 = entry["gsx$foundersaffiliation1"]["$t"];
      const foundersAffiliation2 = entry["gsx$foundersaffiliation2"]["$t"];
      const foundersAffiliation = `${foundersAffiliation1}; ${foundersAffiliation2}`

      dt.row.add([
        company,
        entry["gsx$yearcompanywasstarted"]["$t"],
        founders,
        entry["gsx$companystage"]["$t"],
        entry["gsx$category"]["$t"],
        entry["gsx$companydescription"]["$t"],
        alumLink,
        foundersAffiliation
      ]);
    });

    dt.columns.adjust().draw();
    addFilters();
  });
});

const checkIfSearchTermRemainedSame = function(dt, st) {
  if (dt.search() == st) {
    gtag('event', 'search', {
      'event_category': 'Search',
      'event_label': st
    });
  }
}

$("#js-rotating1").Morphext({
  animation: "bounceIn",
  separator: ",",
  speed: 3300,
  complete: function () {
      // Called after the entrance animation is executed.
  }
});
$("#js-rotating2").Morphext({
  animation: "bounceIn",
  separator: ",",
  speed: 3300,
  complete: function () {
      // Called after the entrance animation is executed.
  }
});

const linkify = function(link) {
  // Add "http://" to the beginning of the url if needed.
  if (link.includes("//")) {
    return link;
  } else {
    return "http://" + link;
  }
};

const addFilters = function() {
  $("#dt").DataTable().columns().every(function(i) {
    if (i==1 || i==3 || i==4) {
      var column = this;
      var select = $('<select  class="browser-default custom-select form-control-sm"><option value="" selected>All</option></select>')
          .appendTo( $(column.footer()).empty() )
          .on( 'change', function () {
              var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
              );

              column
                .search( val ? '^'+val+'$' : '', true, false )
                .draw();
          } );

      column.data().unique().sort().each( function ( d, j ) {
          select.append( '<option value="'+d+'">'+d+'</option>' )
      } );
    }          
  });
};

String.prototype.format = String.prototype.f = function() {
  var s = this,
      i = arguments.length;

  while (i--) {
      s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
  }
  return s;
};