// Procedural 3D Industrial Equipment Models for WebXR & AR Inspection
// Engineered with Three.js for high performance on both Meta Quest 3 and mobile phones

import * as THREE from 'three';

export class EquipmentModelFactory {
  constructor() {
    this.materials = this.createBaseMaterials();
  }

  createBaseMaterials() {
    return {
      castIron: new THREE.MeshStandardMaterial({
        color: 0x1b4965,
        roughness: 0.5,
        metalness: 0.6,
      }),
      machinedSteel: new THREE.MeshStandardMaterial({
        color: 0xcfd8dc,
        roughness: 0.25,
        metalness: 0.85,
      }),
      brassImpeller: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.35,
        metalness: 0.75,
      }),
      copperBushing: new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.3,
        metalness: 0.8,
      }),
      porcelainBrown: new THREE.MeshStandardMaterial({
        color: 0x5d4037,
        roughness: 0.2,
        metalness: 0.1,
      }),
      glassClear: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
        ior: 1.5,
      }),
      silicaPink: new THREE.MeshStandardMaterial({
        color: 0xff69b4,
        roughness: 0.4,
        emissive: 0x551a3a,
      }),
      silicaBlue: new THREE.MeshStandardMaterial({
        color: 0x00b4d8,
        roughness: 0.4,
        emissive: 0x002244,
      }),
      safetyYellow: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.4,
        metalness: 0.3,
      }),
      baseSkid: new THREE.MeshStandardMaterial({
        color: 0x263238,
        roughness: 0.7,
        metalness: 0.4,
      }),
      gasketRubber: new THREE.MeshStandardMaterial({
        color: 0x212121,
        roughness: 0.9,
        metalness: 0.05,
      }),
      highlightPulse: new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.5,
      }),
      thermalHot: new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xb91c1c,
        emissiveIntensity: 0.8,
        roughness: 0.3,
      }),
    };
  }

  /**
   * Build Industrial Motor & Centrifugal Slurry Pump (IND-PUMP-400X)
   */
  createPumpModel() {
    const root = new THREE.Group();
    root.name = 'PUMP_ROOT';

    const components = {};

    // 1. Base Skid / Channel Steel Bedplate
    const skidGeo = new THREE.BoxGeometry(1.6, 0.08, 0.7);
    const skid = new THREE.Mesh(skidGeo, this.materials.baseSkid);
    skid.position.y = 0.04;
    skid.receiveShadow = true;
    root.add(skid);

    // 2. Motor Assembly Group (Offset in exploded view)
    const motorGroup = new THREE.Group();
    motorGroup.name = 'motor_assembly';
    motorGroup.position.set(0.35, 0.32, 0);

    // Motor Stator Cylinder
    const statorGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.52, 32);
    statorGeo.rotateZ(Math.PI / 2);
    const statorMesh = new THREE.Mesh(statorGeo, this.materials.castIron.clone());
    motorGroup.add(statorMesh);

    // Motor Cooling Fins (12 radial fins)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const finGeo = new THREE.BoxGeometry(0.5, 0.04, 0.012);
      const fin = new THREE.Mesh(finGeo, this.materials.castIron.clone());
      fin.position.set(0, Math.cos(angle) * 0.25, Math.sin(angle) * 0.25);
      fin.rotation.x = angle;
      motorGroup.add(fin);
    }

    // Drive-End Bearing Housing (Front - near coupling)
    const bearingDeGroup = new THREE.Group();
    bearingDeGroup.name = 'bearing_de';
    const bearingDeGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 24);
    bearingDeGeo.rotateZ(Math.PI / 2);
    const bearingDeMesh = new THREE.Mesh(bearingDeGeo, this.materials.machinedSteel.clone());
    bearingDeGroup.add(bearingDeMesh);

    // Grease Nipple on Bearing DE
    const nippleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.05, 12);
    const nipple = new THREE.Mesh(nippleGeo, this.materials.brassImpeller);
    nipple.position.set(0, 0.18, 0);
    bearingDeGroup.add(nipple);

    bearingDeGroup.position.set(-0.31, 0, 0);
    motorGroup.add(bearingDeGroup);
    components.bearing_de = bearingDeGroup;

    // Non-Drive End Bearing & Fan Shroud (Rear)
    const fanShroudGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.12, 24);
    fanShroudGeo.rotateZ(Math.PI / 2);
    const fanShroud = new THREE.Mesh(fanShroudGeo, this.materials.safetyYellow);
    fanShroud.position.set(0.32, 0, 0);
    motorGroup.add(fanShroud);

    // Terminal Junction Box on top
    const terminalBoxGroup = new THREE.Group();
    terminalBoxGroup.name = 'terminal_box';
    const boxGeo = new THREE.BoxGeometry(0.18, 0.12, 0.16);
    const boxMesh = new THREE.Mesh(boxGeo, this.materials.castIron.clone());
    boxMesh.position.y = 0.06;
    terminalBoxGroup.add(boxMesh);

    // Cable Glands
    const glandGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.05, 12);
    const gland1 = new THREE.Mesh(glandGeo, this.materials.brassImpeller);
    gland1.position.set(0.09, 0.06, 0.04);
    gland1.rotation.z = Math.PI / 2;
    terminalBoxGroup.add(gland1);

    terminalBoxGroup.position.set(0, 0.25, 0);
    motorGroup.add(terminalBoxGroup);
    components.terminal_box = terminalBoxGroup;

    root.add(motorGroup);
    components.motor = motorGroup;

    // 3. Central Shaft & Flexible Coupling
    const shaftGroup = new THREE.Group();
    shaftGroup.name = 'shaft_coupling';
    const shaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.95, 24);
    shaftGeo.rotateZ(Math.PI / 2);
    const shaftMesh = new THREE.Mesh(shaftGeo, this.materials.machinedSteel.clone());
    shaftGroup.add(shaftMesh);

    // Flexible Coupling Flanges
    const coup1Geo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 24);
    coup1Geo.rotateZ(Math.PI / 2);
    const coup1 = new THREE.Mesh(coup1Geo, this.materials.machinedSteel);
    coup1.position.set(-0.02, 0, 0);
    shaftGroup.add(coup1);

    const coup2 = coup1.clone();
    coup2.position.set(0.05, 0, 0);
    shaftGroup.add(coup2);

    shaftGroup.position.set(0, 0.32, 0);
    root.add(shaftGroup);
    components.shaft = shaftGroup;

    // 4. Cartridge Mechanical Seal Module
    const mechSealGroup = new THREE.Group();
    mechSealGroup.name = 'mech_seal';
    const sealSleeveGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.1, 24);
    sealSleeveGeo.rotateZ(Math.PI / 2);
    const sealSleeve = new THREE.Mesh(sealSleeveGeo, this.materials.machinedSteel.clone());
    mechSealGroup.add(sealSleeve);

    const glandPlateGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 24);
    glandPlateGeo.rotateZ(Math.PI / 2);
    const glandPlate = new THREE.Mesh(glandPlateGeo, this.materials.brassImpeller.clone());
    mechSealGroup.add(glandPlate);

    // Flush Line Port
    const flushPortGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.06, 12);
    const flushPort = new THREE.Mesh(flushPortGeo, this.materials.machinedSteel);
    flushPort.position.set(0, 0.12, 0);
    mechSealGroup.add(flushPort);

    mechSealGroup.position.set(-0.16, 0.32, 0);
    root.add(mechSealGroup);
    components.mech_seal = mechSealGroup;

    // 5. Centrifugal Pump Volute Casing
    const pumpVoluteGroup = new THREE.Group();
    pumpVoluteGroup.name = 'volute_casing';
    pumpVoluteGroup.position.set(-0.45, 0.32, 0);

    // Torus / Spiral chamber approximation
    const voluteGeo = new THREE.TorusGeometry(0.24, 0.11, 20, 36);
    voluteGeo.rotateY(Math.PI / 2);
    const voluteMesh = new THREE.Mesh(voluteGeo, this.materials.castIron.clone());
    pumpVoluteGroup.add(voluteMesh);

    // Suction Inlet Flange (Horizontal Axial)
    const suctionPipeGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.24, 24);
    suctionPipeGeo.rotateZ(Math.PI / 2);
    const suctionPipe = new THREE.Mesh(suctionPipeGeo, this.materials.castIron.clone());
    suctionPipe.position.set(-0.16, 0, 0);
    pumpVoluteGroup.add(suctionPipe);

    const suctionFlangeGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24);
    suctionFlangeGeo.rotateZ(Math.PI / 2);
    const suctionFlange = new THREE.Mesh(suctionFlangeGeo, this.materials.castIron.clone());
    suctionFlange.position.set(-0.28, 0, 0);
    pumpVoluteGroup.add(suctionFlange);

    // Discharge Outlet Flange (Vertical Tangential)
    const dischargePipeGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.25, 24);
    const dischargePipe = new THREE.Mesh(dischargePipeGeo, this.materials.castIron.clone());
    dischargePipe.position.set(0, 0.26, 0.14);
    pumpVoluteGroup.add(dischargePipe);

    const dischargeFlangeGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.04, 24);
    const dischargeFlange = new THREE.Mesh(dischargeFlangeGeo, this.materials.castIron.clone());
    dischargeFlange.position.set(0, 0.38, 0.14);
    pumpVoluteGroup.add(dischargeFlange);

    root.add(pumpVoluteGroup);
    components.volute_casing = pumpVoluteGroup;

    // 6. Centrifugal Impeller inside pump
    const impellerGroup = new THREE.Group();
    impellerGroup.name = 'impeller';
    impellerGroup.position.set(-0.45, 0.32, 0);

    const hubGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.06, 24);
    hubGeo.rotateZ(Math.PI / 2);
    const hubMesh = new THREE.Mesh(hubGeo, this.materials.brassImpeller.clone());
    impellerGroup.add(hubMesh);

    // 6x Curved Backward Impeller Vanes
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const vaneGeo = new THREE.BoxGeometry(0.02, 0.14, 0.04);
      const vane = new THREE.Mesh(vaneGeo, this.materials.brassImpeller.clone());
      vane.position.set(0, Math.cos(angle) * 0.12, Math.sin(angle) * 0.12);
      vane.rotation.x = angle + 0.4;
      impellerGroup.add(vane);
    }

    // Impeller Shroud Plate
    const shroudGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.015, 24);
    shroudGeo.rotateZ(Math.PI / 2);
    const shroudMesh = new THREE.Mesh(shroudGeo, this.materials.brassImpeller.clone());
    shroudMesh.position.x = 0.02;
    impellerGroup.add(shroudMesh);

    root.add(impellerGroup);
    components.impeller = impellerGroup;

    // Attach metadata for animations & exploded view
    root.userData = {
      modelType: 'pump',
      components,
      defaultPositions: {
        motor: motorGroup.position.clone(),
        bearing_de: bearingDeGroup.position.clone(),
        terminal_box: terminalBoxGroup.position.clone(),
        shaft: shaftGroup.position.clone(),
        mech_seal: mechSealGroup.position.clone(),
        volute_casing: pumpVoluteGroup.position.clone(),
        impeller: impellerGroup.position.clone(),
      },
      explodedOffsets: {
        motor: new THREE.Vector3(0.2, 0, 0),
        bearing_de: new THREE.Vector3(-0.15, 0, 0),
        terminal_box: new THREE.Vector3(0, 0.22, 0),
        shaft: new THREE.Vector3(0, 0, 0),
        mech_seal: new THREE.Vector3(-0.12, 0, 0.15),
        volute_casing: new THREE.Vector3(-0.35, 0, 0),
        impeller: new THREE.Vector3(-0.25, 0, 0),
      }
    };

    return root;
  }

  /**
   * Build Substation Step-Down Transformer (TX-HV-11KV)
   */
  createTransformerModel() {
    const root = new THREE.Group();
    root.name = 'TRANSFORMER_ROOT';

    const components = {};

    // 1. Transformer Base Tank
    const tankGeo = new THREE.BoxGeometry(0.9, 0.8, 0.65);
    const tankMesh = new THREE.Mesh(tankGeo, this.materials.castIron.clone());
    tankMesh.position.y = 0.45;
    root.add(tankMesh);
    components.tank = tankMesh;

    // 2. Cooling Radiator Fins (Left & Right Flanks)
    const radiatorGroup = new THREE.Group();
    radiatorGroup.name = 'radiator_fins';
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 7; i++) {
        const finGeo = new THREE.BoxGeometry(0.02, 0.6, 0.25);
        const fin = new THREE.Mesh(finGeo, this.materials.castIron.clone());
        fin.position.set((i - 3) * 0.11, 0.45, side * 0.42);
        radiatorGroup.add(fin);
      }
    }
    root.add(radiatorGroup);

    // 3. Oil Conservator Drum (Elevated Tank on top)
    const conservatorGroup = new THREE.Group();
    conservatorGroup.name = 'conservator_tank';
    conservatorGroup.position.set(0, 1.05, -0.15);

    const drumGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.7, 24);
    drumGeo.rotateZ(Math.PI / 2);
    const drumMesh = new THREE.Mesh(drumGeo, this.materials.castIron.clone());
    conservatorGroup.add(drumMesh);

    // Magnetic Oil Gauge on Conservator face
    const mogGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16);
    mogGeo.rotateZ(Math.PI / 2);
    const mog = new THREE.Mesh(mogGeo, this.materials.machinedSteel);
    mog.position.set(0.36, 0, 0);
    conservatorGroup.add(mog);

    root.add(conservatorGroup);
    components.conservator_tank = conservatorGroup;

    // 4. Buchholz Relay (Between Main Tank and Conservator)
    const buchholzGroup = new THREE.Group();
    buchholzGroup.name = 'buchholz_relay';
    buchholzGroup.position.set(-0.15, 0.92, -0.05);

    // Relay Casing Body
    const relayBodyGeo = new THREE.BoxGeometry(0.12, 0.14, 0.12);
    const relayBody = new THREE.Mesh(relayBodyGeo, this.materials.safetyYellow.clone());
    buchholzGroup.add(relayBody);

    // Inspection Sight Glass Window
    const glassWinGeo = new THREE.BoxGeometry(0.04, 0.08, 0.125);
    const glassWin = new THREE.Mesh(glassWinGeo, this.materials.glassClear);
    buchholzGroup.add(glassWin);

    // Connecting Pipework to Conservator
    const pipeGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.25, 16);
    pipeGeo.rotateX(0.4);
    const pipeMesh = new THREE.Mesh(pipeGeo, this.materials.castIron);
    pipeMesh.position.set(0, 0.08, -0.05);
    buchholzGroup.add(pipeMesh);

    // Gas Release Petcock Valve on Top of Buchholz
    const petcockGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.04, 12);
    const petcock = new THREE.Mesh(petcockGeo, this.materials.brassImpeller);
    petcock.position.set(0, 0.09, 0);
    buchholzGroup.add(petcock);

    root.add(buchholzGroup);
    components.buchholz_relay = buchholzGroup;

    // 5. High-Voltage (11kV) Porcelain Bushings (3 Phase: R, Y, B)
    const hvBushingsGroup = new THREE.Group();
    hvBushingsGroup.name = 'hv_bushings';
    hvBushingsGroup.position.set(0, 0.85, 0.15);

    for (let phase = -1; phase <= 1; phase++) {
      const phaseBushing = new THREE.Group();
      phaseBushing.position.x = phase * 0.25;

      // Ribbed porcelain sheds (4 skirts)
      for (let s = 0; s < 4; s++) {
        const skirtGeo = new THREE.ConeGeometry(0.065 - s * 0.005, 0.04, 16);
        const skirt = new THREE.Mesh(skirtGeo, this.materials.porcelainBrown.clone());
        skirt.position.y = s * 0.055 + 0.04;
        phaseBushing.add(skirt);
      }

      // Copper Terminal Stud on Top
      const studGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.08, 12);
      const stud = new THREE.Mesh(studGeo, this.materials.copperBushing);
      stud.position.y = 0.28;
      phaseBushing.add(stud);

      hvBushingsGroup.add(phaseBushing);
    }
    root.add(hvBushingsGroup);
    components.hv_bushings = hvBushingsGroup;

    // 6. Silica Gel Breather Cylinder
    const breatherGroup = new THREE.Group();
    breatherGroup.name = 'silicagel_breather';
    breatherGroup.position.set(0.48, 0.55, -0.2);

    // Glass Cylinder Tube
    const cylTubeGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.22, 20);
    const cylTube = new THREE.Mesh(cylTubeGeo, this.materials.glassClear);
    breatherGroup.add(cylTube);

    // Silica Gel Beads inside (Color toggles between Pink/Blue based on fault)
    const gelCoreGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.19, 16);
    const gelCore = new THREE.Mesh(gelCoreGeo, this.materials.silicaPink.clone());
    gelCore.name = 'silica_core_mesh';
    breatherGroup.add(gelCore);

    // Bottom Oil Seal Cup
    const cupGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.06, 16);
    const cup = new THREE.Mesh(cupGeo, this.materials.machinedSteel);
    cup.position.y = -0.13;
    breatherGroup.add(cup);

    // Connecting Pipe from conservator down to breather
    const breatherPipeGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.45, 12);
    const breatherPipe = new THREE.Mesh(breatherPipeGeo, this.materials.castIron);
    breatherPipe.position.set(0, 0.26, 0);
    breatherGroup.add(breatherPipe);

    root.add(breatherGroup);
    components.silicagel_breather = breatherGroup;

    // 7. Bottom Drain Valve / Sampling Cock
    const drainValveGroup = new THREE.Group();
    drainValveGroup.name = 'drain_valve';
    drainValveGroup.position.set(-0.35, 0.1, 0.35);

    const drainBodyGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const drainBody = new THREE.Mesh(drainBodyGeo, this.materials.brassImpeller.clone());
    drainValveGroup.add(drainBody);

    const valveWheelGeo = new THREE.TorusGeometry(0.04, 0.01, 8, 16);
    valveWheelGeo.rotateX(Math.PI / 2);
    const valveWheel = new THREE.Mesh(valveWheelGeo, this.materials.safetyYellow);
    valveWheel.position.z = 0.06;
    drainValveGroup.add(valveWheel);

    root.add(drainValveGroup);
    components.drain_valve = drainValveGroup;

    // Attach metadata
    root.userData = {
      modelType: 'transformer',
      components,
      defaultPositions: {
        conservator_tank: conservatorGroup.position.clone(),
        buchholz_relay: buchholzGroup.position.clone(),
        hv_bushings: hvBushingsGroup.position.clone(),
        silicagel_breather: breatherGroup.position.clone(),
        drain_valve: drainValveGroup.position.clone(),
      },
      explodedOffsets: {
        conservator_tank: new THREE.Vector3(0, 0.35, 0),
        buchholz_relay: new THREE.Vector3(-0.2, 0.15, 0.1),
        hv_bushings: new THREE.Vector3(0, 0.25, 0),
        silicagel_breather: new THREE.Vector3(0.25, 0, 0),
        drain_valve: new THREE.Vector3(0, -0.05, 0.15),
      }
    };

    return root;
  }

  /**
   * Build Industrial Chiller & Compressor System (HVAC-CHILL-800T)
   */
  createChillerModel() {
    const root = new THREE.Group();
    root.name = 'CHILLER_ROOT';

    const components = {};

    // 1. Lower Evaporator Barrel (Shell)
    const evapGeo = new THREE.CylinderGeometry(0.26, 0.26, 1.2, 32);
    evapGeo.rotateZ(Math.PI / 2);
    const evapMesh = new THREE.Mesh(evapGeo, this.materials.castIron.clone());
    evapMesh.position.set(0, 0.3, -0.2);
    root.add(evapMesh);
    components.evaporator = evapMesh;

    // 2. Upper Condenser Barrel
    const condGroup = new THREE.Group();
    condGroup.name = 'condenser';
    condGroup.position.set(0, 0.3, 0.25);

    const condGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.15, 32);
    condGeo.rotateZ(Math.PI / 2);
    const condMesh = new THREE.Mesh(condGeo, this.materials.castIron.clone());
    condGroup.add(condMesh);

    // Water Headers & Flanges on ends
    for (let end = -1; end <= 1; end += 2) {
      const headerGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.06, 24);
      headerGeo.rotateZ(Math.PI / 2);
      const header = new THREE.Mesh(headerGeo, this.materials.safetyYellow);
      header.position.x = end * 0.6;
      condGroup.add(header);
    }
    root.add(condGroup);
    components.condenser = condGroup;

    // 3. Twin Screw Compressor Mounted Top Center
    const compGroup = new THREE.Group();
    compGroup.name = 'compressor';
    compGroup.position.set(0, 0.72, 0);

    const compBodyGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.6, 24);
    compBodyGeo.rotateZ(Math.PI / 2);
    const compBody = new THREE.Mesh(compBodyGeo, this.materials.machinedSteel.clone());
    compGroup.add(compBody);

    // Suction Muffler Bell
    const bellGeo = new THREE.ConeGeometry(0.19, 0.2, 20);
    bellGeo.rotateZ(Math.PI / 2);
    const bell = new THREE.Mesh(bellGeo, this.materials.machinedSteel.clone());
    bell.position.x = -0.38;
    compGroup.add(bell);

    root.add(compGroup);
    components.compressor = compGroup;

    // 4. Liquid Line Sight Glass
    const sightGlassGroup = new THREE.Group();
    sightGlassGroup.name = 'sight_glass';
    sightGlassGroup.position.set(0.35, 0.45, 0.32);

    const sightBodyGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 16);
    sightBodyGeo.rotateZ(Math.PI / 2);
    const sightBody = new THREE.Mesh(sightBodyGeo, this.materials.brassImpeller.clone());
    sightGlassGroup.add(sightBody);

    const sightGlassEyeGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.082, 16);
    sightGlassEyeGeo.rotateZ(Math.PI / 2);
    const sightGlassEye = new THREE.Mesh(sightGlassEyeGeo, this.materials.glassClear);
    sightGlassGroup.add(sightGlassEye);

    root.add(sightGlassGroup);
    components.sight_glass = sightGlassGroup;

    // 5. Electronic Expansion Valve (TXV)
    const txvGroup = new THREE.Group();
    txvGroup.name = 'expansion_valve';
    txvGroup.position.set(-0.35, 0.35, 0.15);

    const valveBlockGeo = new THREE.BoxGeometry(0.08, 0.12, 0.08);
    const valveBlock = new THREE.Mesh(valveBlockGeo, this.materials.brassImpeller.clone());
    txvGroup.add(valveBlock);

    // Actuator Head
    const headGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.06, 16);
    const head = new THREE.Mesh(headGeo, this.materials.machinedSteel);
    head.position.y = 0.08;
    txvGroup.add(head);

    root.add(txvGroup);
    components.expansion_valve = txvGroup;

    // Attach metadata
    root.userData = {
      modelType: 'chiller',
      components,
      defaultPositions: {
        condenser: condGroup.position.clone(),
        compressor: compGroup.position.clone(),
        sight_glass: sightGlassGroup.position.clone(),
        expansion_valve: txvGroup.position.clone(),
      },
      explodedOffsets: {
        condenser: new THREE.Vector3(0, 0, 0.3),
        compressor: new THREE.Vector3(0, 0.35, 0),
        sight_glass: new THREE.Vector3(0.15, 0.1, 0.15),
        expansion_valve: new THREE.Vector3(-0.25, 0, 0.1),
      }
    };

    return root;
  }
}
