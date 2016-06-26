function mmocNews() {
  url = document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=';
  url +=  encodeURIComponent('http://www.mmo-champion.com/external.php?do=rss&type=newcontent&sectionid=1&days=120&count=5');
  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: function(data) {

      var counter = 0;
      $.each(data.responseData.feed.entries, function(key, value) {
        counter++;
        document.getElementById("mmo" + counter).href = value.link;
        document.getElementById("mmo" + counter).innerHTML = '<i class="fa fa-caret-right fa-fw fa-1"></i>' + value.title; 
      });
    }
  });
}

function wclogs() {
  var base_url = 'https://www.warcraftlogs.com:443/v1';
  var api_key = '4e6b85c57f6b99e30c1e296575957e12';
  var reports_url = base_url + '/reports/guild/Dragon%20Knight/Boulderfist/US?api_key=' + api_key;
  $.ajax({
    url: reports_url,
    dataType: 'json',
    success: function(raids) {
      var deferreds = [];
      var report_base = 'https://www.warcraftlogs.com/reports/';
      var counter = 0;
      $.each(raids.reverse(), function (i, raid) {
      // for (var i = raids.length - 1; i >= raids.length - 5; i--) {
        counter++;
        // var raid = raids[i];
        var title = raid.title;
        var report_url = report_base + raid.id;

        var date = new Date(raid.start);
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var dayOfTheWeek = days[date.getDay()];

        document.getElementById("link" + counter).href = report_url;
        document.getElementById("title" + counter).innerHTML = title;
        document.getElementById("day" + counter).innerHTML = dayOfTheWeek;
        var fight_url = base_url + '/report/fights/' + raid.id + '?api_key=' + api_key;

        var div = $("#stats" + counter);
        var killsDiv = document.getElementById("kills" + counter);
        var wipesDiv = document.getElementById("wipes" + counter);
        deferreds.push($.ajax({
          url: fight_url,
          dataType: 'json',
          success: function (data) {
            var kills = 0;
            var wipes = 0;
            for (var i = 0; i < data.fights.length; i++) {
              var fight = data.fights[i];
              if (fight.boss != 0) {
                if (fight.kill) {
                  kills++;
                } else {
                  wipes++;
                }
              }
            };
            killsDiv.innerHTML = kills + " Kills";
            wipesDiv.innerHTML = wipes + " Wipes";
          }
        }));    
        if (counter >= 5) {
          return false;
        }
      });
      $.when.apply($, deferreds).done(function() {
        // all ajax calls are done and results are available now
      });
    },
    error: function() {
      // alert("error");
    }
  });
}

function checkTwitch(container, url) {
  $.ajax({ 
    url: url,
    dataType:'jsonp',
    success: function(data) { 
      var channel = data._links.channel;
      $.ajax({
        url: channel,
        dataType: 'jsonp',
        success: function(channel_info) {
          document.getElementById(container).href = channel_info.url;
        }
      });
      var status = "OFFLINE";
      document.getElementById(container).style.background = "#ffe5e5";
      if (data.stream != null) {
        status = "LIVE";
        document.getElementById(container).style.background = "#c5ecc5";
        document.getElementById(container + "Title").innerHTML = "<em>" + data.stream.channel.status + "<em>";
        document.getElementById(container + "Game").innerHTML = "Playing <b>" + data.stream.game + "</b>";
      } 
      document.getElementById(container + "Status").innerHTML  = status
    }
 });
}