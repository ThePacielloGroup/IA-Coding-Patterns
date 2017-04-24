$(document).ready(function(){
	var tablists = $(".tabs");
	tablists.each(function(index, tablist){
		var s = new widget.tablist(tablist);
		s.init();
	});
})

var widget = widget || {};

widget.tablist = function(node){
	this.keys = Object.freeze({
	    end: 35,
	    home: 36,
	    left: 37,
	    up: 38,
	    right: 39,
	    down: 40,
	    delete: 46
  	});

  	this.direction = Object.freeze({
  		37: -1,
  		38: -11,
  		39: 1,
  		40: 1
  	});

  	this.tabs = $(node).find("[role='tab']");
  	this.panels = $(node).find("[role='tabpanel']");

  	this.tablist = node;
}

widget.tablist.prototype.init = function(){
	for(var i = 0; i < this.tabs.length; i++){
		$(this.tabs[i]).keydown(this, widget.tablist.keydown);
		$(this.tabs[i]).keyup(this, widget.tablist.keyup);
		$(this.tabs[i]).click(this, widget.tablist.click);
		$(this.tabs[i]).attr('tabindex', -1);

		this.tabs[i].index = i;
		this.tabs[i].delay = widget.tablist.getDelay(this.tabs[i]);
	};
	$(this.tabs[0]).attr('tabindex', 0);

}

widget.tablist.click = function(event){
	widget.tablist.activateTab(event.data, event.target, false);
}

widget.tablist.keydown = function(event){
	var tablist = event.data;
	switch(event.which){
		case tablist.keys.end:
			event.preventDefault();
			widget.tablist.activateTab(tablist, tablist.tabs[tablist.tabs.length - 1]);
		break;
		case tablist.keys.home:
			event.preventDefault();
			widget.tablist.activateTab(tablist, tablist.tabs[0]);
		break;
		case tablist.keys.up:
		case tablist.keys:down:
			widget.tablist.determineOrietation(event);
		break;
	}
}

widget.tablist.keyup = function(event){
	var tablist = event.data;
	switch(event.which){
		case tablist.keys.left:
		case tablist.keys.right:
			widget.tablist.determineOrietation(event);
		break;
		case tablist.keys.delete:
			widget.tablist.determineDeletable(event);
		break;
	}
}

widget.tablist.determineOrietation = function(event){
	widget.tablist.switchTab(event);
}


widget.tablist.determineDeletable = function(event){
	var deletable = $(event.target).attr('data-deletable');
	if(typeof deletable !='undefined'){
		if(deletable === 'true'){
			for(var i = 0; i < event.data.tabs.length; i++){
				$(event.data.tabs[i]).off('focus', widget.tablist.focus);
				$(event.data.tabs[i]).off('keyup', widget.tablist.keyup);
				$(event.data.tabs[i]).off('keydown', widget.tablist.keydown);
				$(event.data.tabs[i]).off('click', widget.tablist.click);
			}

			var index = event.data.tabs.index(event.target);

			widget.tablist.deleteTab(event.target);

			event.data.tabs = $(event.data.tablist).find("[role='tab']");
  			event.data.panels = $(event.data.tablist).find("[role='tabpanel']");

  			for(var i = 0; i < event.data.tabs.length; i++){
  				$(event.data.tabs[i]).keydown(event.data, widget.tablist.keydown);
				$(event.data.tabs[i]).keyup(event.data, widget.tablist.keyup);
				$(event.data.tabs[i]).click(event.data, widget.tablist.click);
				event.data.tabs[i].index = i;
			}

			if(index == event.data.tabs.length){
				index--;
			}
			widget.tablist.activateTab(event.data, event.data.tabs[index],true);
		}
	}
}

widget.tablist.switchTab = function(event){
	var key = event.which;
	var tablist = event.data.tablist;

	for(var i = 0; i < event.data.tabs.length; i++){
		$(event.data.tabs[i]).focus(event.data, widget.tablist.focus);
	}

	if(event.data.direction[key]){
		var target = event.target;
		if(typeof target.index != 'undefined'){
			var index = target.index + event.data.direction[key];
			if(index < 0){
				index = event.data.tabs.length-1;
			} else if( index == event.data.tabs.length){
				index = 0;
			}
			event.data.tabs[index].focus();
		}
	}
}

widget.tablist.activateTab  = function(tablist, tab, setFocus){
	widget.tablist.deactivateTabs(tablist);

	$(tab).attr('tabindex', 0);
	$(tab).attr('aria-selected', 'true');
	var panelId = $(tab).attr('aria-controls');
	$('#'+panelId).removeAttr('hidden');

	if(setFocus){
		$(tab).focus();
	}
}

widget.tablist.deactivateTabs = function(tablist){
	for(var i = 0; i < tablist.tabs.length; i++){
		$(tablist.tabs[i]).attr('tabindex', -1);
		$(tablist.tabs[i]).attr('aria-selected', false);
		$(tablist.tabs[i]).off('focus', widget.tablist.focus);
	};
	for(var i = 0; i < tablist.panels.length; i++){
		$(tablist.panels[i]).attr('hidden', 'hidden');
	};
}

widget.tablist.deleteTab = function(tab){
	var panelId = $(tab).attr('aria-controls');
	var panel = $('#'+panelId);
	$(tab).remove();
	$(panel).remove();

}

widget.tablist.focus = function(event){
	var index = event.data.tabs.index(event.target);
	var delay = event.data.tabs[index].delay;

	setTimeout( function() {widget.tablist.checkFocus(event.data, event.target);}, delay);
}

widget.tablist.getDelay = function(tab){
	var delay = $(tab).attr('data-delay');
	if(typeof delay == 'undefined'){
		delay = 0 ;
	} else {
		delay = parseInt(delay, 10);
		if(isNaN(delay)){
			delay = 250;
		} else if(delay < 0 || delay > 500){
			delay = 250;
		}
	}
	return delay;
}

widget.tablist.checkFocus = function(tablist, tab){
	var active = document.activeElement;

	if(active == $(tab)[0]){
		widget.tablist.activateTab(tablist, tab, false);
	}
}