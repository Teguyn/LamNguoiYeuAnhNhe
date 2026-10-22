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
    this.createFireflies();
    this.create3DParticleHeart();
    this.create3DRosePetals();
    this.bindEvents();
    this.animate();
  }

  initCamera() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 1000);
    // Bring camera closer so the 3D Heart is prominently visible
    this.camera.position.z = 25;
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

  // Create high-luminance glowing circular texture for heart particles
  getHeartParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 140, 180, 0.95)');
    gradient.addColorStop(0.5, 'rgba(255, 45, 96, 0.6)');
    gradient.addColorStop(0.8, 'rgba(255, 20, 80, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    return new THREE.CanvasTexture(canvas);
  }

  // Background starry universe
  createStarfield() {
    const starCount = 2200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const cWhite = new THREE.Color('#ffffff');
    const cRose = new THREE.Color('#ff85a1');
    const cViolet = new THREE.Color('#d8b4fe');

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 30;

      const rand = Math.random();
      const col = rand > 0.7 ? cRose : (rand > 0.4 ? cViolet : cWhite);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      map: this.getHeartParticleTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  // Floating ambient stardust & warm candlelight fireflies
  createFireflies() {
    const fireflyCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(fireflyCount * 3);
    this.fireflySpeeds = [];

    for (let i = 0; i < fireflyCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      this.fireflySpeeds.push({
        x: (Math.random() - 0.5) * 0.02,
        y: 0.015 + Math.random() * 0.025,
        phase: Math.random() * Math.PI * 2
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 1.3,
      color: new THREE.Color('#ffeaa7'),
      map: this.getHeartParticleTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });

    this.fireflies = new THREE.Points(geometry, material);
    this.scene.add(this.fireflies);
  }

  // MAJESTIC 3D PARAMETRIC HEART (MUCH LARGER, BRIGHTER & GLOWING)
  create3DParticleHeart() {
    // 14,000 luminous particles for ultra-dense, vivid 3D heart
    const particleCount = 14000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    this.heartVelocities = new Float32Array(particleCount * 3);

    const cRuby = new THREE.Color('#ff0055');
    const cRoseNeon = new THREE.Color('#ff2d75');
    const cBlush = new THREE.Color('#ff7597');
    const cGoldHighlight = new THREE.Color('#fff2c2');

    for (let i = 0; i < particleCount; i++) {
      const t = Math.PI * 2 * Math.random();
      const u = Math.PI * (Math.random() - 0.5);

      // Parametric formula for 3D Heart
      let x = 16 * Math.pow(Math.sin(t), 3);
      let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      let z = u * 12 * Math.sin(t);

      // Rich volumetric dispersion & soft depth
      const thickness = (Math.random() - 0.5) * 4.2;
      x += thickness * Math.sin(t);
      y += thickness * Math.cos(t);
      z += thickness * 3.5;

      // Scale enlarged to 0.74 so it visibly wraps and frames the viewport
      const scale = 0.74;
      x *= scale;
      y *= scale;
      z *= scale;

      positions[i * 3] = x;
      // Positioned slightly higher so upper lobes rise above and frame content
      positions[i * 3 + 1] = y + 2.2;
      positions[i * 3 + 2] = z - 2;

      this.heartVelocities[i * 3] = (Math.random() - 0.5) * 0.45;
      this.heartVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.45;
      this.heartVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.45;

      const ratio = Math.random();
      let col;
      if (ratio > 0.85) col = cGoldHighlight;
      else if (ratio > 0.5) col = cRoseNeon;
      else if (ratio > 0.2) col = cRuby;
      else col = cBlush;

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.25, // Larger, more brilliant particle points
      vertexColors: true,
      map: this.getHeartParticleTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.98,
      depthWrite: false
    });

    this.heart = new THREE.Points(geometry, material);
    this.scene.add(this.heart);
  }

  // REALISTIC 3D ROSE PETALS (Geometric Curved Meshes)
  create3DRosePetals() {
    this.petalMeshes = [];
    this.petalGroup = new THREE.Group();

    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, -0.6);
    petalShape.bezierCurveTo(0.5, -0.3, 0.7, 0.4, 0, 0.8);
    petalShape.bezierCurveTo(-0.7, 0.4, -0.5, -0.3, 0, -0.6);

    const baseGeometry = new THREE.ShapeGeometry(petalShape, 12);

    const pos = baseGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const pz = -Math.sin(Math.abs(px) * 2) * 0.25 + (py * py) * 0.12;
      pos.setZ(i, pz);
    }
    baseGeometry.computeVertexNormals();

    const petalColors = [
      '#e11d48', // Rich crimson rose
      '#f43f5e', // Vibrant rose pink
      '#be123c', // Deep wine velvet
      '#fda4af'  // Tender pink highlight
    ];

    const petalCount = 50;

    for (let i = 0; i < petalCount; i++) {
      const color = petalColors[i % petalColors.length];
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8 + Math.random() * 0.2
      });

      const mesh = new THREE.Mesh(baseGeometry, material);

      mesh.position.set(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 25
      );

      const scale = 0.75 + Math.random() * 0.8;
      mesh.scale.set(scale, scale, scale);

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.userData = {
        fallSpeed: 0.028 + Math.random() * 0.038,
        driftSpeedX: (Math.random() - 0.5) * 0.015,
        driftSpeedZ: (Math.random() - 0.5) * 0.015,
        rotSpeedX: (Math.random() - 0.5) * 0.025,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        oscillationSpeed: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2
      };

      this.petalMeshes.push(mesh);
      this.petalGroup.add(mesh);
    }

    this.scene.add(this.petalGroup);
  }

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

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    if (this.stars) {
      this.stars.rotation.y = elapsedTime * 0.02;
      this.stars.rotation.x = this.mouse.y * 0.05;
    }

    if (this.fireflies) {
      const positions = this.fireflies.geometry.attributes.position.array;
      for (let i = 0; i < this.fireflySpeeds.length; i++) {
        const speed = this.fireflySpeeds[i];
        positions[i * 3 + 1] += speed.y;
        positions[i * 3] += Math.sin(elapsedTime * 0.8 + speed.phase) * 0.02;

        if (positions[i * 3 + 1] > 25) {
          positions[i * 3 + 1] = -25;
          positions[i * 3] = (Math.random() - 0.5) * 60;
        }
      }
      this.fireflies.geometry.attributes.position.needsUpdate = true;
    }

    // 3D Heart realistic pulsation & interactive rotation
    if (this.heart) {
      if (this.heartState === 'normal') {
        const t = elapsedTime * 3.4;
        const beat = Math.sin(t) * 0.085 + Math.sin(t * 2) * 0.04;
        const scale = 1 + Math.max(0, beat);
        this.heart.scale.set(scale, scale, scale);

        this.heart.rotation.y = Math.sin(elapsedTime * 0.35) * 0.2 + this.mouse.x * 0.35;
        this.heart.rotation.x = Math.cos(elapsedTime * 0.25) * 0.1 - this.mouse.y * 0.2;
        this.heart.rotation.z = Math.sin(elapsedTime * 0.2) * 0.04;
      } else if (this.heartState === 'supernova') {
        const positions = this.heart.geometry.attributes.position.array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3] += this.heartVelocities[i * 3] * 1.6;
          positions[i * 3 + 1] += this.heartVelocities[i * 3 + 1] * 1.6;
          positions[i * 3 + 2] += this.heartVelocities[i * 3 + 2] * 1.6;
        }
        this.heart.geometry.attributes.position.needsUpdate = true;
        this.heart.rotation.y += 0.03;
      }
    }

    // 3D Rose Petals Falling & Tumbling
    if (this.petalMeshes) {
      for (let i = 0; i < this.petalMeshes.length; i++) {
        const petal = this.petalMeshes[i];
        const data = petal.userData;

        petal.position.y -= data.fallSpeed;
        petal.position.x += Math.sin(elapsedTime * data.oscillationSpeed + data.phase) * 0.03 + data.driftSpeedX;
        petal.position.z += Math.cos(elapsedTime * data.oscillationSpeed + data.phase) * 0.02 + data.driftSpeedZ;

        petal.rotation.x += data.rotSpeedX;
        petal.rotation.y += data.rotSpeedY;
        petal.rotation.z += data.rotSpeedZ;

        if (petal.position.y < -22) {
          petal.position.y = 24;
          petal.position.x = (Math.random() - 0.5) * 45;
          petal.position.z = (Math.random() - 0.5) * 25;
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
