$(document).ready(function () {
  const formResultsURL = "https://spreadsheets.google.com/feeds/list/1HwSDZvZeYfjrLr-5rrSObaYKtkUETqAAUvrgjngMK-I/1/public/values?alt=json";
  $.getJSON(formResultsURL, function(data) {
    const entries = data.feed.entry;

    $.each(entries, function(index, entry) {
      var company = "";
      const companyName = entry["gsx$companyname"]["$t"];
      const companyWebsite = entry["gsx$companywebsite"]["$t"];
      if (companyWebsite && companyWebsite!="-") {
        company += '<a href="{0}" target="_blank">{1}</a>'.f(linkify(companyWebsite), companyName);
      } else {
        company += '{0}'.f(companyName);
      }

      var founders = "";
      const founder1 = entry["gsx$gsber1onfoundingteam-nameandclassyear"]["$t"];
      const linkedin1 = entry["gsx$gsber1linkedin"]["$t"];
      const founder2 = entry["gsx$gsber2onfoundingteam-nameandclassyear"]["$t"];
      const linkedin2 = entry["gsx$gsber2linkedin"]["$t"];
      const founder3 = entry["gsx$gsber3onfoundingteam-nameandclassyear"]["$t"];
      const linkedin3 = entry["gsx$gsber3linkedin"]["$t"];
      if (founder1) {
        if (linkedin1) {
          founders += '<a href="{0}" target="_blank">{1}</a>'.f(linkify(linkedin1), founder1);
        } else {
          founders += '{0}'.f(founder1);
        }
      }
      if (founder2) {
        if (founder2 && linkedin2) {
          founders += ', <a href="{0}" target="_blank">{1}</a>'.f(linkify(linkedin2), founder2);
        } else if (founder2) {
          founders += ', {0}'.f(founder2);
        }
      }
      if (founder3) {
        if (linkedin3 && linkedin3) {
          founders += ', <a href="{0}" target="_blank">{1}</a>'.f(linkify(linkedin3), founder3);
        } else if (founder3) {
          founders += ', {0}'.f(founder3);
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
      const alumLink = `<a href="${alumURL}" target="_blank">Contact Founder</a>`

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