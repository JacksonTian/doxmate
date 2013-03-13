/*
 * jquery-counter plugin
 *
 * Copyright (c) 2009 Martin Conte Mac Donell <Reflejo@gmail.com>
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 */
jQuery.fn.countdown = function(userOptions)
{
  // Default options
  var options = {
    stepTime: 60,
    // startTime and format MUST follow the same format.
    // also you cannot specify a format unordered (e.g. hh:ss:mm is wrong)
    format: "dd:hh:mm:ss",
    startTime: "01:12:32:55",
    endtime: null,
    digitImages: 6,
    digitWidth: 53,
    digitHeight: 77,
    timerEnd: function(){},
    image: "digits.png"
  };
  var digits = [], interval;
  // Draw digits in given container
  
  //hack by kennyz
  var createDigits = function(where) 
  {
    if(options.endtime!=null) {
        var enddate = new Date(parseInt(options.endtime));
        var diff = (enddate - new Date()) / 1000;
        var days = Math.floor(diff / 3600 / 24);
        diff -= days * 3600 * 24;
        var hours = Math.floor(diff / 3600);
        diff -= hours * 3600;
        var minutes = Math.floor(diff / 60);
        diff -= minutes * 60;
        var seconds = Math.floor(diff);
        if(days < 10) {
          days = '0' + days;
        }
        if(hours < 10) {
          hours = '0' + hours;
        }
        if(minutes < 10) {
          minutes = '0' + minutes;
        }
        if(seconds < 10) {
          seconds = '0' + seconds;
        }
        options.startTime = days + ':' + hours + ':' + minutes + ':' + seconds;
        console.log(options.startTime);
    }
    
    var c = 0;
    // Iterate each startTime digit, if it is not a digit
    // we'll asume that it's a separator
    for (var i = 0; i < options.startTime.length; i++)
    {
      if (parseInt(options.startTime[i]) >= 0) 
      {
        elem = $('<div id="cnt_' + i + '" class="cntDigit" />').css({
          height: options.digitHeight * options.digitImages * 10, 
          float: 'left', background: 'url(\'' + options.image + '\')',
          width: options.digitWidth});
        digits.push(elem);
        margin(c, -((parseInt(options.startTime[i]) * options.digitHeight *
                              options.digitImages)));
        digits[c].__max = 9;
        // Add max digits, for example, first digit of minutes (mm) has 
        // a max of 5. Conditional max is used when the left digit has reach
        // the max. For example second "hours" digit has a conditional max of 4 
        switch (options.format[i]) {
          case 'h':
            digits[c].__max = (c % 2 == 0) ? 2: 9;
            if (c % 2 == 0)
              digits[c].__condmax = 4;
            break;
          case 'd': 
            digits[c].__max = 9;
            break;
          case 'm':
          case 's':
            digits[c].__max = (c % 2 == 0) ? 5: 9;
        }
        ++c;
      }
      else 
        elem = $('<div class="cntSeparator"/>').css({float: 'left'})
                .text(options.startTime[i]);
      where.append(elem)
    }
  };
  
  // Set or get element margin
  var margin = function(elem, val) 
  {
    if (val !== undefined)
      return digits[elem].css({'marginTop': val + 'px'});
    return parseInt(digits[elem].css('marginTop').replace('px', ''));
  };
  // Makes the movement. This is done by "digitImages" steps.
  var moveStep = function(elem) 
  {
    digits[elem]._digitInitial = -(digits[elem].__max * options.digitHeight * options.digitImages);
    return function _move() {
      mtop = margin(elem) + options.digitHeight;
      if (mtop == options.digitHeight) {
        margin(elem, digits[elem]._digitInitial);
        if (elem > 0) moveStep(elem - 1)();
        else 
        {
          clearInterval(interval);
          for (var i=0; i < digits.length; i++) margin(i, 0);
          options.timerEnd();
          return;
        }
        if ((elem > 0) && (digits[elem].__condmax !== undefined) && 
            (digits[elem - 1]._digitInitial == margin(elem - 1)))
          margin(elem, -(digits[elem].__condmax * options.digitHeight * options.digitImages));
        return;
      }
      margin(elem, mtop);
      if (margin(elem) / options.digitHeight % options.digitImages != 0)
        setTimeout(_move, options.stepTime);
      if (mtop == 0) digits[elem].__ismax = true;
    }
  };
  $.extend(options, userOptions);
  this.css({height: options.digitHeight, overflow: 'hidden'});
  createDigits(this);
  interval = setInterval(moveStep(digits.length - 1), 1000);
};
