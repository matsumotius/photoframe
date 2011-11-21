var jsonFlickrApi;
$(function(){
  $('body').css('margin', '0px').css('padding', '0px').css('background-color', '#333333');
  $('#loading').css('text-align', 'center').css('padding', '8% 0px 0px 0px');
  var pf = {};
      pf.api_key = 'your flickr api key';
      pf.photos = [];
      pf.current = { page : 0, index : 0 };
      pf.slide = $('#slide').fusuma($('body').width());
  pf.get_photos = function(_page){
    var page = _page ? parseInt(_page) : 0;
    var params = {
      api_key  : pf.api_key,
      method   : 'flickr.photos.search',
      per_page : 100,
      format   : 'json',
      text     : 'shokai',
      license  : '1,2,3,4,5,6'
    };
    $.get('http://www.flickr.com/services/rest/', params, function(data){ eval(data); });
  };
  jsonFlickrApi = function(data){
    if(data.stat != 'ok') throw 'Flickr API Error';
    if(pf.current.page >= data.photos.pages) pf.current.page = 0;
    $.each(data.photos.photo, function(index, photo){ pf.photos.push(photo); });    
    pf.current.index = 0;
    pf.current.page ++;
  };
  pf.next = function(){
    if(pf.current.index >= pf.photos.length-1){ pf.get_photos(); return; }
    pf.slide.add(pf.img(pf.photos[pf.current.index])).to('next');
    pf.slide.go('next', function(){ pf.slide.remove('prev'); });
    pf.current.index++;
  };
  pf.img = function(photo){
    // format : http://farm{farm-id}.static.flickr.com/{server-id}/{id}_{secret}_[mstb].jpg
    var url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' +
              photo.id + '_' + photo.secret + '_' + 'm.jpg'
    var container = $('<div />').css('width', '100%').css('text-align', 'center').css('padding', '6% 0px 0px 0px');
    var image = $('<img class="photo" />').attr('src', url).attr('height', '80%');
    return pf.dump(container.append(image));
  };
  pf.dump = function(jq_obj){ return $('<a></a>').append( jq_obj.clone() ).html() };
  pf.start = function(){
    pf.next();
    setInterval(function(){ pf.next(); }, 5000);
  };
  pf.start();
});
