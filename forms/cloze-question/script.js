function addPhraseSegment(p) {
  if (p=='' || typeof p === 'undefined') {
    return " blank,";
  } else if ( p==String.fromCharCode(160)){
    return " blank,";
  } else {
    return " " + p;
  }
}


var phrase = '';

function buildPhrase(placeholder) {
  phrase='';
  jQuery('#q1').find('*').each(function () {
    switch (jQuery(this).prop('tagName')) {
      case 'SPAN':
        phrase += addPhraseSegment(jQuery(this).clone().children().remove().end().text()); 
        break;
      case 'SELECT':
        if(placeholder) {
          phrase += ", " + jQuery(this).attr('aria-label') +" ";
        } else {
        }

        phrase += addPhraseSegment(this.options[this.selectedIndex].text);
        break;
      case 'IMG':
        break;
      case 'INPUT':
        if(placeholder) {
          phrase += ", " + jQuery(this).attr('aria-label') +" ";
        } else {
        }
        phrase += addPhraseSegment(this.value);
        break;
      default:
        break;
    }
  });
  return phrase;
}

jQuery( document ).ready(function() {
  jQuery("select, input").on('focus blur',function(){
   jQuery('#complete-phrase-placeholder').text(buildPhrase(true)); 
   jQuery('#complete-phrase-clean').text(buildPhrase(false)); 
 });
  jQuery('#complete-phrase-placeholder').text(buildPhrase(true));
  jQuery('#complete-phrase-clean').text(buildPhrase(false)); 

});