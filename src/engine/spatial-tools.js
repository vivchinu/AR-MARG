// Interactive Virtual AR Tools with Offline Web Audio SFX
// Thermal Scanner, Multimeter, Torque Wrench, and Inspection Loupe

import * as THREE from 'three';

export class SpatialToolController {
  constructor(scene) {
    this.scene = scene;
    this.activeTool = null;
    this.toolGroup = new THREE.Group();
    this.toolGroup.name = 'SPATIAL_TOOL_GROUP';
    this.scene.add(this.toolGroup);

    this.audioCtx = null;
    this.initAudio();
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn("Web Audio not supported", e);
    }
  }

  playBeep(freq = 880, duration = 0.15, type = 'sine') {
    if (!this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (err) {
      console.warn(err);
    }
  }

  playRatchetClick() {
    this.playBeep(1200, 0.04, 'square');
  }

  playWarningAlarm() {
    this.playBeep(440, 0.2, 'sawtooth');
    setTimeout(() => this.playBeep(880, 0.25, 'sawtooth'), 220);
  }

  /**
   * Deploy or move tool to target component position
   */
  deployTool(toolType, targetPos = new THREE.Vector3(0, 0.5, 0)) {
    // Clear existing tool mesh
    while (this.toolGroup.children.length > 0) {
      this.toolGroup.remove(this.toolGroup.children[0]);
    }

    this.activeTool = toolType;
    if (!toolType) return;

    const toolMesh = this.createToolMesh(toolType);
    if (!toolMesh) return;

    // Position tool offset slightly in front/above target position
    const offset = new THREE.Vector3(0.15, 0.2, 0.25);
    toolMesh.position.copy(targetPos).add(offset);
    toolMesh.lookAt(targetPos);

    this.toolGroup.add(toolMesh);

    // Audio cue
    this.playBeep(640, 0.1, 'sine');

    return toolMesh;
  }

  createToolMesh(type) {
    const group = new THREE.Group();

    if (type === 'thermal_scanner') {
      // IR Thermal Pistol
      const bodyGeo = new THREE.BoxGeometry(0.07, 0.14, 0.12);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(body);

      // Handle
      const handleGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.14, 16);
      handleGeo.rotateX(0.3);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });
      const handle = new THREE.Mesh(handleGeo, handleMat);
      handle.position.set(0, -0.11, 0.03);
      group.add(handle);

      // Display Screen
      const screenGeo = new THREE.PlaneGeometry(0.05, 0.06);
      const screenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 0.02, 0.061);
      group.add(screen);

      // Laser Pointer Beam
      const beamGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.6, 8);
      beamGeo.rotateX(Math.PI / 2);
      const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0044, transparent: true, opacity: 0.75 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 0.03, -0.36);
      group.add(beam);
    } 
    else if (type === 'multimeter') {
      // Yellow Digital Multimeter
      const dmmGeo = new THREE.BoxGeometry(0.1, 0.18, 0.04);
      const dmmMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
      const dmm = new THREE.Mesh(dmmGeo, dmmMat);
      group.add(dmm);

      // Screen
      const screenGeo = new THREE.PlaneGeometry(0.08, 0.04);
      const screenMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 0.05, 0.021);
      group.add(screen);

      // Red and Black Probes
      const redProbeGeo = new THREE.CylinderGeometry(0.006, 0.002, 0.18, 12);
      redProbeGeo.rotateX(Math.PI / 3);
      const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
      const redProbe = new THREE.Mesh(redProbeGeo, redMat);
      redProbe.position.set(-0.06, -0.08, -0.15);
      group.add(redProbe);

      const blackProbeGeo = redProbeGeo.clone();
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
      const blackProbe = new THREE.Mesh(blackProbeGeo, blackMat);
      blackProbe.position.set(0.06, -0.08, -0.15);
      group.add(blackProbe);
    } 
    else if (type === 'torque_wrench') {
      // Ratchet Torque Wrench
      const handleGeo = new THREE.CylinderGeometry(0.014, 0.016, 0.35, 16);
      handleGeo.rotateZ(Math.PI / 2);
      const wrenchMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.2 });
      const handle = new THREE.Mesh(handleGeo, wrenchMat);
      group.add(handle);

      // Ratchet Head & Socket
      const headGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.04, 16);
      const head = new THREE.Mesh(headGeo, wrenchMat);
      head.position.set(-0.18, 0, 0);
      group.add(head);

      const socketGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.06, 12);
      socketGeo.rotateX(Math.PI / 2);
      const socket = new THREE.Mesh(socketGeo, wrenchMat);
      socket.position.set(-0.18, 0, 0.04);
      group.add(socket);

      // Torque Scale Gauge Ring
      const ringGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.08, 16);
      ringGeo.rotateZ(Math.PI / 2);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0.08, 0, 0);
      group.add(ring);
    } 
    else {
      // Visual Loupe / Endoscope
      const lensRingGeo = new THREE.TorusGeometry(0.06, 0.008, 16, 32);
      const lensMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8 });
      const ring = new THREE.Mesh(lensRingGeo, lensMat);
      group.add(ring);

      const glassGeo = new THREE.CircleGeometry(0.058, 32);
      const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, roughness: 0.05, transmission: 0.9 });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      group.add(glass);

      const handleGeo = new THREE.CylinderGeometry(0.01, 0.012, 0.16, 12);
      handleGeo.rotateZ(Math.PI / 4);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
      const handle = new THREE.Mesh(handleGeo, handleMat);
      handle.position.set(0.08, -0.08, 0);
      group.add(handle);
    }

    return group;
  }

  animateWrenchAction(onFinish) {
    if (!this.toolGroup || this.activeTool !== 'torque_wrench') return;
    let ticks = 0;
    const interval = setInterval(() => {
      this.playRatchetClick();
      this.toolGroup.rotation.z += 0.15;
      ticks++;
      if (ticks > 5) {
        clearInterval(interval);
        this.playBeep(980, 0.2, 'triangle');
        if (onFinish) onFinish();
      }
    }, 120);
  }

  animateMultimeterAction(onFinish) {
    this.playBeep(1200, 0.4, 'sine');
    if (onFinish) setTimeout(onFinish, 450);
  }

  animateThermalAction(onFinish) {
    this.playBeep(750, 0.15, 'sawtooth');
    setTimeout(() => this.playBeep(900, 0.15, 'sawtooth'), 180);
    if (onFinish) setTimeout(onFinish, 400);
  }
}
