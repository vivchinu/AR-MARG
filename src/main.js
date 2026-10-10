// Main Controller for AR-MARG Offline WebXR Maintenance Assistant
// Integrates Three.js, WebXR, Spatial Tools, Fault Analyzer, and Bilingual UI

import * as THREE from 'three';
import { MANUALS } from './data/manuals.js';
import { TRANSLATIONS } from './data/translations.js';
import { EquipmentModelFactory } from './engine/equipment-models.js';
import { SpatialToolController } from './engine/spatial-tools.js';
import { XRManager } from './engine/xr-manager.js';
import { FaultAnalyzer } from './engine/fault-analyzer.js';
import { generateTestFaultImage } from './data/sample-fault-images.js';

class ARMargApp {
  constructor() {
    this.currentLang = 'gu'; // Default to Gujarati as requested
    this.currentManual = MANUALS[0];
    this.currentFault = MANUALS[0].faults[0];
    this.currentStepIndex = 0;

    this.activeModelType = 'pump';
    this.equipmentRoot = new THREE.Group();
    this.equipmentRoot.name = 'EQUIPMENT_CONTAINER';

    this.isExploded = false;
    this.explodedProgress = 0;
    this.isThermalMode = false;
    this.isXrayMode = false;
    this.isSpeaking = false;

    // Pin Marker
    this.markerPin = null;

    // Orbit/Drag touch state
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.cameraDistance = 2.2;
    this.cameraRotation = { x: 0.35, y: -0.45 };

    this.initThree();
    this.initControllers();
    this.initUI();
    this.loadEquipmentModel('pump');
    this.updateTroubleshootingView();
    this.registerPWA();
  }

  /* ------------------------------------------------------------------------
     Three.js Setup
     ------------------------------------------------------------------------ */
  initThree() {
    const canvas = document.getElementById('webgl-canvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
    this.updateCameraTransform();

    // Studio & Industrial Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.2);
    dirLight1.position.set(3, 4, 3);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight2.position.set(-3, 3, -2);
    this.scene.add(dirLight2);

    // Glowing Spot Light for highlighted component
    this.componentSpotlight = new THREE.PointLight(0x00f0ff, 2.5, 3.0);
    this.componentSpotlight.position.set(0, 1.5, 0);
    this.scene.add(this.componentSpotlight);

    // Grid Floor (only in desktop/sandbox mode)
    this.gridHelper = new THREE.GridHelper(6, 24, 0x00f0ff, 0x1e293b);
    this.gridHelper.position.y = -0.01;
    this.scene.add(this.gridHelper);

    this.scene.add(this.equipmentRoot);

    // Create 3D Spatial Marker Pin
    this.createSpatialPin();

    // Window Resize listener
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Touch & Mouse Orbit Controls
    this.setupInteractionControls(canvas);

    // Main Render Loop (WebXR compatible)
    this.renderer.setAnimationLoop((timestamp, frame) => {
      this.renderLoop(timestamp, frame);
    });
  }

  updateCameraTransform() {
    const x = this.cameraDistance * Math.sin(this.cameraRotation.y) * Math.cos(this.cameraRotation.x);
    const y = this.cameraDistance * Math.sin(this.cameraRotation.x) + 0.35;
    const z = this.cameraDistance * Math.cos(this.cameraRotation.y) * Math.cos(this.cameraRotation.x);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0.35, 0);
  }

  setupInteractionControls(canvas) {
    canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { this.isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.prevMousePos.x;
      const deltaY = e.clientY - this.prevMousePos.y;

      this.cameraRotation.y -= deltaX * 0.008;
      this.cameraRotation.x = Math.max(-1.1, Math.min(1.2, this.cameraRotation.x + deltaY * 0.008));

      this.updateCameraTransform();
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    // Wheel zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraDistance = Math.max(0.6, Math.min(4.5, this.cameraDistance + e.deltaY * 0.002));
      this.updateCameraTransform();
    }, { passive: false });

    // Touch gestures for mobile
    let initialTouchDist = null;
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        initialTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        const deltaX = e.touches[0].clientX - this.prevMousePos.x;
        const deltaY = e.touches[0].clientY - this.prevMousePos.y;

        this.cameraRotation.y -= deltaX * 0.01;
        this.cameraRotation.x = Math.max(-1.1, Math.min(1.2, this.cameraRotation.x + deltaY * 0.01));

        this.updateCameraTransform();
        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && initialTouchDist) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = initialTouchDist - currentDist;
        this.cameraDistance = Math.max(0.6, Math.min(4.5, this.cameraDistance + diff * 0.005));
        this.updateCameraTransform();
        initialTouchDist = currentDist;
      }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      this.isDragging = false;
      initialTouchDist = null;
    });

    // Direct 3D Click & Touch Raycaster for desktop & mobile screen interaction
    canvas.addEventListener('click', (e) => {
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      const ray = new THREE.Raycaster();
      ray.setFromCamera(mouse, this.camera);

      // 1. Check if clicked a button on the 3D floating Spatial UI panel
      if (this.xrManager && this.xrManager.spatialUI) {
        const triggered = this.xrManager.spatialUI.checkRaycast(ray, true);
        if (triggered) {
          this.spatialTools.playBeep(880, 0.1, 'sine');
          return;
        }
      }

      // 2. Check if clicked a machine component
      this.handleComponentTouch(ray);
    });
  }

  createSpatialPin() {
    const pinGroup = new THREE.Group();
    pinGroup.name = 'SPATIAL_PIN';

    // Glowing Halo Ring
    const ringGeo = new THREE.RingGeometry(0.04, 0.06, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.name = 'pinRing';
    pinGroup.add(ring);

    // Cone arrow pointing down
    const coneGeo = new THREE.ConeGeometry(0.025, 0.08, 16);
    coneGeo.rotateX(Math.PI);
    const coneMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.y = -0.05;
    pinGroup.add(cone);

    pinGroup.position.set(0, 0.7, 0);
    this.scene.add(pinGroup);
    this.markerPin = pinGroup;
  }

  /* ------------------------------------------------------------------------
     Controller & Subsystem Initialization
     ------------------------------------------------------------------------ */
  initControllers() {
    this.modelFactory = new EquipmentModelFactory();
    this.spatialTools = new SpatialToolController(this.scene);
    this.faultAnalyzer = new FaultAnalyzer();
    this.xrManager = new XRManager(
      this.renderer,
      this.scene,
      this.camera,
      (actionId) => this.handleXRAction(actionId),
      (raycaster) => this.handleComponentTouch(raycaster)
    );

    // Initial position for 3D Spatial UI console in desktop/sandbox mode
    if (this.xrManager.spatialUI) {
      this.xrManager.spatialUI.group.position.set(0.92, 0.45, -0.15);
      this.xrManager.spatialUI.group.rotation.y = -0.32;
      this.xrManager.spatialUI.group.visible = true;
    }
  }

  handleXRAction(actionId) {
    if (actionId === 'prev') {
      this.prevStep();
    } else if (actionId === 'next') {
      this.nextStep();
    } else if (actionId === 'voice') {
      this.toggleVoiceReading();
    } else if (actionId === 'tool') {
      this.triggerStepTool();
    } else if (actionId === 'exploded') {
      const targetVal = this.explodedProgress > 10 ? 0 : 65;
      const slider = document.getElementById('slider-exploded');
      if (slider) slider.value = targetVal;
      const badge = document.getElementById('exploded-val-badge');
      if (badge) badge.textContent = `${targetVal}%`;
      this.applyExplodedOffset(targetVal);
      this.spatialTools.playBeep(780, 0.1, 'sine');
    } else if (actionId === 'thermal') {
      this.toggleThermalMode();
    } else if (actionId === 'lang') {
      const nextLang = this.currentLang === 'gu' ? 'en' : 'gu';
      this.setLanguage(nextLang);
    }
  }

  handleComponentTouch(raycaster) {
    if (!this.activeModelMesh || !this.activeModelMesh.userData) return;
    const components = this.activeModelMesh.userData.components;
    if (!components) return;

    const allMeshes = [];
    Object.entries(components).forEach(([name, group]) => {
      group.traverse(child => {
        if (child.isMesh) {
          child.userData.componentName = name;
          allMeshes.push(child);
        }
      });
    });

    const intersects = raycaster.intersectObjects(allMeshes, false);
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const compName = hitMesh.userData.componentName;
      if (compName) {
        this.inspectComponentByTouch(compName, intersects[0].point);
      }
    }
  }

  inspectComponentByTouch(compName, hitPoint) {
    this.spatialTools.playBeep(1040, 0.12, 'sine');
    this.highlightComponent(compName);
    this.showComponentTag(compName, hitPoint);

    const currentStep = this.currentFault.steps[this.currentStepIndex];
    if (currentStep && currentStep.componentHighlight === compName) {
      this.spatialTools.playBeep(1320, 0.25, 'triangle');
    }
  }

  showComponentTag(compName, worldPos) {
    if (!this.componentTagMesh) {
      const tagCanvas = document.createElement('canvas');
      tagCanvas.width = 384;
      tagCanvas.height = 128;
      this.tagCanvas = tagCanvas;
      this.tagCtx = tagCanvas.getContext('2d');
      this.tagTexture = new THREE.CanvasTexture(tagCanvas);

      const tagGeo = new THREE.PlaneGeometry(0.38, 0.13);
      const tagMat = new THREE.MeshBasicMaterial({
        map: this.tagTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      this.componentTagMesh = new THREE.Mesh(tagGeo, tagMat);
      this.componentTagMesh.name = 'COMPONENT_3D_TAG';
      this.scene.add(this.componentTagMesh);
    }

    const ctx = this.tagCtx;
    ctx.clearRect(0, 0, 384, 128);

    ctx.fillStyle = "rgba(7, 11, 20, 0.94)";
    ctx.beginPath();
    ctx.roundRect(4, 4, 376, 120, 16);
    ctx.fill();

    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#00f0ff";
    ctx.font = "bold 20px monospace";
    ctx.fillText("PART INSPECTION // 3D XR", 20, 34);

    const guCompNames = {
      bearing_de: "ડ્રાઇવ-એન્ડ બેરિંગ (Bearing DE)",
      terminal_box: "ટર્મિનલ બોક્સ (Terminal Box)",
      mech_seal: "મિકેનિકલ સીલ (Mechanical Seal)",
      volute_casing: "વોલ્યુટ કેસીંગ (Volute Casing)",
      impeller: "ઇમ્પેલર વ્હીલ (Impeller Vanes)",
      buchholz_relay: "બુખોલ્ઝ રિલે (Buchholz Relay)",
      silicagel_breather: "સિલિકા જેલ બ્લીધર (Breather)",
      hv_bushings: "૧૧kV બુશિંગ્સ (HV Bushings)",
      drain_valve: "ડ્રેઇન વાલ્વ (Drain Valve)",
      condenser: "કન્ડેન્સર ટ્યુબ્સ (Condenser)",
      expansion_valve: "એક્સપાન્સન વાલ્વ (TXV)"
    };

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(guCompNames[compName] || compName, 20, 72);

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 18px monospace";
    ctx.fillText("STATUS: ACTIVE IN-XR TOUCH", 20, 104);

    this.tagTexture.needsUpdate = true;
    this.componentTagMesh.position.copy(worldPos).add(new THREE.Vector3(0, 0.16, 0));
    this.componentTagMesh.lookAt(this.camera.position);
    this.componentTagMesh.visible = true;

    clearTimeout(this.tagTimeout);
    this.tagTimeout = setTimeout(() => {
      if (this.componentTagMesh) this.componentTagMesh.visible = false;
    }, 5000);
  }

  /* ------------------------------------------------------------------------
     Equipment Model Management & 3D Layer Effects
     ------------------------------------------------------------------------ */
  loadEquipmentModel(modelType) {
    this.activeModelType = modelType;

    // Remove existing equipment
    while (this.equipmentRoot.children.length > 0) {
      this.equipmentRoot.remove(this.equipmentRoot.children[0]);
    }

    let modelMesh;
    if (modelType === 'transformer') {
      modelMesh = this.modelFactory.createTransformerModel();
    } else if (modelType === 'chiller') {
      modelMesh = this.modelFactory.createChillerModel();
    } else {
      modelMesh = this.modelFactory.createPumpModel();
    }

    this.equipmentRoot.add(modelMesh);
    this.activeModelMesh = modelMesh;

    // Apply exploded slider value
    this.applyExplodedOffset(this.explodedProgress);

    // Update UI tabs
    document.querySelectorAll('.model-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.model === modelType);
    });
  }

  applyExplodedOffset(percent) {
    this.explodedProgress = percent;
    if (!this.activeModelMesh || !this.activeModelMesh.userData) return;

    const { components, defaultPositions, explodedOffsets } = this.activeModelMesh.userData;
    if (!components || !defaultPositions || !explodedOffsets) return;

    const factor = percent / 100;

    Object.keys(explodedOffsets).forEach(compKey => {
      const comp = components[compKey];
      const defaultPos = defaultPositions[compKey];
      const offset = explodedOffsets[compKey];

      if (comp && defaultPos && offset) {
        comp.position.lerpVectors(
          defaultPos,
          new THREE.Vector3().copy(defaultPos).addScaledVector(offset, factor * 2.0),
          1.0
        );
      }
    });
  }

  toggleThermalMode() {
    this.isThermalMode = !this.isThermalMode;
    const btn = document.getElementById('btn-toggle-thermal');
    btn.classList.toggle('active', this.isThermalMode);

    this.activeModelMesh.traverse((child) => {
      if (child.isMesh && child.material) {
        if (this.isThermalMode) {
          if (!child.userData.origMaterial) child.userData.origMaterial = child.material;
          // Apply thermal gradient material
          child.material = new THREE.MeshStandardMaterial({
            color: child.name.includes('bearing') || child.name.includes('condenser') ? 0xef4444 : 0x0284c7,
            emissive: child.name.includes('bearing') || child.name.includes('condenser') ? 0xb91c1c : 0x001122,
            emissiveIntensity: 0.6,
            roughness: 0.3
          });
        } else if (child.userData.origMaterial) {
          child.material = child.userData.origMaterial;
        }
      }
    });
  }

  toggleXrayMode() {
    this.isXrayMode = !this.isXrayMode;
    const btn = document.getElementById('btn-toggle-xray');
    btn.classList.toggle('active', this.isXrayMode);

    this.activeModelMesh.traverse((child) => {
      if (child.isMesh && child.material) {
        if (this.isXrayMode) {
          if (!child.userData.origMaterial) child.userData.origMaterial = child.material;
          child.material = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.35
          });
        } else if (child.userData.origMaterial) {
          child.material = child.userData.origMaterial;
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     Troubleshooting Step Navigation & AR Highlighting
     ------------------------------------------------------------------------ */
  updateTroubleshootingView() {
    const fault = this.currentFault;
    const step = fault.steps[this.currentStepIndex];
    const totalSteps = fault.steps.length;
    const lang = this.currentLang;
    const t = TRANSLATIONS[lang];

    // Update Counter & Badge
    document.getElementById('step-counter-badge').textContent = 
      `${t.stepLabel} ${this.currentStepIndex + 1} ${t.ofLabel} ${totalSteps}`;
    document.getElementById('fault-urgency-badge').textContent = fault.urgency;

    // Update Category & Headline
    document.getElementById('equipment-category-text').textContent = 
      `${this.currentManual.code} // ${this.currentManual.title[lang]}`;
    document.getElementById('fault-headline-text').textContent = fault.symptom[lang];

    // Safety Alert Box (LOTO)
    const safetyBox = document.getElementById('safety-alert-box');
    if (step.safetyWarning) {
      safetyBox.classList.remove('hidden');
      document.getElementById('safety-warning-text').textContent = step.safetyWarning[lang];
    } else {
      safetyBox.classList.add('hidden');
    }

    // Step Title & Instruction
    document.getElementById('step-title-text').textContent = step.title[lang];
    document.getElementById('step-instruction-text').textContent = step.instruction[lang];

    // Tool simulation info
    const toolIconMap = {
      thermal_scanner: '🌡️',
      multimeter: '⚡',
      torque_wrench: '🔧',
      visual_loupe: '🔍',
      pressure_gauge: '⏱️'
    };
    document.getElementById('tool-active-icon').textContent = toolIconMap[step.toolAction] || '🔧';
    document.getElementById('tool-name-label').textContent = t[`tool${step.toolAction.charAt(0).toUpperCase() + step.toolAction.slice(1)}`] || step.toolAction;
    document.getElementById('tool-target-spec').textContent = `Target Spec: ${step.targetMeasurement}`;

    // Nav buttons
    const prevBtn = document.getElementById('btn-prev-step');
    const nextBtn = document.getElementById('btn-next-step');

    prevBtn.disabled = (this.currentStepIndex === 0);
    if (this.currentStepIndex === totalSteps - 1) {
      document.getElementById('next-step-label').textContent = t.completeInspection;
    } else {
      document.getElementById('next-step-label').textContent = t.nextStep;
    }

    // Highlight 3D component and place spatial pin
    this.highlightComponent(step.componentHighlight, fault.arPinPosition);

    // Deploy 3D AR tool near the component
    const targetPos = new THREE.Vector3(...(fault.arPinPosition || [0, 0.4, 0]));
    this.spatialTools.deployTool(step.toolAction, targetPos);

    // Update Meta Quest 3 Spatial 3D Interactive Console
    if (this.xrManager) {
      this.xrManager.updateSpatialUIContent({
        stepLabel: t.stepLabel,
        stepNumber: this.currentStepIndex + 1,
        ofLabel: t.ofLabel,
        totalSteps,
        title: step.title[lang],
        safetyLabel: t.safetyWarningLabel,
        safetyWarning: step.safetyWarning ? step.safetyWarning[lang] : '',
        instruction: step.instruction[lang],
        targetMeasurement: step.targetMeasurement
      });
    }
  }

  triggerStepTool() {
    const step = this.currentFault.steps[this.currentStepIndex];
    if (step.toolAction === 'torque_wrench') {
      this.spatialTools.animateWrenchAction();
    } else if (step.toolAction === 'multimeter') {
      this.spatialTools.animateMultimeterAction();
    } else {
      this.spatialTools.animateThermalAction();
    }
  }

  highlightComponent(componentName, pinPos) {
    if (!this.activeModelMesh || !this.activeModelMesh.userData) return;
    const components = this.activeModelMesh.userData.components;

    // Reset previous component emissive colors
    Object.values(components).forEach(comp => {
      comp.traverse(child => {
        if (child.isMesh && child.material && child.material.emissive) {
          child.material.emissive.setHex(0x000000);
        }
      });
    });

    // Highlight target component
    const targetComp = components[componentName];
    if (targetComp) {
      targetComp.traverse(child => {
        if (child.isMesh && child.material && child.material.emissive) {
          child.material.emissive.setHex(0x00f0ff);
          child.material.emissiveIntensity = 0.8;
        }
      });
    }

    // Update spatial pin position
    if (this.markerPin && pinPos) {
      this.markerPin.position.set(pinPos[0], pinPos[1] + 0.15, pinPos[2]);
      this.componentSpotlight.position.set(pinPos[0], pinPos[1] + 0.6, pinPos[2]);
    }
  }

  nextStep() {
    if (this.currentStepIndex < this.currentFault.steps.length - 1) {
      this.currentStepIndex++;
      this.spatialTools.playBeep(880, 0.1, 'sine');
      this.updateTroubleshootingView();
    } else {
      // Completed checklist
      this.spatialTools.playBeep(1200, 0.3, 'sine');
      alert(TRANSLATIONS[this.currentLang].checklistFinished);
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.spatialTools.playBeep(660, 0.1, 'sine');
      this.updateTroubleshootingView();
    }
  }

  /* ------------------------------------------------------------------------
     Voice Dictation & Text-to-Speech (TTS)
     ------------------------------------------------------------------------ */
  toggleVoiceReading() {
    if (this.isSpeaking) {
      this.faultAnalyzer.stopSpeaking();
      this.setSpeakingState(false);
      return;
    }

    const step = this.currentFault.steps[this.currentStepIndex];
    const lang = this.currentLang === 'gu' ? 'gu-IN' : 'en-US';
    const textToSpeak = `${step.title[this.currentLang]}. ${step.instruction[this.currentLang]}`;

    this.faultAnalyzer.speakText(
      textToSpeak,
      lang,
      () => this.setSpeakingState(true),
      () => this.setSpeakingState(false)
    );
  }

  setSpeakingState(speaking) {
    this.isSpeaking = speaking;
    const btn = document.getElementById('btn-read-aloud');
    const waves = document.getElementById('audio-waveforms');
    const label = document.getElementById('tts-btn-label');
    const t = TRANSLATIONS[this.currentLang];

    if (speaking) {
      btn.classList.add('speaking');
      waves.classList.remove('hidden');
      label.textContent = t.stopReading;
    } else {
      btn.classList.remove('speaking');
      waves.classList.add('hidden');
      label.textContent = t.readAloud;
    }
  }

  triggerVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceBtn = document.getElementById('btn-voice-input');

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this offline browser. Using keyword search.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = this.currentLang === 'gu' ? 'gu-IN' : 'en-US';
    recognition.interimResults = false;

    voiceBtn.classList.add('recording');

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('fault-query-input').value = transcript;
      this.performFaultSearch(transcript);
    };

    recognition.onerror = () => {
      voiceBtn.classList.remove('recording');
    };

    recognition.onend = () => {
      voiceBtn.classList.remove('recording');
    };

    recognition.start();
  }

  /* ------------------------------------------------------------------------
     Fault Search & Photo Classifier
     ------------------------------------------------------------------------ */
  performFaultSearch(query) {
    const results = this.faultAnalyzer.searchByDescription(query);
    if (results.length > 0) {
      const best = results[0];
      this.currentManual = best.manual;
      this.currentFault = best.fault;
      this.currentStepIndex = 0;

      // Switch 3D model if needed
      if (this.currentManual.defaultModel !== this.activeModelType) {
        this.loadEquipmentModel(this.currentManual.defaultModel);
      }

      this.updateTroubleshootingView();
      this.spatialTools.playBeep(920, 0.15, 'sine');
    } else {
      alert(this.currentLang === 'gu' ? "ખામી મળી નથી. કૃપા કરીને અન્ય લક્ષણ લખો." : "No matching fault found. Try alternative keywords.");
    }
  }

  async runPhotographClassification(imageSource) {
    const scanline = document.getElementById('vision-scanline');
    const bbox = document.getElementById('vision-bounding-box');
    const placeholder = document.getElementById('vision-placeholder');
    const resultCard = document.getElementById('vision-match-result');

    placeholder.classList.add('hidden');
    scanline.classList.remove('hidden');
    bbox.classList.add('hidden');
    resultCard.classList.add('hidden');

    this.spatialTools.playBeep(700, 0.1, 'sawtooth');

    const result = await this.faultAnalyzer.analyzePhotograph(imageSource);

    // Draw on preview canvas
    const displayCanvas = document.getElementById('photo-canvas-display');
    const dctx = displayCanvas.getContext('2d');
    dctx.clearRect(0, 0, 360, 300);
    dctx.drawImage(result.annotatedCanvas, 0, 0, 360, 300);

    scanline.classList.add('hidden');

    // Display bounding box
    bbox.style.left = `${result.box.x}px`;
    bbox.style.top = `${result.box.y}px`;
    bbox.style.width = `${result.box.w}px`;
    bbox.style.height = `${result.box.h}px`;
    document.getElementById('bbox-tag').textContent = `${result.signatureType.toUpperCase()} // ${result.confidence}%`;
    bbox.classList.remove('hidden');

    // Display result card
    document.getElementById('match-signature-type').textContent = result.signatureType;
    document.getElementById('match-confidence-val').textContent = `${result.confidence}% MATCH`;
    document.getElementById('match-manual-title').textContent = `${result.manual.code} // ${result.manual.title[this.currentLang]}`;
    document.getElementById('match-symptom-gu').textContent = result.fault.symptom[this.currentLang];
    resultCard.classList.remove('hidden');

    // Store pending match
    this.pendingVisionMatch = result;
  }

  applyVisionMatch() {
    if (!this.pendingVisionMatch) return;
    const { manual, fault } = this.pendingVisionMatch;
    this.currentManual = manual;
    this.currentFault = fault;
    this.currentStepIndex = 0;

    if (manual.defaultModel !== this.activeModelType) {
      this.loadEquipmentModel(manual.defaultModel);
    }

    this.updateTroubleshootingView();
    document.getElementById('modal-photo-analyzer').classList.add('hidden');
    this.spatialTools.playBeep(1100, 0.2, 'sine');
  }

  /* ------------------------------------------------------------------------
     UI Bindings & Modals
     ------------------------------------------------------------------------ */
  initUI() {
    // Language Switcher
    document.getElementById('btn-lang-gu').addEventListener('click', () => this.setLanguage('gu'));
    document.getElementById('btn-lang-en').addEventListener('click', () => this.setLanguage('en'));

    // Step Nav
    document.getElementById('btn-next-step').addEventListener('click', () => this.nextStep());
    document.getElementById('btn-prev-step').addEventListener('click', () => this.prevStep());
    document.getElementById('btn-read-aloud').addEventListener('click', () => this.toggleVoiceReading());

    // Drawer collapse
    document.getElementById('btn-toggle-drawer').addEventListener('click', () => {
      document.getElementById('guide-card').classList.toggle('collapsed');
    });

    // Tool test simulation
    document.getElementById('btn-trigger-tool').addEventListener('click', () => {
      this.triggerStepTool();
    });

    // Search input
    document.getElementById('btn-submit-search').addEventListener('click', () => {
      const q = document.getElementById('fault-query-input').value;
      this.performFaultSearch(q);
    });

    document.getElementById('fault-query-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.performFaultSearch(e.target.value);
      }
    });

    document.getElementById('btn-voice-input').addEventListener('click', () => this.triggerVoiceInput());

    // Quick symptom chips
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        document.getElementById('fault-query-input').value = query;
        this.performFaultSearch(query);
      });
    });

    // Model Switcher Tabs
    document.querySelectorAll('.model-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.loadEquipmentModel(tab.dataset.model);
      });
    });

    // 3D Layers
    document.getElementById('slider-exploded').addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      document.getElementById('exploded-val-badge').textContent = `${val}%`;
      this.applyExplodedOffset(val);
    });

    document.getElementById('btn-toggle-thermal').addEventListener('click', () => this.toggleThermalMode());
    document.getElementById('btn-toggle-xray').addEventListener('click', () => this.toggleXrayMode());
    document.getElementById('btn-reset-view').addEventListener('click', () => {
      this.cameraRotation = { x: 0.35, y: -0.45 };
      this.cameraDistance = 2.2;
      this.updateCameraTransform();
    });

    // WebXR Launch (Meta Quest 3)
    document.getElementById('btn-launch-webxr').addEventListener('click', async () => {
      try {
        await this.xrManager.startWebXRSession(this.equipmentRoot);
        this.gridHelper.visible = false;
        document.getElementById('btn-exit-ar').classList.remove('hidden');
      } catch (err) {
        alert(err.message || "Failed to start WebXR session. Switching to Phone Camera AR.");
        this.startCameraAR();
      }
    });

    // Phone Camera AR Launch
    document.getElementById('btn-launch-camera-ar').addEventListener('click', () => {
      this.startCameraAR();
    });

    document.getElementById('btn-exit-ar').addEventListener('click', () => {
      this.xrManager.stopCameraFallback();
      this.gridHelper.visible = true;
      document.getElementById('btn-exit-ar').classList.add('hidden');
    });

    // Photograph Modal
    const photoModal = document.getElementById('modal-photo-analyzer');
    document.getElementById('btn-photo-fault').addEventListener('click', () => {
      photoModal.classList.remove('hidden');
    });
    document.getElementById('btn-close-photo-modal').addEventListener('click', () => {
      photoModal.classList.add('hidden');
    });

    // Sample fault buttons inside photo modal
    document.querySelectorAll('.sample-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const dataUrl = generateTestFaultImage(type);
        this.runPhotographClassification(dataUrl);
      });
    });

    // File upload inside photo modal
    document.getElementById('photo-file-input').addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.runPhotographClassification(e.target.files[0]);
      }
    });

    // Apply Vision match button
    document.getElementById('btn-apply-vision-guide').addEventListener('click', () => {
      this.applyVisionMatch();
    });

    // Snap live from AR camera
    document.getElementById('btn-snap-ar-camera').addEventListener('click', () => {
      const snapData = this.captureLiveCameraSnapshot();
      if (snapData) {
        this.runPhotographClassification(snapData);
      } else {
        // Fallback to sample hotspot
        const sampleUrl = generateTestFaultImage('bearing_hotspot');
        this.runPhotographClassification(sampleUrl);
      }
    });

    // Manuals Library Modal
    const manualsModal = document.getElementById('modal-manuals-lib');
    document.getElementById('btn-open-manuals-lib').addEventListener('click', () => {
      this.populateManualsLibrary();
      manualsModal.classList.remove('hidden');
    });
    document.getElementById('btn-close-manuals-lib').addEventListener('click', () => {
      manualsModal.classList.add('hidden');
    });

    // Custom Document Ingestion Modal
    const customDocModal = document.getElementById('modal-custom-doc');
    document.getElementById('btn-custom-doc').addEventListener('click', () => {
      customDocModal.classList.remove('hidden');
    });
    document.getElementById('btn-close-custom-doc').addEventListener('click', () => {
      customDocModal.classList.add('hidden');
    });

    const dropZone = document.getElementById('file-drop-zone');
    const fileInput = document.getElementById('custom-doc-file-input');
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const res = await this.faultAnalyzer.ingestCustomDocument(file);
        const statusBox = document.getElementById('custom-doc-status');
        statusBox.textContent = `✓ Indexed "${file.name}" into local storage!`;
        statusBox.classList.remove('hidden');
        this.currentManual = res;
        this.currentFault = res.faults[0];
        this.currentStepIndex = 0;
        this.updateTroubleshootingView();
      }
    });
  }

  startCameraAR() {
    const video = document.getElementById('camera-feed');
    this.xrManager.startCameraFallback(video, this.equipmentRoot).then(() => {
      this.gridHelper.visible = false;
      document.getElementById('btn-exit-ar').classList.remove('hidden');
    }).catch(err => {
      alert("Camera error: " + err.message);
    });
  }

  captureLiveCameraSnapshot() {
    const video = document.getElementById('camera-feed');
    if (!video || !video.srcObject) return null;

    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = video.videoWidth || 640;
    snapCanvas.height = video.videoHeight || 480;
    const sctx = snapCanvas.getContext('2d');
    sctx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);
    return snapCanvas.toDataURL('image/jpeg', 0.85);
  }

  setLanguage(lang) {
    this.currentLang = lang;
    document.getElementById('btn-lang-gu').classList.toggle('active', lang === 'gu');
    document.getElementById('btn-lang-en').classList.toggle('active', lang === 'en');

    const t = TRANSLATIONS[lang];
    document.getElementById('app-tagline').textContent = t.tagline;
    document.getElementById('badge-offline-text').textContent = t.badgeOffline;
    document.getElementById('fault-query-input').placeholder = t.searchPlaceholder;
    document.getElementById('search-btn-label').textContent = t.searchBtn;
    document.getElementById('photo-btn-label').textContent = t.photoBtn;
    document.getElementById('voice-btn-label').textContent = t.voiceBtn;
    document.getElementById('quick-presets-title').textContent = t.quickPresetsTitle;

    document.getElementById('lbl-quest-btn').textContent = t.arModeWebXR;
    document.getElementById('lbl-phone-btn').textContent = t.arModeCamera;
    document.getElementById('lbl-exit-ar').textContent = t.arExit;
    document.getElementById('lbl-exploded-slider').textContent = t.explodedSlider;
    document.getElementById('lbl-thermal-toggle').textContent = t.heatMapToggle;
    document.getElementById('lbl-xray-toggle').textContent = t.xrayToggle;
    document.getElementById('lbl-reset-view').textContent = t.tabExploded;

    document.getElementById('prev-step-label').textContent = t.prevStep;
    document.getElementById('next-step-label').textContent = t.nextStep;
    document.getElementById('tts-btn-label').textContent = t.readAloud;
    document.getElementById('tool-btn-label').textContent = t.simulateToolAction;

    document.getElementById('lbl-photo-modal-title').textContent = t.photoModalTitle;
    document.getElementById('lbl-photo-modal-desc').textContent = t.photoModalDesc;
    document.getElementById('lbl-apply-guide').textContent = t.applyFaultGuide;

    document.getElementById('lbl-custom-doc-title').textContent = t.customDocTitle;
    document.getElementById('lbl-custom-doc-desc').textContent = t.customDocDesc;
    document.getElementById('lbl-drop-prompt').textContent = t.fileDropPrompt;

    this.updateTroubleshootingView();
  }

  populateManualsLibrary() {
    const container = document.getElementById('manuals-list-container');
    container.innerHTML = '';
    const lang = this.currentLang;

    this.faultAnalyzer.manuals.forEach(manual => {
      const card = document.createElement('div');
      card.className = 'manual-item-card';

      const faultChipsHtml = manual.faults.map(f => `
        <button class="fault-chip-pill" data-manual="${manual.id}" data-fault="${f.id}">
          ${f.symptom[lang]}
        </button>
      `).join('');

      card.innerHTML = `
        <div class="manual-item-header">
          <span class="manual-code-badge">${manual.code}</span>
          <span style="font-size: 0.76rem; color: #94a3b8;">${manual.category[lang]}</span>
        </div>
        <h4 style="font-size: 0.95rem; color: #fff;">${manual.title[lang]}</h4>
        <p style="font-size: 0.8rem; color: #cbd5e1;">${manual.specs[lang]}</p>
        <div class="manual-fault-chips">
          ${faultChipsHtml}
        </div>
      `;

      card.querySelectorAll('.fault-chip-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          this.currentManual = manual;
          this.currentFault = manual.faults.find(f => f.id === btn.dataset.fault);
          this.currentStepIndex = 0;
          if (manual.defaultModel !== this.activeModelType) {
            this.loadEquipmentModel(manual.defaultModel);
          }
          this.updateTroubleshootingView();
          document.getElementById('modal-manuals-lib').classList.add('hidden');
        });
      });

      container.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------------
     Main Render Loop
     ------------------------------------------------------------------------ */
  renderLoop(timestamp, frame) {
    // Pulse spatial pin ring
    if (this.markerPin) {
      const ring = this.markerPin.getObjectByName('pinRing');
      if (ring) {
        ring.lookAt(this.camera.position);
        ring.scale.setScalar(1.0 + Math.sin(timestamp * 0.005) * 0.15);
      }
    }

    // WebXR per-frame updates
    if (frame) {
      this.xrManager.update(frame);
    }

    this.renderer.render(this.scene, this.camera);
  }

  /* ------------------------------------------------------------------------
     Progressive Web App (Offline Service Worker)
     ------------------------------------------------------------------------ */
  registerPWA() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log("ServiceWorker registration skipped in dev mode:", err);
      });
    }

    // Network status listener
    window.addEventListener('offline', () => {
      document.getElementById('badge-offline-text').textContent = "100% OFFLINE ACTIVE";
    });
    window.addEventListener('online', () => {
      document.getElementById('badge-offline-text').textContent = "OFFLINE-FIRST ENGINE";
    });
  }
}

// Bootstrap app on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.arMargApp = new ARMargApp();
});
