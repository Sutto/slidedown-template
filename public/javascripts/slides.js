(function($) {
  jQuery.easing.def = "easeOutQuart"; // For tweening

  var allSlides = function() {
    return $('#slides #track > div');
  }
  
  $.slideCount = function() {
    return allSlides().size();
  }
  
  var slideDimensions = function() {
    return {
      width: $(window).width(),
      height: $(window).height()
    }
  }
  
  var getIndex = function() {
    var index = document.location.hash.split('#')[1];
    return Number(index);
  }
  
  $.currentSlide = function() {
    return (getIndex() || 0) + 1;
  }
  
  var setIndex = function(idx) {
    var newSlide = '#slide-' + idx;
    if ($(newSlide).size() < 1) return false;
    document.location.hash = '#' + idx;
    $(document).trigger('slide.changing');
  }
  
  $.goToSlide = function(idx) {
    setIndex(idx - 1);
  }
  
  var setSlideDimensions = function() {
    var dimensions = slideDimensions();
    
    $('#slides').height(dimensions.height);
    $('#slides').width(dimensions.width);
    
    $(".fill-width").width(dimensions.width);
    allSlides().height(dimensions.height);
    allSlides().width(dimensions.width);
  }
  
  var showCurrentSlide = function(instant) {
    var dimensions = slideDimensions();
    var index = getIndex();
    var offset = (index || 0) * dimensions.width;
    if(instant === true) {
      $('#track').css({ marginLeft: '-' + offset + 'px' }, 200);
      $(document).trigger('slide.changed');
    } else {
      $('#track').animate({ marginLeft: '-' + offset + 'px' }, 200, function() {
        $(document).trigger('slide.changed');
      });
    }
  }
  
  var verticalAlign = function() {
    var $this = $(this);
    var dimensions = slideDimensions();
    var margin = $("#presentation-header").height() + (dimensions.height - $("#presentation-footer").height() - $("#presentation-header").height() - $this.height()) / 2;
    $this.css({ marginTop: margin + 'px' }); 
  }
  
  $.alignSlides = function() {
    allSlides().find('.content').each(verticalAlign);
  };
  
  var adjustSlides = function(instant) {
    var dimensions = slideDimensions();
    setSlideDimensions();
    showCurrentSlide(instant);
    allSlides().find('.content').each(verticalAlign);
  }
  
  var move = function(event) {
    var DIRECTIONS = {
      37: -1,     // ARROW LEFT
      39: 1,      // ARROW RIGHT
      32: 1,      // SPACE BAR
      13: 1,      // RETURN
      27: 'home', // ESCAPE
      left: -1,
      right: 1
    }
    
    if (dir = DIRECTIONS[event.which || event]) {
      if (dir == 'home') {
        event.preventDefault();
        event.stopPropagation();
        location.href = '/';
      } else {
        setIndex(getIndex() + dir);
      }
    }
  }
  
  function clickMove(e) {
    if (e.pageX < ($(window).width() / 2)) {
      move('left');
    } else {
      move('right');
    }
  }
  
  var resizeTimer = null;
  
  $(window).bind('resize', function() { adjustSlides(true); });
  $(document).bind('keydown', move);
  $(document).bind('hash.changed', adjustSlides);
  $(document).bind('click', clickMove);
  $(document).bind('slide.changed', function() {
    $("#current-slide").text($.currentSlide());
  });
  $(document).ready(function() {
    $("#slide-count").text($.slideCount());
    setIndex(getIndex() || 0);
    setSlideDimensions();
    $(this).trigger('hash.changed');
    if (document.location.search.indexOf('notes') == 1) {
      $('.notes').show();
    }
  });
})(jQuery);
