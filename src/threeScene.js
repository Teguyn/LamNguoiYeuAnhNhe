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

  // Create smooth radial gradient particle texture
  getParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(255, 120, 170, 0.9)');
    gradient.addColorStop(0.6, 'rgba(255, 45, 96, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  // Background starry universe
  createStarfield() {
    const starCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const cWhite = new THREE.Color('#ffffff');
    const cRose = new THREE.Color('#ff85a1');
    const cViolet = new THREE.Color('#c084fc');

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
      size: 0.55,
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

  // Floating ambient stardust & fireflies
  createFireflies() {
    const fireflyCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(fireflyCount * 3);
    this.fireflySpeeds = [];

    for (let i = 0; i < fireflyCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      this.fireflySpeeds.push({
        x: (Math.random() - 0.5) * 0.02,
        y: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 1.1,
      color: new THREE.Color('#ffd166'),
      map: this.getParticleTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    });

    this.fireflies = new THREE.Points(geometry, material);
    this.scene.add(this.fireflies);
  }

  // 3D Mathematical Parametric Heart with core & outer halo
  create3DParticleHeart() {
    const particleCount = 9500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    this.heartVelocities = new Float32Array(particleCount * 3);

    const cCrimson = new THREE.Color('#ff1744');
    const cRose = new THREE.Color('#ff4081');
    const cGold = new THREE.Color('#ffeaa7');

    for (let i = 0; i < particleCount; i++) {
      const t = Math.PI * 2 * Math.random();
      const u = Math.PI * (Math.random() - 0.5);

      let x = 16 * Math.pow(Math.sin(t), 3);
      let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      let z = u * 11 * Math.sin(t);

      // Volume expansion & 3D curvature
      const thickness = (Math.random() - 0.5) * 3.8;
      x += thickness * Math.sin(t);
      y += thickness * Math.cos(t);
      z += thickness * 3.2;

      // Fit gracefully into frame
      const scale = 0.52;
      x *= scale;
      y *= scale;
      z *= scale;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y + 1.2;
      positions[i * 3 + 2] = z;

      this.heartVelocities[i * 3] = (Math.random() - 0.5) * 0.45;
      this.heartVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.45;
      this.heartVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.45;

      const ratio = Math.random();
      const col = ratio > 0.8 ? cGold : (ratio > 0.4 ? cCrimson : cRose);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.95,
      vertexColors: true,
      map: this.getParticleTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.92,
      depthWrite: false
    });

    this.heart = new THREE.Points(geometry, material);
    this.scene.add(this.heart);
  }

  // REALISTIC 3D ROSE PETALS (Geometric Curved Meshes)
  create3DRosePetals() {
    this.petalMeshes = [];
    this.petalGroup = new THREE.Group();

    // Create an organic curved rose petal geometry
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, -0.6);
    petalShape.bezierCurveTo(0.5, -0.3, 0.7, 0.4, 0, 0.8);
    petalShape.bezierCurveTo(-0.7, 0.4, -0.5, -0.3, 0, -0.6);

    const baseGeometry = new THREE.ShapeGeometry(petalShape, 12);

    // Curve the petal vertices so it's not flat
    const pos = baseGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      // Gentle spoon cup curve
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

    const petalCount = 45;

    for (let i = 0; i < petalCount; i++) {
      const color = petalColors[i % petalColors.length];
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75 + Math.random() * 0.2
      });

      const mesh = new THREE.Mesh(baseGeometry, material);

      // Random initial position spread
      mesh.position.set(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 25
      );

      // Random scale for natural variance
      const scale = 0.7 + Math.random() * 0.8;
      mesh.scale.set(scale, scale, scale);

      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // Custom velocity & rotational tumbling speeds
      mesh.userData = {
        fallSpeed: 0.03 + Math.random() * 0.04,
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

    // Mouse parallax smoothing
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Stars gentle motion
    if (this.stars) {
      this.stars.rotation.y = elapsedTime * 0.025;
      this.stars.rotation.x = this.mouse.y * 0.06;
    }

    // Fireflies floating
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

    // 3D Heart pulsation
    if (this.heart) {
      if (this.heartState === 'normal') {
        const t = elapsedTime * 3.4;
        const beat = Math.sin(t) * 0.08 + Math.sin(t * 2) * 0.035;
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

    // 3D Rose Petals Falling & Tumbling with Wind
    if (this.petalMeshes) {
      for (let i = 0; i < this.petalMeshes.length; i++) {
        const petal = this.petalMeshes[i];
        const data = petal.userData;

        // Falling down
        petal.position.y -= data.fallSpeed;

        // Gentle organic wind drift
        petal.position.x += Math.sin(elapsedTime * data.oscillationSpeed + data.phase) * 0.03 + data.driftSpeedX;
        petal.position.z += Math.cos(elapsedTime * data.oscillationSpeed + data.phase) * 0.02 + data.driftSpeedZ;

        // 3D tumbling rotation
        petal.rotation.x += data.rotSpeedX;
        petal.rotation.y += data.rotSpeedY;
        petal.rotation.z += data.rotSpeedZ;

        // Reset to top when fallen off screen
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
