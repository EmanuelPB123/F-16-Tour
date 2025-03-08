AFRAME.registerComponent('model-error', {
  init: function () {
    this.el.addEventListener('model-error', function (e) {
      console.error('Error loading 3D model:', e);
    });
  }
});

AFRAME.registerComponent('custom-controls', {
  init: function () {
    this.el.removeAttribute('wasd-controls');

    this.camera = this.el;
    this.moveSpeed = 0.1; // Scaled from 0.15 to 0.003 (1/50)
    this.currentSpeed = { x: 0, z: 0 };
    this.moveDirection = new THREE.Vector2(0, 0);
    this.keyboardDirection = new THREE.Vector2(0, 0);
    this.keys = {
      KeyW: false,
      KeyS: false,
      KeyA: false,
      KeyD: false,
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false
    };

    // Nipplejs joystick setup
    const options = {
      zone: document.getElementById('movement-controls'),
      mode: 'static',
      position: { left: '60px', bottom: '60px' },
      color: 'white',
      size: 120
    };

    const manager = nipplejs.create(options);

    manager.on('move', (evt, data) => {
      const angle = (data.angle.radian + Math.PI / 2);
      const force = Math.min(data.force, 1);

      this.moveDirection.x = Math.sin(angle) * force;
      this.moveDirection.y = -Math.cos(angle) * force;
    });

    manager.on('end', () => {
      this.moveDirection.set(0, 0);
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (this.keys.hasOwnProperty(e.code)) {
        this.keys[e.code] = true;
        e.preventDefault();
        return false;
      }
    }, true);

    window.addEventListener('keyup', (e) => {
      if (this.keys.hasOwnProperty(e.code)) {
        this.keys[e.code] = false;
        e.preventDefault();
        return false;
      }
    }, true);

    window.addEventListener('keypress', (e) => {
      if (this.keys.hasOwnProperty(e.code)) {
        e.preventDefault();
        return false;
      }
    }, true);

    this.tick = AFRAME.utils.throttleTick(this.tick.bind(this), 16);
  },

  updateKeyboardDirection: function () {
    this.keyboardDirection.set(0, 0);

    if (this.keys.KeyW || this.keys.ArrowUp) this.keyboardDirection.y += 1;
    if (this.keys.KeyS || this.keys.ArrowDown) this.keyboardDirection.y -= 1;
    if (this.keys.KeyD || this.keys.ArrowRight) this.keyboardDirection.x += 1;
    if (this.keys.KeyA || this.keys.ArrowLeft) this.keyboardDirection.x -= 1;

    if (this.keyboardDirection.length() > 1) {
      this.keyboardDirection.normalize();
    }
  },

  tick: function () {
    this.updateKeyboardDirection();

    const combinedMove = new THREE.Vector2(
      this.moveDirection.x + this.keyboardDirection.x,
      this.moveDirection.y + this.keyboardDirection.y
    );

    if (combinedMove.length() > 0) {
      const rotation = this.camera.object3D.rotation;
      const forward = new THREE.Vector3(0, 0, -1);
      const right = new THREE.Vector3(1, 0, 0);

      forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.y);
      right.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.y);

      const moveVector = new THREE.Vector3();
      moveVector.addScaledVector(forward, combinedMove.y * this.moveSpeed);
      moveVector.addScaledVector(right, combinedMove.x * this.moveSpeed);

      const currentPosition = this.camera.object3D.position;
      currentPosition.add(moveVector);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const models = document.querySelectorAll('[gltf-model], [obj-model]');
  models.forEach(model => {
    model.setAttribute('model-error', '');
  });

  const camera = document.querySelector('a-camera');
  camera.removeAttribute('wasd-controls');
  camera.setAttribute('custom-controls', '');
});