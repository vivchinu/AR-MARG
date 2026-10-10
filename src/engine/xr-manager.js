// Universal WebXR and Augmented Reality Manager
// Supports Meta Quest 3 Hand Tracking, Direct Finger Poke Interaction,
// Floating 3D Spatial UI Panel, and Mobile Camera AR Fallback

import * as THREE from 'three';
import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js';
import { SpatialUIPanel } from './spatial-ui.js';

export class XRManager {
  constructor(renderer, scene, camera, onActionCallback, onComponentTouchCallback) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.onActionCallback = onActionCallback;
    this.onComponentTouchCallback = onComponentTouchCallback;

    this.session = null;
    this.hitTestSource = null;
    this.hitTestSourceRequested = false;
    this.reticle = null;
    this.isPlaced = false;

    // 3D Spatial UI Console
    this.spatialUI = new SpatialUIPanel(this.scene, (action) => this.handleUIAction(action));

    // Quest 3 Controllers & Hands
    this.controllers = [];
    this.hands = [];
    this.handModelFactory = new XRHandModelFactory();
    this.fingerTipOrbs = [];

    this.raycaster = new THREE.Raycaster();
    this.tempMatrix = new THREE.Matrix4();
    this.tempVec = new THREE.Vector3();

    // Grabbing / Moving Panel state
    this.isGrabbingPanel = false;
    this.grabOffset = new THREE.Vector3();

    // Phone Camera Fallback
    this.videoElement = null;
    this.isCameraFallback = false;

    // Hardware status
    this.isWebXRSupported = false;
    this.checkWebXRSupport();
    this.setupReticle();
  }

  async checkWebXRSupport() {
    if ('xr' in navigator) {
      try {
        this.isWebXRSupported = await navigator.xr.isSessionSupported('immersive-ar');
      } catch (e) {
        this.isWebXRSupported = false;
      }
    }
    return this.isWebXRSupported;
  }

  setupReticle() {
    // Reticle ring for surface hit-testing on mobile phone AR
    const ringGeo = new THREE.RingGeometry(0.12, 0.15, 32).rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    this.reticle = new THREE.Mesh(ringGeo, ringMat);
    this.reticle.matrixAutoUpdate = false;
    this.reticle.visible = false;
    this.scene.add(this.reticle);

    const dotGeo = new THREE.CircleGeometry(0.03, 16).rotateX(-Math.PI / 2);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    this.reticle.add(dot);
  }

  /**
   * Enter WebXR Immersive AR (Meta Quest 3 or Android ARCore)
   */
  async startWebXRSession(equipmentRoot) {
    if (!('xr' in navigator)) {
      throw new Error("WebXR not available in this browser. Switching to Camera AR mode.");
    }

    const sessionInit = {
      requiredFeatures: ['local-floor'],
      optionalFeatures: ['hit-test', 'hand-tracking', 'mesh-detection', 'plane-detection', 'layers']
    };

    try {
      this.session = await navigator.xr.requestSession('immersive-ar', sessionInit);
    } catch (err) {
      console.warn("Retrying with 'local' reference space...", err);
      this.session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local'],
        optionalFeatures: ['hit-test', 'hand-tracking']
      });
    }

    this.renderer.xr.enabled = true;
    await this.renderer.xr.setSession(this.session);

    this.session.addEventListener('end', () => this.onSessionEnded());

    // Setup Quest 3 6-DoF Controllers & Hand Tracking
    this.setupControllersAndHands();

    // Setup hit-test for phones
    this.session.requestReferenceSpace('viewer').then((viewerSpace) => {
      this.session.requestHitTestSource({ space: viewerSpace }).then((source) => {
        this.hitTestSource = source;
      }).catch(e => console.log("Hit-test not supported on this device", e));
    });

    // In Quest 3, place equipment and position 3D UI Panel directly in front of the technician
    equipmentRoot.position.set(0, 0.95, -1.2); // 1.2 meters away at comfortable inspection height
    equipmentRoot.visible = true;
    this.isPlaced = true;

    // Position the 3D UI panel 0.85m directly in front of technician's eyes/chest
    setTimeout(() => {
      this.spatialUI.positionInFrontOfUser(this.camera, 0.85);
    }, 400);

    return this.session;
  }

  setupControllersAndHands() {
    // 1. Setup Controllers (with Laser Pointer Ray)
    for (let i = 0; i < 2; i++) {
      const controller = this.renderer.xr.getController(i);

      // Visual Laser Pointer Ray
      const rayGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -2.5)
      ]);
      const rayMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.65
      });
      const rayLine = new THREE.Line(rayGeo, rayMat);
      rayLine.name = 'rayLine';
      controller.add(rayLine);

      // Ray reticle tip dot
      const reticleTipGeo = new THREE.SphereGeometry(0.008, 12, 12);
      const reticleTipMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const reticleTip = new THREE.Mesh(reticleTipGeo, reticleTipMat);
      reticleTip.position.set(0, 0, -2.5);
      controller.add(reticleTip);

      controller.addEventListener('selectstart', () => {
        rayMat.color.setHex(0xf59e0b);
        this.handleRaycastSelect(controller);
      });
      controller.addEventListener('selectend', () => {
        rayMat.color.setHex(0x00f0ff);
        this.isGrabbingPanel = false;
      });

      this.scene.add(controller);
      this.controllers.push(controller);
    }

    // 2. Setup Meta Quest 3 Hand Tracking with Realistic Mesh & Finger Poke Orbs
    for (let i = 0; i < 2; i++) {
      const hand = this.renderer.xr.getHand(i);
      
      try {
        const handModel = this.handModelFactory.createHandModel(hand, 'mesh');
        hand.add(handModel);
      } catch (e) {
        console.warn("Hand mesh factory fallback:", e);
      }

      // Add Glowing Touch Cursor Orb to the Index Fingertip for poke interaction
      const orbGeo = new THREE.SphereGeometry(0.014, 16, 16);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.85
      });
      const fingerOrb = new THREE.Mesh(orbGeo, orbMat);
      fingerOrb.name = `fingerOrb_${i}`;
      this.scene.add(fingerOrb);
      this.fingerTipOrbs.push({ orb: fingerOrb, handIndex: i });

      this.scene.add(hand);
      this.hands.push(hand);
    }
  }

  handleRaycastSelect(controller) {
    this.tempMatrix.identity().extractRotation(controller.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

    // 1. Check if user clicked a button on the floating 3D panel
    const triggered = this.spatialUI.checkRaycast(this.raycaster, true);
    if (triggered) {
      this.triggerHaptic(controller);
      return;
    }

    // 2. Check if user clicked the panel grab handle to move the panel
    if (this.spatialUI.handleMesh) {
      const handleHits = this.raycaster.intersectObject(this.spatialUI.handleMesh, true);
      if (handleHits.length > 0) {
        this.isGrabbingPanel = true;
        this.grabController = controller;
        this.grabOffset.copy(this.spatialUI.group.position).sub(controller.position);
        return;
      }
    }

    // 3. Check if user clicked a 3D component on the machine
    if (this.onComponentTouchCallback) {
      this.onComponentTouchCallback(this.raycaster);
    }
  }

  triggerHaptic(controller, intensity = 0.7, duration = 60) {
    try {
      const session = this.renderer.xr.getSession();
      if (!session) return;
      for (const inputSource of session.inputSources) {
        if (inputSource.gamepad && inputSource.gamepad.hapticActuators && inputSource.gamepad.hapticActuators.length > 0) {
          inputSource.gamepad.hapticActuators[0].pulse(intensity, duration);
        }
      }
    } catch (e) {
      // Haptics optional
    }
  }

  handleUIAction(actionId) {
    if (actionId === 'summon') {
      // Summon panel directly in front of technician
      this.spatialUI.positionInFrontOfUser(this.camera, 0.85);
    } else if (this.onActionCallback) {
      this.onActionCallback(actionId);
    }
  }

  /**
   * Update dynamic content on the 3D Spatial UI Panel
   */
  updateSpatialUIContent(data) {
    this.spatialUI.updateContent(data);
  }

  /**
   * Start High-Performance Phone Camera Passthrough AR Fallback
   */
  async startCameraFallback(videoElement, equipmentRoot) {
    this.isCameraFallback = true;
    this.videoElement = videoElement;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      this.videoElement.srcObject = stream;
      await this.videoElement.play();
      this.videoElement.style.display = 'block';

      this.renderer.setClearColor(0x000000, 0);

      equipmentRoot.position.set(0, -0.2, -1.1);
      equipmentRoot.scale.set(0.7, 0.7, 0.7);
      equipmentRoot.visible = true;
      this.isPlaced = true;

      // Position 3D UI panel in camera view
      this.spatialUI.group.position.set(0.65, 0.15, -1.05);
      this.spatialUI.group.scale.set(0.7, 0.7, 0.7);
      this.spatialUI.group.lookAt(0, 0.15, 0);
      this.spatialUI.group.visible = true;

      return true;
    } catch (err) {
      console.error("Camera access error:", err);
      throw err;
    }
  }

  stopCameraFallback() {
    if (this.videoElement && this.videoElement.srcObject) {
      const stream = this.videoElement.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      this.videoElement.srcObject = null;
      this.videoElement.style.display = 'none';
    }
    this.isCameraFallback = false;
    this.renderer.setClearColor(0x0a101d, 1);
  }

  /**
   * Per-frame WebXR updates: Hand Tracking, Finger Poking & Raycasting
   */
  update(frame) {
    if (!this.session) return;

    const referenceSpace = this.renderer.xr.getReferenceSpace();

    // 1. Process Hand Tracking Joints & Direct Finger Poking
    for (let i = 0; i < this.hands.length; i++) {
      const hand = this.hands[i];
      const orbData = this.fingerTipOrbs[i];

      let fingerWorldPos = null;

      // Check if hand joint 'index-finger-tip' exists
      if (hand.joints && hand.joints['index-finger-tip']) {
        const indexTipJoint = hand.joints['index-finger-tip'];
        if (frame && referenceSpace) {
          const jointPose = frame.getJointPose(indexTipJoint, referenceSpace);
          if (jointPose) {
            fingerWorldPos = new THREE.Vector3(
              jointPose.transform.position.x,
              jointPose.transform.position.y,
              jointPose.transform.position.z
            );
          }
        }
      }

      // Fallback: If joint poses are represented as hand children
      if (!fingerWorldPos && hand.children.length > 0) {
        hand.children.forEach(child => {
          if (child.name && child.name.includes('index-finger-tip')) {
            fingerWorldPos = new THREE.Vector3().setFromMatrixPosition(child.matrixWorld);
          }
        });
      }

      // If hand is active but specific joint not exposed, use hand position offset
      if (!fingerWorldPos && hand.visible && hand.position.lengthSq() > 0.01) {
        fingerWorldPos = hand.position.clone().add(new THREE.Vector3(0, 0, -0.08).applyQuaternion(hand.quaternion));
      }

      // Update glowing touch cursor orb & perform poke collision check
      if (fingerWorldPos) {
        orbData.orb.position.copy(fingerWorldPos);
        orbData.orb.visible = true;

        // Check physical poke collision against 3D tactile buttons
        const pokedAction = this.spatialUI.checkFingerPoke(fingerWorldPos);
        if (pokedAction) {
          orbData.orb.material.color.setHex(0xf59e0b);
          setTimeout(() => orbData.orb.material.color.setHex(0x00f0ff), 200);
        }
      } else {
        orbData.orb.visible = false;
      }
    }

    // 2. Controller hover raycasting for 3D buttons
    for (const controller of this.controllers) {
      if (controller.visible) {
        this.tempMatrix.identity().extractRotation(controller.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
        this.spatialUI.checkRaycast(this.raycaster, false);
      }
    }

    // 3. Move panel if currently grabbed by technician
    if (this.isGrabbingPanel && this.grabController) {
      const newPos = this.grabController.position.clone().add(this.grabOffset);
      this.spatialUI.group.position.copy(newPos);
      this.spatialUI.group.lookAt(this.camera.position.x, newPos.y, this.camera.position.z);
    }

    // 4. Hit-test for phone AR placement
    if (this.hitTestSource && !this.isPlaced) {
      const hitTestResults = frame.getHitTestResults(this.hitTestSource);
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);
        this.reticle.visible = true;
        this.reticle.matrix.fromArray(pose.transform.matrix);
      } else {
        this.reticle.visible = false;
      }
    }
  }

  onSessionEnded() {
    this.hitTestSourceRequested = false;
    this.hitTestSource = null;
    this.session = null;
    this.renderer.xr.enabled = false;
    this.isGrabbingPanel = false;
    if (this.spatialUI) {
      this.spatialUI.group.visible = false;
    }
    if (this.reticle) {
      this.reticle.visible = false;
    }
    this.fingerTipOrbs.forEach(o => { o.orb.visible = false; });
  }
}
