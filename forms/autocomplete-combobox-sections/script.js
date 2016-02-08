var totalMatched;
var currentSelected = -1;

Array.prototype.find = function(match) {
  return this.filter(function(item){
    return typeof item == 'string' && item.toUpperCase().indexOf(match.toUpperCase()) == 0;
  });
};

function moveCursorToEnd(el) {
  if (typeof el.selectionStart == "number") {
    el.selectionStart = el.selectionEnd = el.value.length;
  } else if (typeof el.createTextRange != "undefined") {
    el.focus();
    var range = el.createTextRange();
    range.collapse(false);
    range.select();
  }
}

var countries = [];
countries['Africa'] =[ 
"Algeria","Angola","Benin","Botswana","Burkina","Burundi","Cameroon","Cape Verde","Central African Republic","Chad","Comoros","Congo","Congo, Democratic Republic of","Djibouti","Egypt","Equatorial Guinea","Eritrea","Ethiopia","Gabon","Gambia","Ghana","Guinea","Guinea-Bissau","Ivory Coast","Kenya","Lesotho","Liberia","Libya","Madagascar","Malawi","Mali","Mauritania","Mauritius","Morocco","Mozambique","Namibia","Niger","Nigeria","Rwanda","Sao Tome and Principe","Senegal","Seychelles","Sierra Leone","Somalia","South Africa","South Sudan","Sudan","Swaziland","Tanzania","Togo","Tunisia","Uganda","Zambia","Zimbabwe"];

countries['Asia'] =["Afghanistan","Bahrain","Bangladesh","Bhutan","Brunei","Burma (Myanmar)","Cambodia","China","East Timor","India","Indonesia","Iran","Iraq","Israel","Japan","Jordan","Kazakhstan","Korea, North","Korea, South","Kuwait","Kyrgyzstan","Laos","Lebanon","Malaysia","Maldives","Mongolia","Nepal","Oman","Pakistan","Philippines","Qatar","Russian Federation","Saudi Arabia","Singapore","Sri Lanka","Syria","Tajikistan","Thailand","Turkey","Turkmenistan","United Arab Emirates","Uzbekistan","Vietnam","Yemen"];

countries['Australia'] = ["Australia","Fiji","Kiribati","Marshall Islands","Micronesia","Nauru","New Zealand","Palau","Papua New Guinea","Samoa","Solomon Islands","Tonga","Tuvalu","Vanuatu"];

countries['Europe'] = ["Albania","Andorra","Armenia","Austria","Azerbaijan","Belarus","Belgium","Bosnia and Herzegovina","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France","Georgia","Germany","Greece","Hungary","Iceland","Ireland","Italy","Latvia","Liechtenstein","Lithuania","Luxembourg","Macedonia","Malta","Moldova","Monaco","Montenegro","Netherlands","Norway","Poland","Portugal","Romania","San Marino","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland","Ukraine","United Kingdom","Vatican City"];

countries['North America'] = ["Antigua and Barbuda","Bahamas","Barbados","Belize","Canada","Costa Rica","Cuba","Dominica","Dominican Republic","El Salvador","Grenada","Guatemala","Haiti","Honduras","Jamaica","Mexico","Nicaragua","Panama","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Trinidad and Tobago","United States"];

countries['South America'] = ["Argentina","Bolivia","Brazil","Chile","Colombia","Ecuador","Guyana","Paraguay","Peru","Suriname","Uruguay","Venezuela"];


function updateCountryList(){
  var totalCountries = 0;
  var arrayLength;
  var i;
  var matchedCountries;
  currentSelected = -1;
  jQuery('#listOptions').empty();
  

  for (var key in countries) {
    if (countries.hasOwnProperty(key)) {
      var matchedCountries = countries[key].find(jQuery('#f').val());
      matchedCountries.sort();
      arrayLength = matchedCountries.length;
      totalCountries += matchedCountries.length;
      if(arrayLength > 0){
        jQuery('#listOptions').append('<li role="presentation" class="list-heading" id="'+key.replace(/\s/g, '')+'" tabindex="-1">'+key+' ('+arrayLength+')</li>');
      }
      for (i = 0; i < arrayLength; i++) {

        jQuery('#listOptions').append('<li role="option" aria-describedby="'+key.replace(/\s/g, '')+'" tabindex="-1" id="countryId'+matchedCountries[i]+'">' + matchedCountries[i] + '</li>');
      }
    }
  }
  
  
  if(totalCountries > 1){
    jQuery('#total').html('<span>' + totalCountries + ' suggestions</span>');
    jQuery('#countries').show();
  } else if(totalCountries == 1){
    jQuery('#total').html('<span>' + totalCountries + ' suggestion</span>');
    jQuery('#countries').show();
  } else {
    jQuery('#total').html("<span>0 suggestions</span>");
    jQuery('#countries').hide();
  }
  totalMatched = totalCountries;
  jQuery('#f').attr('aria-expanded','true');

  jQuery('li[role="option"]').click(function(){
    jQuery('#f').val(jQuery(this).eq(currentSelected).text());
    jQuery('#f').focus();
    jQuery('#listOptions').empty();
    jQuery('#f').attr('aria-expanded','false');
    currentSelected = -1;
    jQuery('#countries').hide();
  });
}


$( document ).ready(function() {

  jQuery('#suggestCombo').keyup(function (e) {
    var regex = new RegExp("^[a-zA-Z0-9\b]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      setTimeout(function() { updateCountryList(); }, 100);
    }
  });


  jQuery('#suggestCombo').keydown(function(evt) {
    // up
    if (evt.which == 38){
      if(currentSelected == -1){
        jQuery('li[role="option"]').eq(totalMatched - 1).addClass("selected");
        jQuery('li[role="option"]').eq(totalMatched - 1).attr("aria-selected","true");
        jQuery('li[role="option"]').eq(totalMatched - 1).focus();
        currentSelected=totalMatched - 1;
      } else if (currentSelected == 0){
        jQuery('li[role="option"]').eq(currentSelected).removeClass("selected");
        jQuery('li[role="option"]').eq(currentSelected).attr("aria-selected","false");
        jQuery('#f').focus();
        var len = jQuery('#f').val().length;
        jQuery('#f')[0].setSelectionRange(0, len);
        currentSelected = -1;
      } else if(currentSelected + 1 <= totalMatched){
        jQuery('li[role="option"]').eq(currentSelected).removeClass("selected");
        jQuery('li[role="option"]').eq(currentSelected).attr("aria-selected","false");
        jQuery('li[role="option"]').eq(currentSelected - 1).addClass("selected");
        jQuery('li[role="option"]').eq(currentSelected - 1).attr("aria-selected","true");
        jQuery('li[role="option"]').eq(currentSelected - 1).focus();
        currentSelected -= 1;
      }
      jQuery('#f').attr("aria-activedescendant","countryId" + jQuery('li[role="option"]').eq(currentSelected).text());
      if(currentSelected == 0){
        jQuery('#countries')[0].scrollTop=jQuery('#countries')[0].scrollTop-30;
      }
      evt.preventDefault();
    }

    // down     
    if (evt.which == 40){
      //console.log('currentSelected',currentSelected);
      //console.log('totalMatched',totalMatched);
      if(currentSelected == -1){
        jQuery('li[role="option"]').eq(0).addClass("selected");
        jQuery('li[role="option"]').eq(0).attr("aria-selected","true");
        jQuery('li[role="option"]').eq(0).focus();
        setTimeout(function() {jQuery('li[role="option"]').eq(0).focus();}, 1);
        currentSelected=0;
      } else if(currentSelected + 1 < totalMatched){
        jQuery('li[role="option"]').eq(currentSelected).removeClass("selected");
        jQuery('li[role="option"]').eq(currentSelected).attr("aria-selected","false");
        jQuery('li[role="option"]').eq(currentSelected + 1).addClass("selected");
        jQuery('li[role="option"]').eq(currentSelected + 1).attr("aria-selected","true");
        jQuery('li[role="option"]').eq(currentSelected + 1).focus();
        setTimeout(function() {jQuery('li[role="option"]').eq(currentSelected).focus();}, 1);
        currentSelected += 1;
      } else if (currentSelected + 1 == totalMatched){
        jQuery('li[role="option"]').eq(currentSelected).removeClass("selected");
        jQuery('li[role="option"]').eq(currentSelected).attr("aria-selected","false");
        jQuery('li[role="option"]').eq(0).addClass("selected");
        jQuery('li[role="option"]').eq(0).attr("aria-selected","true");
        jQuery('li[role="option"]').eq(0).focus();
        currentSelected = 0;
      }
      jQuery('#f').attr("aria-activedescendant","countryId" + jQuery('li[role="option"]').eq(currentSelected).text());
      if(currentSelected == 0){
        jQuery('#countries')[0].scrollTop=jQuery('#countries')[0].scrollTop-30;
      }
      evt.preventDefault();
    }

    // enter
    if (evt.which == 13){
      if(currentSelected != -1){
        jQuery('#f').val(jQuery('li[role="option"]').eq(currentSelected).text());
        jQuery('#f').focus();
        jQuery('#listOptions').empty();
        jQuery('#f').attr('aria-expanded','false');
        currentSelected = -1;
        jQuery('#countries').hide();
        jQuery('#f').attr("aria-activedescendant","");
      }
    }

    // escape
    if (evt.which == 27){
        jQuery('#f').focus();
        jQuery('#listOptions').empty();
        jQuery('#f').attr('aria-expanded','false');
        currentSelected = -1;
        jQuery('#countries').hide();
        jQuery('#f').attr("aria-activedescendant","");
        evt.preventDefault();
    }
  });

});