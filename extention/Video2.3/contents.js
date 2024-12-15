var s = document.createElement('script');
s.src = chrome.runtime.getURL('js/video.js');
(document.head || document.documentElement).appendChild(s);
