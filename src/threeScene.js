import * as THREE from 'three';

export class Romance3DScene {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.heartState = 'normal'; // 'normal' | 'supernova'
    this.heartScale = 1;

    this.initCamera();
    this.initRenderer();
    this.createStarfield();
    this.create3DParticleHeart();
    this.createFloatingPetals();
    this.bindEvents();
    this.animate();
  }

  initCamera() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.z = 32;
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // Create subtle circular texture for glowing particle dots
  getParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 130, 180, 0.8)');
    gradient.addColorStop(0.7, 'rgba(255, 50, 120, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  // Background starry universe
  createStarfield() {
    const starCount = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const color1 = new THREE.Color('#ffffff');
    const color2 = new THREE.Color('#ff85a1');
    const color3 = new THREE.Color('#b388ff');

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 20;

      const mixedColor = Math.random() > 0.6 ? color2 : (Math.random() > 0.5 ? color3 : color1);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      map: this.getParticleTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  // Mathematical 3D Parametric Heart
  create3DParticleHeart() {
    const particleCount = 8500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    this.originalHeartPositions = new Float32Array(particleCount * 3);
    this.heartVelocities = new Float32Array(particleCount * 3);

    const baseColor1 = new THREE.Color('#ff2d60'); // Bright hot pink
    const baseColor2 = new THREE.Color('#ff758c'); // Soft rose
    const baseColor3 = new THREE.Color('#ffd1dc'); // Highlight pink/white

    for (let i = 0; i < particleCount; i++) {
      // Parametric 3D Heart coordinates
      const t = Math.PI * 2 * Math.random();
      const u = Math.PI * (Math.random() - 0.5);

      // Core heart formula
      let x = 16 * Math.pow(Math.sin(t), 3);
      let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      let z = u * 10 * Math.sin(t);

      // Add volumetric thickness & natural jitter
      const thickness = (Math.random() - 0.5) * 4;
      x += thickness * Math.sin(t);
      y += thickness * Math.cos(t);
      z += thickness * 3;

      // Scale to fit scene comfortably
      const scale = 0.55;
      x *= scale;
      y *= scale;
      z *= scale;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y + 1.5; // Slight vertical centering
      positions[i * 3 + 2] = z;

      this.originalHeartPositions[i * 3] = x;
      this.originalHeartPositions[i * 3 + 1] = y + 1.5;
      this.originalHeartPositions[i * 3 + 2] = z;

      // Velocities for supernova effect
      this.heartVelocities[i * 3] = (Math.random() - 0.5) * 0.4;
      this.heartVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      this.heartVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      // Gradient coloring
      const colorRatio = Math.random();
      const c = colorRatio > 0.7 ? baseColor3 : (colorRatio > 0.3 ? baseColor1 : baseColor2);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      map: this.getParticleTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    });

    this.heart = new THREE.Points(geometry, material);
    this.scene.add(this.heart);
  }

  // Floating ambient light petals
  createFloatingPetals() {
    const petalCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(petalCount * 3);
    this.petalVelocities = [];

    for (let i = 0; i < petalCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      this.petalVelocities.push({
        y: -0.02 - Math.random() * 0.03,
        x: (Math.random() - 0.5) * 0.02,
        rotSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 1.4,
      color: new THREE.Color('#ff85a1'),
      map: this.getParticleTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });

    this.petals = new THREE.Points(geometry, material);
    this.scene.add(this.petals);
  }

  // Trigger heart celebration explosion
  triggerSupernova() {
    this.heartState = 'supernova';
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    window.addEventListener('pointermove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth mouse parallax lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Slow stars rotation
    if (this.stars) {
      this.stars.rotation.y = elapsedTime * 0.03;
      this.stars.rotation.x = this.mouse.y * 0.08;
    }

    // Heart pulsation & rotation
    if (this.heart) {
      if (this.heartState === 'normal') {
        // Realistic double heartbeat rhythm (lub-dub)
        const t = elapsedTime * 3.2;
        const beat = Math.sin(t) * 0.07 + Math.sin(t * 2) * 0.03;
        const scale = 1 + Math.max(0, beat);
        this.heart.scale.set(scale, scale, scale);

        // Smooth interactive rotation
        this.heart.rotation.y = Math.sin(elapsedTime * 0.4) * 0.2 + this.mouse.x * 0.4;
        this.heart.rotation.x = Math.cos(elapsedTime * 0.3) * 0.1 - this.mouse.y * 0.2;
        this.heart.rotation.z = Math.sin(elapsedTime * 0.2) * 0.05;
      } else if (this.heartState === 'supernova') {
        // Supernova explosion: particles expand outward with glittering speed
        const positions = this.heart.geometry.attributes.position.array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3] += this.heartVelocities[i * 3] * 1.5;
          positions[i * 3 + 1] += this.heartVelocities[i * 3 + 1] * 1.5;
          positions[i * 3 + 2] += this.heartVelocities[i * 3 + 2] * 1.5;
        }
        this.heart.geometry.attributes.position.needsUpdate = true;
        this.heart.rotation.y += 0.02;
      }
    }

    // Animate falling petals
    if (this.petals) {
      const petalPositions = this.petals.geometry.attributes.position.array;
      for (let i = 0; i < this.petalVelocities.length; i++) {
        petalPositions[i * 3 + 1] += this.petalVelocities[i].y;
        petalPositions[i * 3] += Math.sin(elapsedTime + i) * 0.01;

        // Reset when fallen below screen
        if (petalPositions[i * 3 + 1] < -20) {
          petalPositions[i * 3 + 1] = 20;
          petalPositions[i * 3] = (Math.random() - 0.5) * 40;
        }
      }
      this.petals.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
