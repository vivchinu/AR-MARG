// 3D Spatial Interactive UI Console for WebXR (Meta Quest 3 & Mobile AR)
// Features physical 3D touchable buttons, hand-poke collision, and dynamic canvas displays

import * as THREE from 'three';

export class SpatialUIPanel {
  constructor(scene, onAction) {
    this.scene = scene;
    this.onAction = onAction; // Callback for button clicks

    this.group = new THREE.Group();
    this.group.name = 'SPATIAL_UI_CONSOLE';
    this.group.visible = false;
    this.scene.add(this.group);

    this.buttons = [];
    this.hoveredButton = null;
    this.pressedButton = null;

    // Canvas for dynamic step text & safety warnings
    this.canvasWidth = 1024;
    this.canvasHeight = 640;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.ctx = this.canvas.getContext('2d');

    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.minFilter = THREE.LinearFilter;

    this.buildConsole();
  }

  buildConsole() {
    // 1. Futuristic Curved/Chamfered Backplate
    const plateWidth = 0.95;
    const plateHeight = 0.72;
    const plateDepth = 0.025;

    const backplateGeo = new THREE.BoxGeometry(plateWidth, plateHeight, plateDepth);
    const backplateMat = new THREE.MeshStandardMaterial({
      color: 0x09111e,
      roughness: 0.35,
      metalness: 0.85,
    });
    this.backplate = new THREE.Mesh(backplateGeo, backplateMat);
    this.backplate.position.z = -plateDepth / 2;
    this.group.add(this.backplate);

    // Glowing Cyan Trim Border
    const borderGeo = new THREE.BoxGeometry(plateWidth + 0.012, plateHeight + 0.012, 0.01);
    const borderMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.45,
      wireframe: true
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.z = -0.01;
    this.group.add(border);

    // 2. High-Resolution Display Screen Mesh
    const screenGeo = new THREE.PlaneGeometry(plateWidth - 0.06, 0.44);
    const screenMat = new THREE.MeshBasicMaterial({
      map: this.canvasTexture,
      transparent: true,
      opacity: 0.98,
    });
    this.screenMesh = new THREE.Mesh(screenGeo, screenMat);
    this.screenMesh.position.set(0, 0.1, 0.014);
    this.group.add(this.screenMesh);

    // 3. Tactile 3D Buttons mounted on the bottom section
    // Row 1: Primary Workflow Nav
    this.createTactileButton('prev', '◀ પાછળ (Prev)', -0.32, -0.18, 0.22, 0.065, 0x1e293b, 0x94a3b8);
    this.createTactileButton('next', 'આગળ (Next) ▶', -0.08, -0.18, 0.22, 0.065, 0x0284c7, 0x38bdf8);
    this.createTactileButton('voice', '🔊 સાંભળો (Voice)', 0.18, -0.18, 0.26, 0.065, 0x059669, 0x34d399);

    // Row 2: AR Tools & Visual Inspection Layers
    this.createTactileButton('tool', '⚡ ટૂલ ટેસ્ટ (Tool)', -0.32, -0.26, 0.22, 0.055, 0x10b981, 0x6ee7b7);
    this.createTactileButton('exploded', '💥 છૂટા પાર્ટ્સ (Explode)', -0.08, -0.26, 0.22, 0.055, 0xd97706, 0xfbbf24);
    this.createTactileButton('thermal', '🌡️ હીટમેપ (Thermal)', 0.18, -0.26, 0.26, 0.055, 0xdc2626, 0xf87171);

    // Row 3: Quick Utilities & Summon
    this.createTactileButton('lang', '🌐 ગુજરાતી / EN', -0.20, -0.33, 0.24, 0.048, 0x475569, 0xcbd5e1);
    this.createTactileButton('summon', '📌 મારી સામે લાવો (Summon)', 0.10, -0.33, 0.34, 0.048, 0x0ea5e9, 0x7dd3fc);

    // 4. Grabbable Handle Bar at the bottom
    const handleGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.5, 16);
    handleGeo.rotateZ(Math.PI / 2);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.2
    });
    this.handleMesh = new THREE.Mesh(handleGeo, handleMat);
    this.handleMesh.name = 'panel_grab_handle';
    this.handleMesh.position.set(0, -plateHeight / 2 - 0.02, 0.01);
    this.group.add(this.handleMesh);
  }

  /**
   * Helper to create interactive 3D tactile button with depth and label texture
   */
  createTactileButton(actionId, label, x, y, width, height, bgColor, textColorHex) {
    const depth = 0.022;
    const btnGroup = new THREE.Group();
    btnGroup.position.set(x + width / 2, y, 0.015);

    // 3D Box geometry
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshStandardMaterial({
      color: bgColor,
      roughness: 0.3,
      metalness: 0.6,
      emissive: bgColor,
      emissiveIntensity: 0.15
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = `BTN_${actionId}`;
    btnGroup.add(mesh);

    // Button Face Label Canvas
    const btnCanvas = document.createElement('canvas');
    btnCanvas.width = 256;
    btnCanvas.height = 72;
    const bctx = btnCanvas.getContext('2d');

    bctx.fillStyle = `#${textColorHex.toString(16).padStart(6, '0')}`;
    bctx.font = 'bold 24px sans-serif';
    bctx.textAlign = 'center';
    bctx.textBaseline = 'middle';
    bctx.fillText(label, 128, 36);

    const btnTex = new THREE.CanvasTexture(btnCanvas);
    const labelGeo = new THREE.PlaneGeometry(width - 0.01, height - 0.01);
    const labelMat = new THREE.MeshBasicMaterial({
      map: btnTex,
      transparent: true
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.z = depth / 2 + 0.001;
    btnGroup.add(labelMesh);

    // Glowing wireframe outline
    const outlineGeo = new THREE.BoxGeometry(width + 0.004, height + 0.004, depth + 0.002);
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const outline = new THREE.Mesh(outlineGeo, outlineMat);
    btnGroup.add(outline);

    this.group.add(btnGroup);

    const buttonObj = {
      actionId,
      label,
      group: btnGroup,
      mesh,
      outline,
      restingZ: 0.015,
      pressedZ: 0.002, // physically depressed inward
      width,
      height,
      depth,
      bgColor,
      isPressed: false,
      lastPressTime: 0
    };

    this.buttons.push(buttonObj);
    return buttonObj;
  }

  /**
   * Update the dynamic screen text (Step, LOTO Caution, Gujarati/English)
   */
  updateContent(data) {
    const ctx = this.ctx;
    const w = this.canvasWidth;
    const h = this.canvasHeight;

    ctx.clearRect(0, 0, w, h);

    // Tech Screen Background
    ctx.fillStyle = "rgba(10, 18, 32, 0.95)";
    this.roundRect(ctx, 4, 4, w - 8, h - 8, 20, true, false);

    // Header Glow Banner
    ctx.fillStyle = "rgba(0, 240, 255, 0.12)";
    this.roundRect(ctx, 16, 16, w - 32, 60, 12, true, false);
    ctx.strokeStyle = "rgba(0, 240, 255, 0.5)";
    ctx.lineWidth = 2;
    this.roundRect(ctx, 16, 16, w - 32, 60, 12, false, true);

    ctx.fillStyle = "#00f0ff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("AR-MARG XR // ઓન-ડિવાઇસ સહાયક", 32, 54);

    // Step Counter & Urgency
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 22px monospace";
    ctx.fillText(`${data.stepLabel} ${data.stepNumber} ${data.ofLabel} ${data.totalSteps} // CRITICAL`, 32, 114);

    // Step Headline
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(data.title, 32, 155);

    // LOTO Safety Protocol Box
    let textStartY = 200;
    if (data.safetyWarning) {
      ctx.fillStyle = "rgba(239, 68, 68, 0.22)";
      this.roundRect(ctx, 32, 175, w - 64, 80, 10, true, false);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      this.roundRect(ctx, 32, 175, w - 64, 80, 10, false, true);

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 20px monospace";
      ctx.fillText("⚠️ " + (data.safetyLabel || "MANDATORY SAFETY PROTOCOL (LOTO)") + ":", 48, 204);

      ctx.fillStyle = "#fecaca";
      ctx.font = "19px sans-serif";
      this.wrapText(ctx, data.safetyWarning, 48, 232, w - 96, 24);
      textStartY = 275;
    }

    // Step Instruction Text
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "24px sans-serif";
    this.wrapText(ctx, data.instruction, 32, textStartY + 25, w - 64, 34);

    // Target Spec
    if (data.targetMeasurement) {
      ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
      this.roundRect(ctx, 32, h - 90, w - 64, 60, 10, true, false);
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 24px monospace";
      ctx.fillText(`🔧 Target Spec: ${data.targetMeasurement}`, 48, h - 52);
    }

    this.canvasTexture.needsUpdate = true;
  }

  /**
   * Position panel comfortably in front of user's headset (0.95m at chest/eye level)
   */
  positionInFrontOfUser(camera, distance = 0.95) {
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0; // Keep level with horizon
    forward.normalize();

    const targetPos = camera.position.clone()
      .addScaledVector(forward, distance);
    targetPos.y = Math.max(0.8, camera.position.y - 0.15); // Chest height

    this.group.position.copy(targetPos);
    this.group.lookAt(camera.position.x, targetPos.y, camera.position.z);
    this.group.visible = true;
  }

  /**
   * Check finger poke collision from user's index finger tip
   */
  checkFingerPoke(fingerTipWorldPos) {
    const now = Date.now();
    let triggeredAction = null;

    for (const btn of this.buttons) {
      // Convert finger position to button local space
      const localPos = btn.group.worldToLocal(fingerTipWorldPos.clone());

      const halfW = btn.width / 2;
      const halfH = btn.height / 2;
      const halfD = btn.depth / 2;

      // Check if finger tip is within button bounding box + margin
      const inX = localPos.x >= -halfW && localPos.x <= halfW;
      const inY = localPos.y >= -halfH && localPos.y <= halfH;
      const inZ = localPos.y >= -halfD - 0.02 && localPos.z <= halfD + 0.02;

      if (inX && inY && inZ) {
        // Finger is poking button!
        btn.group.position.z = btn.pressedZ;
        btn.mesh.material.emissiveIntensity = 0.8;
        btn.outline.material.opacity = 0.9;

        if (!btn.isPressed && now - btn.lastPressTime > 400) {
          btn.isPressed = true;
          btn.lastPressTime = now;
          triggeredAction = btn.actionId;
          if (this.onAction) this.onAction(btn.actionId);
        }
      } else {
        // Smoothly return button to resting position
        btn.group.position.z = THREE.MathUtils.lerp(btn.group.position.z, btn.restingZ, 0.2);
        btn.mesh.material.emissiveIntensity = THREE.MathUtils.lerp(btn.mesh.material.emissiveIntensity, 0.15, 0.2);
        btn.outline.material.opacity = THREE.MathUtils.lerp(btn.outline.material.opacity, 0.25, 0.2);
        if (now - btn.lastPressTime > 300) {
          btn.isPressed = false;
        }
      }
    }

    return triggeredAction;
  }

  /**
   * Check pointer raycast intersection (hand ray pinch or controller laser)
   */
  checkRaycast(raycaster, isSelectTriggered = false) {
    const btnMeshes = this.buttons.map(b => b.mesh);
    const intersects = raycaster.intersectObjects(btnMeshes, true);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const btn = this.buttons.find(b => b.mesh === hitMesh);
      if (btn) {
        btn.outline.material.opacity = 0.9;
        btn.mesh.material.emissiveIntensity = 0.6;

        if (isSelectTriggered) {
          btn.group.position.z = btn.pressedZ;
          setTimeout(() => { btn.group.position.z = btn.restingZ; }, 180);
          if (this.onAction) this.onAction(btn.actionId);
          return btn.actionId;
        }
      }
    } else {
      // Reset hover
      this.buttons.forEach(btn => {
        if (!btn.isPressed) {
          btn.outline.material.opacity = 0.25;
          btn.mesh.material.emissiveIntensity = 0.15;
        }
      });
    }

    return null;
  }

  roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return;
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
}
