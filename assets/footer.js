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
        console.log(value.title);
        document.getElementById("mmo" + counter).href = value.link;
        document.getElementById("mmo" + counter).innerHTML = value.title; 
      });
    }
  });
}