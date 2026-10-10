// Localization Strings for AR-MARG Offline Assistant
// Supports English and Gujarati (ગુજરાતી)

export const TRANSLATIONS = {
  en: {
    appTitle: "AR-MARG Maintenance XR",
    tagline: "Offline Spatial AR Maintenance & Fault Diagnostics",
    badgeOffline: "100% OFFLINE SECURE",
    badgeUnderground: "UNDERGROUND READY",
    xrStatusPhone: "Phone WebXR / Cam AR",
    xrStatusQuest: "Meta Quest 3 Passthrough",
    
    // Header & Actions
    searchPlaceholder: "Describe fault in English or Gujarati (e.g. bearing overheat, oil leak)...",
    searchBtn: "Diagnose Fault",
    photoBtn: "Photograph Fault",
    voiceBtn: "Voice Input",
    clearBtn: "Clear",
    customManualBtn: "Load Custom Doc",
    
    // Tabs & Modes
    tabManuals: "Manuals Database",
    tabDiagnostics: "Fault Guide",
    tabArTools: "AR Tools",
    tabExploded: "3D Digital Twin",
    
    // Quick Fault Presets
    quickPresetsTitle: "Common Underground Fault Symptoms:",
    presetBearing: "🔥 Bearing Overheating (>85°C)",
    presetSeal: "💧 Pump Mechanical Seal Leak",
    presetBuchholz: "⚡ Transformer Buchholz Trip",
    presetSilica: "🌸 Silica Gel Pink Saturation",
    presetChiller: "❄️ Chiller High Head Pressure",
    
    // AR Overlay & Spatial HUD
    arModeWebXR: "Launch Meta Quest 3 / WebXR AR",
    arModeCamera: "Start Mobile Camera AR",
    arMode3D: "3D Inspection Sandbox",
    arExit: "Exit AR Mode",
    arPlacePrompt: "Point device at flat floor or surface & tap to place equipment",
    arResetPlacement: "Reposition 3D Model",
    
    // Step navigation
    stepLabel: "STEP",
    ofLabel: "OF",
    safetyWarningLabel: "MANDATORY SAFETY PROTOCOL (LOTO)",
    actionLabel: "Action Required",
    toolSimLabel: "Virtual AR Tool Check",
    nextStep: "Next Step",
    prevStep: "Previous Step",
    completeInspection: "Complete & Sign Off Checklist",
    checklistFinished: "Troubleshooting Complete! Equipment Passed Inspection.",
    readAloud: "Read in Voice",
    stopReading: "Stop Voice",
    
    // Tools
    toolThermal: "Infrared Thermal Imager",
    toolMultimeter: "Digital Multimeter",
    toolTorque: "Calibrated Torque Wrench",
    toolLoupe: "Inspection Endoscope",
    simulateToolAction: "Trigger Tool Measurement",
    
    // Photo analyzer dialog
    photoModalTitle: "On-Device Visual Fault Classifier",
    photoModalDesc: "Snap or upload a photo of the damaged component. Computer vision runs 100% locally on your device without internet.",
    uploadPhoto: "Upload Photo from Storage",
    captureCamera: "Capture Live AR Snapshot",
    analyzingImage: "Running on-device neural edge classification...",
    detectedFault: "Detected Fault Signature",
    confidenceScore: "Confidence Match",
    applyFaultGuide: "Open 3D AR Repair Guide",
    
    // Custom PDF/Manual load
    customDocTitle: "Load On-Device Technical Manual (PDF / TXT)",
    customDocDesc: "Technicians can import local equipment manuals directly. Indexed offline with zero server calls.",
    fileDropPrompt: "Drop PDF/TXT file here or tap to browse",
    indexSuccess: "Manual indexed successfully into offline cache!",
    
    // Exploded & 3D controls
    explodedSlider: "3D Exploded View",
    heatMapToggle: "Thermal Heatmap Layer",
    xrayToggle: "X-Ray Casing Wireframe",
    rotatePrompt: "Drag to rotate | Pinch to zoom | Two fingers to pan"
  },
  gu: {
    appTitle: "એઆર-માર્ગ (AR-MARG)",
    tagline: "ઑફલાઇન ઓગમેન્ટેડ રિયાલિટી મેન્ટેનન્સ અને ફોલ્ટ ડાયગ્નોસ્ટિક્સ સહાયક",
    badgeOffline: "૧૦૦% ઑફલાઇન સુરક્ષિત",
    badgeUnderground: "ભૂગર્ભ વિભાગ સક્ષમ",
    xrStatusPhone: "ફોન WebXR / કેમેરા AR",
    xrStatusQuest: "મેટા ક્વેસ્ટ ૩ પાસથ્રુ XR",
    
    // Header & Actions
    searchPlaceholder: "ખામીનું વર્ણન કરો (દા.ત. બેરિંગ ગરમ, ઓઇલ લીકેજ, ધુમાડો, અવાજ)...",
    searchBtn: "ફોલ્ટ શોધો",
    photoBtn: "ફોટોગ્રાફ સ્કેન",
    voiceBtn: "અવાજ દ્વારા ઇનપુટ",
    clearBtn: "સાફ કરો",
    customManualBtn: "પોતાનું મેન્યુઅલ ઉમેરો",
    
    // Tabs & Modes
    tabManuals: "ટેકનિકલ મેન્યુઅલ",
    tabDiagnostics: "રિપેર માર્ગદર્શિકા",
    tabArTools: "એઆર સાધનો",
    tabExploded: "૩D ડિજિટલ ટ્વિન",
    
    // Quick Fault Presets
    quickPresetsTitle: "સામાન્ય ભૂગર્ભ ખામીના લક્ષણો:",
    presetBearing: "🔥 બેરિંગ અતિશય ગરમ (>૮૫°C)",
    presetSeal: "💧 પમ્પ મિકેનિકલ સીલ લીકેજ",
    presetBuchholz: "⚡ ટ્રાન્સફોર્મર બુખોલ્ઝ ટ્રીપ",
    presetSilica: "🌸 સિલિકા જેલ ગુલાબી થવી",
    presetChiller: "❄️ ચિલર હાઇ પ્રેશર ટ્રીપ",
    
    // AR Overlay & Spatial HUD
    arModeWebXR: "મેટા ક્વેસ્ટ ૩ / WebXR શરૂ કરો",
    arModeCamera: "મોબાઇલ કેમેરા AR ચાલુ કરો",
    arMode3D: "૩D નિરીક્ષણ સેન્ડબોક્સ",
    arExit: "AR મોડ બંધ કરો",
    arPlacePrompt: "જમીન કે ફ્લેટ સપાટી તરફ કેમેરા રાખો અને મશીન મૂકવા ટૅપ કરો",
    arResetPlacement: "મશીનની સ્થિતિ બદલો",
    
    // Step navigation
    stepLabel: "પગલું",
    ofLabel: "કુલમાંથી",
    safetyWarningLabel: "ફરજિયાત સુરક્ષા પ્રોટોકોલ (LOTO)",
    actionLabel: "જરૂરી પગલાં",
    toolSimLabel: "વર્ચ્યુઅલ AR ટૂલ ચકાસણી",
    nextStep: "આગળનું પગલું",
    prevStep: "પાછળનું પગલું",
    completeInspection: "કામ પૂર્ણ - ચેકલિસ્ટ સબમિટ કરો",
    checklistFinished: "મુશ્કેલીનિવારણ પૂર્ણ! સાધનોની ચકાસણી સફળ રહી.",
    readAloud: "ગુજરાતીમાં સાંભળો",
    stopReading: "અવાજ બંધ કરો",
    
    // Tools
    toolThermal: "ઇન્ફ્રારેડ થર્મલ ઇમેજર",
    toolMultimeter: "ડિજિટલ મલ્ટિમીટર",
    toolTorque: "ટોર્ક રેન્ચ",
    toolLoupe: "ઇન્સ્પેક્શન એન્ડોસ્કોપ",
    simulateToolAction: "માપન ટેસ્ટ શરૂ કરો",
    
    // Photo analyzer dialog
    photoModalTitle: "ઑન-ડિવાઇસ વિઝ્યુઅલ ફોલ્ટ ક્લાસિફાયર",
    photoModalDesc: "ખામીવાળા પાર્ટનો ફોટો પાડો અથવા અપલોડ કરો. કમ્પ્યુટર વિઝન ઇન્ટરનેટ વિના ૧૦૦% તમારા ઉપકરણ પર જ વિશ્લેષણ કરશે.",
    uploadPhoto: "ડિવાઇસમાંથી ફોટો પસંદ કરો",
    captureCamera: "લાઇવ AR સ્નેપશોટ લો",
    analyzingImage: "ઑન-ડિવાઇસ ન્યુરલ નેટવર્ક વિશ્લેષણ ચાલુ છે...",
    detectedFault: "શોધાયેલ ખામીની વિગત",
    confidenceScore: "ચોક્કસતા ગુણાંક",
    applyFaultGuide: "૩D AR રિપેર ગાઇડ શરૂ કરો",
    
    // Custom PDF/Manual load
    customDocTitle: "ડિવાઇસ પર સંગ્રહિત મેન્યુઅલ લોડ કરો (PDF / TXT)",
    customDocDesc: "ટેકનિશિયનો સીધા જ સ્થાનિક મેન્યુઅલ ઉમેરી શકે છે. ક્લાઉડ કનેક્શન વિના ઑફલાઇન શોધ થશે.",
    fileDropPrompt: "PDF/TXT ફાઇલ અહીં ખેંચો અથવા બ્રાઉઝ કરો",
    indexSuccess: "મેન્યુઅલ સફળતાપૂર્વક ઑફલાઇન ઇન્ડેક્સ થઈ ગયું!",
    
    // Exploded & 3D controls
    explodedSlider: "૩D છૂટા પાર્ટ્સ વ્યુ (Exploded View)",
    heatMapToggle: "થર્મલ હીટમેપ લેયર",
    xrayToggle: "એક્સ-રે વાયરફ્રેમ કેસીંગ",
    rotatePrompt: "ફેરવવા ડ્રેગ કરો | ઝૂમ કરવા પિંચ કરો | બે આંગળીથી ખસેડો"
  }
};
