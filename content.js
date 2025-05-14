function togglePageDetails() {
  const video = document.querySelector('video');
  if (!video) return;

  const isPlaying = !!(video.currentTime > 0 && !video.paused && !video.ended);
  const isFullscreen = !!document.fullscreenElement;

  // These elements usually contain metadata, title, and sidebars
  const elementsToHide = [
    'ytd-watch-metadata',
    '.ytd-video-primary-info-renderer',
    '#info',
    '#title',
    '#top-row',
    '#meta-contents',
    '#secondary',
    '#comments',
    '#chat',
    'ytd-secondary-results'
  ];

  elementsToHide.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.contains(video) && !video.contains(el)) {
        if (isPlaying) {
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.height = '0px';
          el.style.overflow = 'hidden';
          el.style.pointerEvents = 'none';
        } else {
          el.style.visibility = '';
          el.style.opacity = '';
          el.style.height = '';
          el.style.overflow = '';
          el.style.pointerEvents = '';
        }
      }
    });
  });

  // Ensure video player remains unaffected
  const videoContainer = video.closest('#movie_player') || video.closest('.html5-video-container');
  if (videoContainer) {
    videoContainer.style.visibility = 'visible';
    videoContainer.style.opacity = '1';
    videoContainer.style.height = '';
    videoContainer.style.overflow = '';
    videoContainer.style.pointerEvents = '';
  }
}

function attachVideoListeners() {
  const video = document.querySelector('video');
  if (video && !video._listenersAttached) {
    video.addEventListener('play', togglePageDetails);
    video.addEventListener('pause', togglePageDetails);
    video.addEventListener('ended', togglePageDetails);
    video._listenersAttached = true;
  }
}

function attachFullscreenListener() {
  document.addEventListener('fullscreenchange', () => {
    // Delay slightly to allow DOM to update in fullscreen
    setTimeout(togglePageDetails, 100);
  });
}

function initExtension() {
  togglePageDetails();
  attachFullscreenListener();

  const observer = new MutationObserver(() => {
    attachVideoListeners();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

initExtension();
