$(document).ready(function () {
  const formResultsURL = "https://spreadsheets.google.com/feeds/list/1HwSDZvZeYfjrLr-5rrSObaYKtkUETqAAUvrgjngMK-I/1/public/values?alt=json";
  $.getJSON(formResultsURL, function(data) {
    const entries = data.feed.entry;

    $("#dt tbody tr:first-child").remove();

    $.each(entries, function(index, entry) {
      var company = "";
      const companyName = entry["gsx$companyname"]["$t"];
      const companyWebsite = entry["gsx$companywebsite"]["$t"];

      const trackingCodeWebsite = `onClick="ga('send', 'event', { eventCategory: 'CompanyWebsite', eventAction: 'click', eventLabel: '${companyName}'});"`;

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
      const trackingCodeFounder1 = `onClick="ga('send', 'event', { eventCategory: 'FounderLinkedIn', eventAction: 'click', eventLabel: '${$.trim(founder1.split(/[(']/)[0])}', eventValue: '1'});"`;
      const trackingCodeFounder2 = `onClick="ga('send', 'event', { eventCategory: 'FounderLinkedIn', eventAction: 'click', eventLabel: '${$.trim(founder2.split(/[(']/)[0])}', eventValue: '2'});"`;
      const trackingCodeFounder3 = `onClick="ga('send', 'event', { eventCategory: 'FounderLinkedIn', eventAction: 'click', eventLabel: '${$.trim(founder3.split(/[(']/)[0])}', eventValue: '3'});"`;
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
      const trackingCodeContactFounder= `onClick="ga('send', 'event', { eventCategory: 'FounderContact', eventAction: 'click', eventLabel: '${founder1First} ${founder1Last}'});"`;
      const alumLink = `<a href="${alumURL}" target="_blank" ${trackingCodeContactFounder}>Contact Founder</a>`

      $("#dt tbody").append(" \
      <tr> \
        <td>{0}</td> \
        <td>{1}</td> \
        <td>{2}</td> \
        <td>{3}</td> \
        <td>{4}</td> \
        <td>{5}</td> \
        <td>{6}</td> \
      </tr> \
      ".f(
        company,
        entry["gsx$yearcompanywasstarted"]["$t"],
        founders,
        entry["gsx$companystage"]["$t"],
        entry["gsx$category"]["$t"],
        entry["gsx$companydescription"]["$t"],
        alumLink
      ));
    });

    const noResultsStr = `
      No company was found. Consider <a href="https://docs.google.com/forms/d/e/1FAIpQLSe9ueOYAXAr74CIY4S5jBBZ8006jop2JVqMl6ib6Uz7sCypsQ/viewform?usp=sf_link" target="_blank">adding the company here</a>.
      `;

    // https://datatables.net/reference/option/
    $('#dt').DataTable({
      "pageLength": 50,
      "language": {
        "zeroRecords": noResultsStr
      },
    });
    $('.dataTables_length').addClass('bs-select');
  });
});

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

String.prototype.format = String.prototype.f = function() {
  var s = this,
      i = arguments.length;

  while (i--) {
      s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
  }
  return s;
};