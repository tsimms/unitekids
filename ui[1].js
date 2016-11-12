seeking = false;
checkLiveInterval = null;

$(document).ready(function(){
  playwait = null;
  jwplayer().onPlay(function() { playEvent(); } );

  var features = Array('In_The_Beginning', 'The_King_And_The_Kingdom', 'A_Happy_Sunday');
  var feature_count = 1;
  var loadimg = function() {
    var filename = features[feature_count] + '.jpg';
    var fimg = new Image();
    fimg.src = filename;
  }
  loadimg();
  var rotate = function() {
    var filename = features[feature_count] + '.jpg';
    $('.feature img').attr('src', filename);
    feature_count++; if (feature_count >= features.length) feature_count=0;
    loadimg();
  }
  r = setInterval(rotate, 3000);
  // check to see if program has started
  checkLiveInterval = setInterval(function() {
    $.getJSON('/getTime.php?a=getOffsetTime', function(data) {
      if (data && data.offsetTime) {
        $.get('http://content.jwplatform.com/feeds/UwcUGnig.rss', function(xml) { 
            var total = 0;
            $(xml).find("duration,itunes\\:duration").each(function() {
              total += parseInt($(this).text());
            });
            //if ((jwplayer().getState() != 'playing') && total > data.offsetTime) {
            if ((jwplayer().getState() != 'playing')) {
              clearInterval(checkLiveInterval);
              jwplayer().load('//content.jwplatform.com/feeds/UwcUGnig.rss');
              jwplayer().play();
            }
          }, 'xml');
      }
    });
  }, 15000);
});


function playEvent() {
  if (!seeking) {
    getOffset();
  }
}

function getOffset() {
  return;  // we decided on 9/27/16 to not force shared experience, but rather just to start as an on-demand program
  seeking=true;
  $.getJSON('/getTime.php?a=getOffsetTime', function(data) {
    var seek = getSeek(data.offsetTime,0);
    if (seek && seek.seek) {
      if (data.offsetTime <= 15) {seek.seek = 0;}	// Within 15 seconds, start from beginning.
      jwplayer.api.selectPlayer().playlistItem(seek.index);
      onStartPlaying(function() {jwplayer().seek(seek.seek); setTimeout(function() {seeking=false;}, 5000); });
    } else {
      stopIt();
    }
  });
}

function getSeek(offset, index) {
  if (index > (jwplayer.api.selectPlayer().getPlaylist().length-1))
    return -1;
  var duration = jwplayer.api.selectPlayer().getPlaylist()[index].duration;
  if (offset > duration) {
    return getSeek(offset-duration, index+1);
  } else {
    var r = {};
    r.seek = offset;
    r.index = index;
    return r;
  }
}

function onStartPlaying(fn) {
  playwait = setInterval(function() {
      if (jwplayer().getState() == 'playing') {
        clearInterval(playwait);
        fn();
      };
    }, 50
  );
}

function stopIt() {
  //alert('stopIt()');
  seeking=true;
  jwplayer().stop();
  jwplayer().load('//content.jwplatform.com/feeds/lvVp5guv.rss');
}

