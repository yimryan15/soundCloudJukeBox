
var title = document.querySelector('#title')
var actions = ['play', 'pause', 'stop'];
var source = document.getElementById('source-song')
var desc = document.getElementById('description')
var genre = document.getElementById('genre')
var artist = document.getElementById('artist')

function Jukebox(name) {
  this.audio = document.getElementById('myAudio')
  this.songs = [];
  var currIndex= 0

  // this.name = name
  // this.getName = function() {
  //   return this.name
  // }

  // this.load = function(id) {
  //   title.innerText = songs[id].songTitle
  //   audio.src = songs[id].src
  //   currIndex = id
  //   audio.load()
  //   audio.play()
  // }

  this.play = function() {
    this.audio.play()
  }

  this.pause = function() {
    this.audio.pause()
  }
  this.stop = function() {

    this.audio.pause()
    this.audio.seek(0)
  }

  // this.next = function() {
  //   currIndex++
  //   if (currIndex >= tracks.length) {
  //     currIndex = 0
  //   }
  //   this.load(currIndex)
  // }

  //
  // this.previous = function() {
  //   currIndex--
  //   if (currIndex <= -1) {
  //     currIndex = 2
  //   }
  //   this.load(currIndex)
  // }

}

var player = new Jukebox("Ryan's Jukebox");

var getActionBtn = function(type) {
  var elem = document.querySelector('[data-action="' + type + '"]');
  elem.addEventListener('click', function(){
    player[type]();
  })
}


var len = actions.length;
for(var i = 0; i < len; i++) {
  getActionBtn(actions[i]);
}

// var indexSongs = document.querySelectorAll('.li-playlist')
// var songIndex = i
//
// indexSongs.forEach(function(){
//   var elem = indexSongs[i]
//   elem.addEventListener('click', function() {
//     var index = elem.getAttribute('data-index')
//     songIndex = index
//     player.load(index)
//   })
//   i++;
// })

// var nextButton = document.querySelector('.next')
// nextButton.addEventListener('click', function() {
//   player.next();
// })

// var previousButton = document.querySelector('.previous')
// previousButton.addEventListener('click', function() {
//   player.previous();
// })

//sc integration
SC.initialize({
  client_id: 'fd4e76fc67798bfa742089ed619084a6'
});

function search(searchTerm) {

  SC.get('/tracks', {
    q: searchTerm
  })
  .then(function(tracks) {

  //gets the title of the 1st song on playlist
  title.innerText = tracks[0].title

  //add link to the title
  title.href = tracks[0].permalink_url

  desc.innerText = tracks[0].description
  genre.innerText = tracks[0].genre
  artist.innerText = tracks[0].user.username
  artist.href = tracks[0].user.permalink_url

  //displays album image of 1st song on playlist
  var songImage = document.getElementById('image')
  songImage.src = tracks[0].artwork_url

  var playlistTracks = document.querySelector('.playlist-tracks')
  var fragment = document.createDocumentFragment()
  var li = document.createElement("li");
  var i = 0

  //list of songs returned and displayed
  tracks.forEach(function() {
      var li = document.createElement('li')
      li.innerText = tracks[i].title
      li.id = tracks[i].id
      li.className = i
      fragment.appendChild(li)
      playlistTracks.appendChild(fragment)
      i++
  })
  //load sc first track by id
  var trackIndex = 0
  SC.stream('/tracks/' + tracks[trackIndex].id)
    .then(function(sc){
      player.audio = sc
      sc.play()
    });

  //added next button functionality
  var nextButton = document.querySelector('.next')
  nextButton.addEventListener('click', function() {
    trackIndex++
    if (trackIndex >= tracks.length) {
      trackIndex = 0
    }
    title.innerText = tracks[trackIndex].title
    title.href = tracks[trackIndex].permalink_url
    desc.innerText = tracks[trackIndex].description
    genre.innerText = tracks[trackIndex].genre
    artist.innerText = tracks[trackIndex].user.username
    artist.href = tracks[trackIndex].user.permalink_url

    //conditional to take care of null values for artwork_url
    if (tracks[trackIndex].artwork_url == null) {
      songImage.src = ""
    } else {
      songImage.src = tracks[trackIndex].artwork_url
    }

    SC.stream('/tracks/' + tracks[trackIndex].id)
      .then(function(sc){
        player.audio = sc
        sc.play()
      });
  })

  //added previous button functionality
  var previousButton = document.querySelector('.previous')
  previousButton.addEventListener('click', function() {
    trackIndex--
    if (trackIndex == -1) {
      trackIndex = tracks.length - 1
    }
    title.innerText = tracks[trackIndex].title
    title.href = tracks[trackIndex].permalink_url
    desc.innerText = tracks[trackIndex].description
    genre.innerText = tracks[trackIndex].genre
    artist.innerText = tracks[trackIndex].user.username
    artist.href = tracks[trackIndex].user.permalink_url

    //conditional to take care of null values for artwork_url
    if (tracks[trackIndex].artwork_url == null) {
      songImage.src = ""
    } else {
      songImage.src = tracks[trackIndex].artwork_url
    }

    SC.stream('/tracks/' + tracks[trackIndex].id)
      .then(function(sc){
        player.audio = sc
        sc.play()
      });
  })

  });
}

//search button logic
document.addEventListener("DOMContentLoaded", function(event) {
  var searchBtn = document.querySelector('.sc-button');
  var input = document.getElementById('q');
  searchBtn.addEventListener('click', function(){
    search(input.value);
  })
});
