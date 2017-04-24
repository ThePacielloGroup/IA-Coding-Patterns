$(document).ready(function(){
	$('.checkbox').click(this, toggleCheckboxMouse)
	$('.checkbox').keydown(this, toggleCheckboxKeyboard)
	$('.checkbox').focus(this, focus)
	$('.checkbox').blur(this, blur)
});

function toggleCheckboxKeyboard(event){
	if(event.which == 32){
		toggleCheckbox(event.currentTarget);
		event.preventDefault()
    	event.stopPropagation()
	}
}

function toggleCheckboxMouse(event){
	toggleCheckbox(event.currentTarget);
	
	event.preventDefault()
    event.stopPropagation()
}

function toggleCheckbox(control){
	var image = $(control).find("img").first();
	if($(control).attr('aria-checked') == 'true'){
		$(control).attr('aria-checked', 'false');
		$(image).attr("src", "./checkbox-unchecked.png");
	} else {
		$(control).attr('aria-checked', 'true');
		$(image).attr("src", "./checkbox-checked.png");
	}
}

function focus(event){
	$(event.currentTarget).addClass('focus');
}

function blur(event){
	$(event.currentTarget).removeClass('focus');
}