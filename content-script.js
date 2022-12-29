const style = document.createElement('style');
style.innerHTML = `
  ytd-display-ad-renderer *, ytd-action-companion-ad-renderer *, ytd-promoted-sparkles-web-renderer *, video-ads ytp-ad-module *,
  yt-formatted-string *,
  ytp-ad-persistent-progress-bar-container *, .ad-showing * {
    filter: blur(0px);
  }
`;
document.head.appendChild(style);


const blurAllNonAds = (elementsArray) => {
  elementsArray.forEach(el => {
    if(el.id.includes('ad')) {
      el.style = "filter: blur(0px)";
    } else {
      el.style = "filter: blur(20px)";
    }
  })
}

window.onload = function () {
  const iframes = document.getElementsByTagName("iframe");
  if (iframs.length) blurAllNonAds(iframes);
}

const observeDOM = (function(){
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function( obj, callback ){
    if( !obj || obj.nodeType !== 1 ) return; 

    if( MutationObserver ){
      // define a new observer
      const mutationObserver = new MutationObserver(callback)

      // have the observer observe foo for changes in children
      mutationObserver.observe( obj, { childList:true, subtree:true })
      return mutationObserver
    }
    
    // browser support fallback
    else if( window.addEventListener ){
      obj.addEventListener('DOMNodeInserted', callback, false)
      obj.addEventListener('DOMNodeRemoved', callback, false)
    }
  }
})();

observeDOM(document.body, (m) => {
  const addedIframes = [];
  m.forEach(record => {
    if (record.addedNodes.length) {
      const newIframes = [];
      record.addedNodes.forEach(node => {
        if (node.nodeName === 'iframe') {
          newIframes.push(node);
        }
      });
      addedIframes.push(...newIframes);
    }
  });

  blurAllNonAds(addedIframes);
})