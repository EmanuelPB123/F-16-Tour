// Add this to detect mobile devices
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Then use it to adjust settings
window.addEventListener('load', function() {
  if(isMobile()) {
    // Reduce quality for mobile
    document.querySelector('#flashlight').setAttribute('light', 'castShadow', false);
    // Disable some features
    let leds = document.querySelectorAll('[led-light]');
    for(let i = 0; i < leds.length; i += 2) { // Keep only half the LEDs
      leds[i].parentNode.removeChild(leds[i]);
    }
  }
});