// Test images generator for On-Device Fault Photograph Analyzer
// Generates realistic photographic visual textures for testing offline fault detection

export function generateTestFaultImage(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  if (type === 'pink_silica') {
    // Transformer Breather with Pink Saturated Crystals
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 400, 400);

    // Glass cylinder body
    ctx.fillStyle = '#334155';
    ctx.fillRect(100, 60, 200, 280);

    // Glass reflection
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(100, 60, 200, 280);

    // Pink crystal beads cluster
    for (let i = 0; i < 450; i++) {
      const x = 115 + Math.random() * 170;
      const y = 80 + Math.random() * 240;
      const r = 5 + Math.random() * 6;
      ctx.fillStyle = Math.random() > 0.2 ? '#f43f5e' : '#fb7185';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Metal caps
    ctx.fillStyle = '#64748b';
    ctx.fillRect(90, 40, 220, 25);
    ctx.fillRect(90, 335, 220, 25);

  } else if (type === 'bearing_hotspot') {
    // Thermal Infrared Hotspot on Motor Bearing
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 400, 400);

    // Machine housing base (Cool blue 25°C)
    const baseGrad = ctx.createLinearGradient(0, 0, 400, 400);
    baseGrad.addColorStop(0, '#1e3a8a');
    baseGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(60, 80, 280, 240);

    // Intense thermal hotspot (Red/Yellow/White >90°C)
    const heatGrad = ctx.createRadialGradient(200, 200, 10, 200, 200, 110);
    heatGrad.addColorStop(0, '#ffffff'); // Center white-hot
    heatGrad.addColorStop(0.25, '#fef08a'); // Yellow
    heatGrad.addColorStop(0.55, '#ef4444'); // Crimson
    heatGrad.addColorStop(0.85, '#991b1b'); // Dark red
    heatGrad.addColorStop(1, 'rgba(30, 58, 138, 0)');
    ctx.fillStyle = heatGrad;
    ctx.beginPath();
    ctx.arc(200, 200, 110, 0, Math.PI * 2);
    ctx.fill();

  } else if (type === 'burnt_bushing') {
    // High Voltage Bushing Carbon Arc Flashover
    ctx.fillStyle = '#292524';
    ctx.fillRect(0, 0, 400, 400);

    // Ceramic porcelain body (Brown/Rust)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(130, 40, 140, 320);

    // Porcelain ribbed skirts
    for (let y = 80; y <= 320; y += 45) {
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.ellipse(200, y, 95, 20, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Heavy carbonized black scorch lightning tree
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(200, 50);
    ctx.lineTo(185, 120);
    ctx.lineTo(215, 180);
    ctx.lineTo(190, 260);
    ctx.lineTo(220, 340);
    ctx.stroke();

    // Carbon soot smudge
    const sootGrad = ctx.createRadialGradient(200, 200, 10, 200, 200, 70);
    sootGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    sootGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sootGrad;
    ctx.beginPath();
    ctx.arc(200, 200, 70, 0, Math.PI * 2);
    ctx.fill();

  } else {
    // Mechanical Seal Slurry Leakage & Oil Puddle
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, 400, 400);

    // Metal pump casing
    ctx.fillStyle = '#475569';
    ctx.fillRect(50, 50, 300, 200);

    // Dark oily puddle and drip trail
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(200, 310, 120, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dripping stream
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(200, 180);
    ctx.lineTo(200, 290);
    ctx.stroke();

    // Crystalline slurry crust edges
    ctx.fillStyle = '#e2e8f0';
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 90 + Math.random() * 25;
      const cx = 200 + Math.cos(angle) * dist;
      const cy = 310 + Math.sin(angle) * (dist * 0.4);
      ctx.fillRect(cx, cy, 3, 3);
    }
  }

  return canvas.toDataURL('image/jpeg', 0.85);
}
