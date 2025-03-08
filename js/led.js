AFRAME.registerComponent('led-light', {
    schema: {
      color: {type: 'color', default: '#00ffff'}
    },
    
    init: function() {
      const data = this.data;
      const el = this.el;
      
      // Crear luz
      const light = document.createElement('a-light');
      light.setAttribute('type', 'point');
      light.setAttribute('color', data.color);
      light.setAttribute('intensity', '2');
      light.setAttribute('distance', '3');
      
      // Crear esfera LED
      const sphere = document.createElement('a-sphere');
      sphere.setAttribute('radius', '0.02');
      sphere.setAttribute('material', {
        shader: 'standard',
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 1,
        metalness: 0,
        roughness: 0
      });
      
      // Añadir componentes al elemento
      el.appendChild(light);
      el.appendChild(sphere);
    }
  });