AFRAME.registerComponent('clickable', {
  init: function () {
    var el = this.el;
    var hasPlayed = false;

    // Wait for scene to load before getting sound entities
    el.sceneEl.addEventListener('loaded', () => {
      var soundEntity1 = document.querySelector('#soundEntity1');
      var soundEntity2 = document.querySelector('#soundEntity2');

      el.addEventListener('click', function () {
        if (!hasPlayed) {
          hasPlayed = true;
          
          // Make sure sound components are ready
          if (soundEntity1.components.sound.isPlaying) {
            soundEntity1.components.sound.stopSound();
          }
          if (soundEntity2.components.sound.isPlaying) {
            soundEntity2.components.sound.stopSound();
          }
          
          soundEntity1.components.sound.playSound();
          
          // Play sound2 in loop after sound1 ends
          soundEntity1.addEventListener('sound-ended', function() {
            soundEntity2.setAttribute('sound', 'loop', true);
            soundEntity2.components.sound.playSound();
          }, { once: true });
          
          el.removeAttribute('clickable'); // Remove the click listener after playing
        }
      });
    });
  }
});