var floatingLabelFocus = function() {
    this.parentNode.classList.add("hasContent");
};

var floatingLabelBlur = function() {
  if(this.value.length > 0){
    this.parentNode.classList.add("hasContent");
  } else {
    this.parentNode.classList.remove("hasContent");
  }
};

var classname = document.getElementsByClassName("field");

for (var i = 0; i < classname.length; i++) {
  var el = classname[i].getElementsByTagName("input")[0];
  if(el.value.length > 0){
    el.parentNode.classList.add("hasContent");
  }
   el.addEventListener('focus', floatingLabelFocus, false);
   el.addEventListener('blur', floatingLabelBlur, false);
} 
