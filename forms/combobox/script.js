var totalMatched;
var currentSelected = -1;

Array.prototype.find = function(match) {
  return this.filter(function(item){
    return typeof item == 'string' && item.indexOf(match) == 0;
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

var states =[ 
"Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];


function updateStateList(){
  var matchedStates = states.find(jQuery('#f').val());
  matchedStates.sort();
  jQuery('#listOptions').empty();
  currentSelected = -1;
  var arrayLength = matchedStates.length;
  for (var i = 0; i < arrayLength; i++) {

    jQuery('#listOptions').append('<li role="option" tabindex="-1" id="stateId'+matchedStates[i]+'">' + matchedStates[i] + '</li>');
  }
  if(matchedStates.length > 1){
    jQuery('#total').html('<span>' + matchedStates.length + ' suggestions</span>');
    jQuery('#states').show();
  } else if(matchedStates.length == 1){
    jQuery('#total').html('<span>' + matchedStates.length + ' suggestion</span>');
    jQuery('#states').show();
  } else {
    jQuery('#total').html("<span>0 suggestions</span>");
    jQuery('#states').hide();
  }
  totalMatched = matchedStates.length;
  jQuery('#f').attr('aria-expanded','true');

  jQuery('li[role="option"]').click(function(){
    jQuery('#f').val(jQuery(this).eq(currentSelected).text());
    jQuery('#f').focus();
    jQuery('#listOptions').empty();
    jQuery('#f').attr('aria-expanded','false');
    currentSelected = -1;
    jQuery('#states').hide();
  });
}


$( document ).ready(function() {

  jQuery('#suggestCombo').keyup(function (e) {
    var regex = new RegExp("^[a-zA-Z0-9\b]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      setTimeout(function() { updateStateList(); }, 100);
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
      jQuery('#f').attr("aria-activedescendant","stateId" + jQuery('li[role="option"]').eq(currentSelected).text());
      evt.preventDefault();
    }

    // down     
    if (evt.which == 40){
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
      jQuery('#f').attr("aria-activedescendant","stateId" + jQuery('li[role="option"]').eq(currentSelected).text());
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
        jQuery('#states').hide();
        jQuery('#f').attr("aria-activedescendant","");
      }
    }

    // escape
    if (evt.which == 27){
        jQuery('#f').focus();
        jQuery('#listOptions').empty();
        jQuery('#f').attr('aria-expanded','false');
        currentSelected = -1;
        jQuery('#states').hide();
        jQuery('#f').attr("aria-activedescendant","");
        evt.preventDefault();
    }
  });

});
