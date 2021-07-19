let chap = -1;
let captionsOn = false;
let fadeTimeout;

$('#prev').on('click', playPrev);
$('#next').on('click', playNext);
$('.chap-button').on('click', playChapter);
$('#toggleCaptions').on('click', toggleCaptions);
$('#audio')[0].addEventListener('timeupdate', checkCues, false); 
$('body').on('mousemove', showNav);

function toggleCaptions() {
  captionsOn = !captionsOn;
  $('#toggleCaptions').toggleClass('on');
  if (!captionsOn) {
    hideCaption();
  }
}

function playPrev() {
  reset();
  chap--;
  if (chap >= 0) playChapter(chap);
}

function playNext() {
  reset();
  chap++;
  if (chap < 5) playChapter(chap);
}

function reset() {
  $('#audio').stop();
  $('#image').hide();
  $('#text').hide();
  $('#toggleCaptions').hide();
  if (chap > 0) {
    let cues = chapters[chap].transcript;
    for (let c of cues) {
      c[3] = false;
    }
  }
}

function playChapter(n) {
  if (typeof n === 'object') {
    reset();
    chap = Number(n.target.id.substring(4));
  }

  console.log(`playing chapter #chap${chap}`)
  updateNav();

  $('body').css('background', chapters[chap].background);
  $('*').css('color', chapters[chap].color);
  if (chapters[chap].image) {
    $('#image').attr('src', chapters[chap].image);
    $('#image').css('opacity', 1);
  } else {
    $('#image').css('opacity', 0);
  }
  $('#audio').attr('src', chapters[chap].audio);
  $('#audio')[0].play();

  if (chap === 4) {
    $('body').addClass('white-fade');
  }
}

function updateNav() {
  $('#prev').css('visibility', `${chap === 0 ? 'hidden' : 'visible'}`);
  $('#next').css('visibility', `${chap === 4 ? 'hidden' : 'visible'}`);
  $('.chap-button').css('visibility', 'visible');
  $('.chap-button').removeClass('current');
  $(`#chap${chap}`).addClass('current');
}


function checkCues(e) {
  let t = e.path[0].currentTime;
  let cues = chapters[chap].transcript;
  for (let c of cues) {
    if (t >= c[0] && !c[3]) {
      if (c[2] || captionsOn) {
        c[3] = true;
        displayCaption(c[1]);
      } else {
        hideCaption();
      }
    }
  }

  if (t  >= chapters[chap].image_cue[0] && t < chapters[chap].image_cue[1] && $('#image').is(':hidden')) {
    $('#image').show();
  } else if ((t < chapters[chap].image_cue[0] || t >= chapters[chap].image_cue[1]) && $('#image').is(':visible')) {
    // $('#image').hide();
  }
}

function displayCaption(text) {
  if (text === 'SHOW_CAPTIONS') {
    showNav();
    $('#text').html('');
    $('#toggleCaptions').show();
    $('#toggleCaptions').show();
  } else {
    $('#text').html(text);
  }
  $('#text').show();
}

function hideCaption() {
  $('#text').hide();
}

function showNav() {
  $('nav').stop(true, true).fadeIn(300);
  if (fadeTimeout) clearTimeout(fadeTimeout);
  fadeTimeout = setTimeout(() => {
    $('nav').stop(true, true).fadeOut(300);
  }, 5000);
}