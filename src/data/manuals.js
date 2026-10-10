// Offline Technical Manuals Database
// Fully localized in Gujarati and English for underground/offline maintenance technicians

export const MANUALS = [
  {
    id: "IND-PUMP-400X",
    code: "PUMP-400X",
    title: {
      en: "Heavy-Duty 3-Phase Induction Motor & Centrifugal Slurry Pump",
      gu: "હેવી-ડ્યુટી ૩-ફેઝ ઇન્ડક્શન મોટર અને સેન્ટ્રીફ્યુગલ પમ્પ"
    },
    category: {
      en: "Pumping & Fluid Mechanics",
      gu: "પમ્પિંગ અને ફ્લુઇડ મિકેનિક્સ"
    },
    specs: {
      en: "415V AC, 75 kW, 1480 RPM, IP66 Class H, Mechanical Seal Type Cartridge",
      gu: "૪૧૫V AC, ૭૫ kW, ૧૪૮૦ RPM, IP66 ક્લાસ H, મિકેનિકલ સીલ કાર્ટ્રિજ ટાઇપ"
    },
    defaultModel: "pump",
    faults: [
      {
        id: "pump-fault-bearing-overheat",
        keywords: [
          "bearing", "overheat", "vibration", "noise", "temperature", "hot", "grease", "sound",
          "બેરિંગ", "ગરમ", "અતિશય ગરમી", "ધ્રુજારી", "અવાજ", "તાપમાન", "ગ્રીસ", "કંપન"
        ],
        symptom: {
          en: "Drive-End Bearing Housing Overheating (>85°C) & Excessive Radial Vibration",
          gu: "ડ્રાઇવ-એન્ડ બેરિંગ હાઉસિંગ અતિશય ગરમ થવું (>૮૫°C) અને વધુ પડતી ધ્રુજારી"
        },
        urgency: "CRITICAL",
        confidence: 0.96,
        visualClues: {
          en: "Discoloration on bearing cap, burnt grease smell, abnormal metallic rumbling",
          gu: "બેરિંગ કેપ પર કાળાશ/ડિસ્કલરેશન, બળેલી ગ્રીસની ગંધ, અસામાન્ય ધાતુનો અવાજ"
        },
        affectedComponent: "bearing_de",
        toolNeeded: "thermal_scanner",
        arPinPosition: [0.35, 0.45, 0.6],
        steps: [
          {
            stepNumber: 1,
            title: {
              en: "Safety Isolation & Lockout-Tagout (LOTO)",
              gu: "સલામતી અલગતા અને લોકઆઉટ-ટેગઆઉટ (LOTO)"
            },
            instruction: {
              en: "De-energize 415V MCC feeder switch. Lock padlocks on handle and hang 'DANGER: MEN AT WORK' tag. Verify zero voltage using multimeter at terminal box before touching casing.",
              gu: "૪૧૫V MCC ફીડર સ્વીચ બંધ કરો. હેન્ડલ પર પેડલોક લગાવી 'સાવધાન: કામ ચાલુ છે' ટેગ લગાવો. કેસીંગને સ્પર્શતા પહેલા ટર્મિનલ બોક્સ પર મલ્ટિમીટર વડે શૂન્ય વોલ્ટેજ ચકાસો."
            },
            safetyWarning: {
              en: "DANGER: High voltage electric shock risk. Wait 5 minutes for capacitor discharge.",
              gu: "ચેતવણી: હાઇ વોલ્ટેજ વીજ કરંટનું જોખમ. કેપેસિટર ડિસ્ચાર્જ થવા માટે ૫ મિનિટ રાહ જુઓ."
            },
            componentHighlight: "terminal_box",
            toolAction: "multimeter",
            targetMeasurement: "0.0 V AC"
          },
          {
            stepNumber: 2,
            title: {
              en: "Thermal Anomaly Mapping & Vibration Check",
              gu: "થર્મલ વિસંગતતા મેપિંગ અને કંપન તપાસ"
            },
            instruction: {
              en: "Aim the infrared thermal scanner at the Drive-End (DE) bearing housing. If temperature exceeds 85°C (Threshold 70°C max), the roller cage has suffered lubrication breakdown.",
              gu: "ઇન્ફ્રારેડ થર્મલ સ્કેનરને ડ્રાઇવ-એન્ડ (DE) બેરિંગ હાઉસિંગ પર લગાવો. જો તાપમાન ૮૫°C થી વધુ હોય, તો રોલર કેજમાં લુબ્રિકેશનની ખામી સર્જાઈ છે."
            },
            componentHighlight: "bearing_de",
            toolAction: "thermal_scanner",
            targetMeasurement: "94.2°C (OVER LIMIT)"
          },
          {
            stepNumber: 3,
            title: {
              en: "Bearing Cap Removal & Grease Purge",
              gu: "બેરિંગ કેપ દૂર કરવી અને જૂની ગ્રીસ સાફ કરવી"
            },
            instruction: {
              en: "Unscrew 4x M12 hex bolts using torque wrench. Inspect raceway for pitting or galling. Clean out degraded black grease using non-chlorinated solvent.",
              gu: "ટોર્ક રેન્ચ વડે ૪x M12 હેક્સ બોલ્ટ ખોલો. રેસવેમાં કોઈ ઘસારો કે ખાડા તપાસો. ક્લોરિન-મુક્ત દ્રાવકથી કાળી પડેલી જૂની ગ્રીસ સાફ કરો."
            },
            componentHighlight: "bearing_de",
            toolAction: "torque_wrench",
            targetMeasurement: "45 Nm Loose"
          },
          {
            stepNumber: 4,
            title: {
              en: "Re-grease & Reassembly to Specification",
              gu: "નવી ગ્રીસ ભરવી અને સ્પેસિફિકેશન મુજબ ફિટિંગ"
            },
            instruction: {
              en: "Pack bearing void to 50% capacity with Polyurea-based high-temp grease (Grade NLGI 2). Re-torque M12 bolts to 48 Nm in criss-cross pattern. Rotate shaft by hand to confirm free spin.",
              gu: "પોલીયુરિયા હાઇ-ટેમ્પ ગ્રીસ (NLGI 2) થી ૫૦% જગ્યા ભરો. ક્રોસ પેટર્નમાં M12 બોલ્ટ્સ ૪૮ Nm પર ટોર્ક કરો. શાફ્ટને હાથથી ફેરવી તપાસો."
            },
            componentHighlight: "bearing_de",
            toolAction: "torque_wrench",
            targetMeasurement: "48 Nm Tight"
          }
        ]
      },
      {
        id: "pump-fault-mechanical-seal-leak",
        keywords: [
          "seal", "leak", "fluid", "slurry", "pressure", "water", "drip", "puddle",
          "સીલ", "લીક", "પાણી", "પ્રવાહી", "દબાણ", "ટપકવું", "મિકેનિકલ સીલ"
        ],
        symptom: {
          en: "Mechanical Seal Face Leakage & Slurry Dripping from Gland Plate",
          gu: "મિકેનિકલ સીલ ફેસ લીકેજ અને ગ્લેન્ડ પ્લેટમાંથી પ્રવાહી ટપકવું"
        },
        urgency: "HIGH",
        confidence: 0.94,
        visualClues: {
          en: "Wet crystalline deposits under pump shaft sleeve, rapid pressure drop at discharge",
          gu: "શાફ્ટ સ્લીવ નીચે ભીનાશ અને સ્ફટિક જમાવટ, ડિસ્ચાર્જ દબાણમાં અચાનક ઘટાડો"
        },
        affectedComponent: "mech_seal",
        toolNeeded: "visual_loupe",
        arPinPosition: [0.0, 0.35, 0.1],
        steps: [
          {
            stepNumber: 1,
            title: {
              en: "Suction & Discharge Valve Isolation",
              gu: "સક્શન અને ડિસ્ચાર્જ વાલ્વ બંધ કરવા"
            },
            instruction: {
              en: "Close pump suction isolation gate valve and discharge check bypass. Open drain cock to vent residual casing pressure to 0 Bar.",
              gu: "પમ્પનો સક્શન આઇસોલેશન વાલ્વ અને ડિસ્ચાર્જ વાલ્વ બંધ કરો. ડ્રેઇન વાલ્વ ખોલી અંદરનું દબાણ ૦ બાર પર લાવો."
            },
            safetyWarning: {
              en: "Wear chemical-resistant nitrile gloves and face shield to protect against slurry splatter.",
              gu: "પ્રવાહીના છાંટાથી બચવા કેમિકલ-રેઝિસ્ટન્ટ ગ્લોવ્ઝ અને ફેસ શિલ્ડ પહેરો."
            },
            componentHighlight: "volute_casing",
            toolAction: "pressure_gauge",
            targetMeasurement: "0.0 Bar"
          },
          {
            stepNumber: 2,
            title: {
              en: "Inspect Cartridge Seal Gland Bolts",
              gu: "કાર્ટ્રિજ સીલ ગ્લેન્ડ બોલ્ટ્સની ચકાસણી"
            },
            instruction: {
              en: "Check 4x gland retainer bolts. Uneven tightening causes silicon carbide face distortion. Verify flush plan pipe is unobstructed.",
              gu: "૪x ગ્લેન્ડ રિટેનર બોલ્ટ્સ તપાસો. અસમાન ટાઇટ કરવાથી સિલિકોન કાર્બાઇડ ફેસ વાંકો થાય છે. ફ્લશ પાઇપ ચોખ્ખી છે તે તપાસો."
            },
            componentHighlight: "mech_seal",
            toolAction: "torque_wrench",
            targetMeasurement: "25 Nm"
          },
          {
            stepNumber: 3,
            title: {
              en: "Replace Elastomeric O-Rings & Faces",
              gu: "ઇલાસ્ટોમેરિક O-રિંગ્સ અને ફેસ બદલવા"
            },
            instruction: {
              en: "Slide out mechanical seal cartridge. Replace degraded Viton O-rings and lapped silicon carbide stationary ring. Apply thin coating of food-grade silicone grease.",
              gu: "મિકેનિકલ સીલ કાર્ટ્રિજ બહાર કાઢો. ડેમેજ થયેલ વાઇટોન O-રિંગ્સ અને સિલિકોન કાર્બાઇડ રિંગ બદલો. સિલિકોન ગ્રીસનું હળવું પડ લગાવો."
            },
            componentHighlight: "mech_seal",
            toolAction: "visual_loupe",
            targetMeasurement: "Alignment <0.05mm"
          }
        ]
      },
      {
        id: "pump-fault-impeller-cavitation",
        keywords: [
          "impeller", "cavitation", "gravel", "noise", "vibration", "suction", "head",
          "ઇમ્પેલર", "કેવિટેશન", "પથ્થર જેવો અવાજ", "સક્શન", "દબાણ", "પાંખિયા"
        ],
        symptom: {
          en: "Severe Cavitation (Gravel Rattling Sound) & Flow Starvation",
          gu: "તીવ્ર કેવિટેશન (કાંકરા ખખડતો હોય તેવો અવાજ) અને પાણીનો પ્રવાહ અટકવો"
        },
        urgency: "MEDIUM",
        confidence: 0.91,
        visualClues: {
          en: "Pitted honeycomb texture on impeller vanes, inlet pressure gauge fluctuating wildly",
          gu: "ઇમ્પેલરની પાંખો પર મધપૂડા જેવા ખાડા, ઇનલેટ પ્રેશર ગેજમાં ભારે વધઘટ"
        },
        affectedComponent: "impeller",
        toolNeeded: "visual_loupe",
        arPinPosition: [-0.3, 0.35, -0.2],
        steps: [
          {
            stepNumber: 1,
            title: {
              en: "Suction Strainer Differential Pressure Check",
              gu: "સક્શન સ્ટ્રેનર પ્રેશર ડ્રોપ ચકાસણી"
            },
            instruction: {
              en: "Inspect suction basket strainer. If delta-P across filter exceeds 0.4 Bar, debris clogs the inlet causing NPSH margin collapse.",
              gu: "સક્શન બાસ્કેટ ફિલ્ટર તપાસો. જો પ્રેશર ડ્રોપ ૦.૪ બારથી વધુ હોય તો કચરો જમા થવાથી કેવિટેશન થાય છે."
            },
            componentHighlight: "volute_casing",
            toolAction: "pressure_gauge",
            targetMeasurement: ">0.45 Bar ΔP"
          },
          {
            stepNumber: 2,
            title: {
              en: "Volute Casing Front Shroud Inspection",
              gu: "વોલ્યુટ કેસીંગ અને ફ્રન્ટ શ્રાઉડ તપાસ"
            },
            instruction: {
              en: "Remove suction spool piece. Inspect impeller eye for vapor bubble erosion pitting. If blade thickness is <3mm, replace impeller wheel.",
              gu: "સક્શન સ્પોલ પીસ ખોલો. બબલ ઇરોઝન માટે ઇમ્પેલરની આંખ તપાસો. જો પાંખની જાડાઈ ૩mm થી ઓછી હોય તો નવું ઇમ્પેલર લગાવો."
            },
            componentHighlight: "impeller",
            toolAction: "visual_loupe",
            targetMeasurement: "Thickness 2.8mm (FAIL)"
          }
        ]
      }
    ]
  },
  {
    id: "TX-HV-11KV",
    code: "TX-11KV",
    title: {
      en: "Substation 11kV/415V Oil-Immersed Distribution Transformer",
      gu: "સબસ્ટેશન ૧૧kV/૪૧૫V ઓઇલ-ઇમર્સ્ડ ડિસ્ટ્રિબ્યુશન ટ્રાન્સફોર્મર"
    },
    category: {
      en: "High Voltage Electrical Substations",
      gu: "હાઇ વોલ્ટેજ ઇલેક્ટ્રિકલ સબસ્ટેશન્સ"
    },
    specs: {
      en: "1000 kVA, Dyn11, ONAN, Mineral Oil Insulated (IEC 60296), 11000V to 433V",
      gu: "૧૦૦૦ kVA, Dyn11, ONAN, મિનરલ ઓઇલ ઇન્સ્યુલેટેડ (IEC 60296), ૧૧૦૦૦V થી ૪૩૩V"
    },
    defaultModel: "transformer",
    faults: [
      {
        id: "tx-fault-buchholz-gas",
        keywords: [
          "buchholz", "gas", "alarm", "trip", "oil", "spark", "internal", "relay",
          "બુખોલ્ઝ", "ગેસ", "એલાર્મ", "ટ્રીપ", "ઓઇલ", "તેલ", "સ્પાર્ક", "રિલે", "વિસ્ફોટ"
        ],
        symptom: {
          en: "Buchholz Relay Stage 1 Alarm Tripped & Flammable Gas In Inspection Glass",
          gu: "બુખોલ્ઝ રિલે સ્ટેજ ૧ એલાર્મ ટ્રીપ અને ઇન્સ્પેક્શન ગ્લાસમાં ગેસ જમાવટ"
        },
        urgency: "CRITICAL",
        confidence: 0.98,
        visualClues: {
          en: "Milky or greyish gas bubble trapped inside Buchholz viewing window on pipe to conservator",
          gu: "કન્ઝર્વેટર પાઇપ પર બુખોલ્ઝ વ્યુઇંગ વિન્ડોમાં સફેદ કે ભૂખરો ગેસ બબલ દેખાવો"
        },
        affectedComponent: "buchholz_relay",
        toolNeeded: "visual_loupe",
        arPinPosition: [0.0, 0.85, 0.25],
        steps: [
          {
            stepNumber: 1,
            title: {
              en: "Immediate Substation Primary Breaker Interlock",
              gu: "સબસ્ટેશન પ્રાઇમરી બ્રેકર ઇન્ટરલોક બંધ કરવું"
            },
            instruction: {
              en: "Ensure 11kV Vacuum Circuit Breaker (VCB) is tripped and isolated. Earth both primary and secondary busbars using portable earthing leads.",
              gu: "૧૧kV વેક્યુમ સર્કિટ બ્રેકર (VCB) ટ્રીપ અને આઇસોલેટ છે તેની ખાતરી કરો. પ્રાઇમરી અને સેકન્ડરી બસબારને અર્થિંગ લીડ્સ વડે ગ્રાઉન્ડ કરો."
            },
            safetyWarning: {
              en: "EXTREME LETHAL VOLTAGE: Do not approach bushings until earthing rod is clamped.",
              gu: "અત્યંત જીવલેણ વોલ્ટેજ: જ્યાં સુધી અર્થિંગ રોડ ન લાગે ત્યાં સુધી બુશિંગ પાસે ન જશો."
            },
            componentHighlight: "hv_bushings",
            toolAction: "multimeter",
            targetMeasurement: "0.0 V Phase-Earth"
          },
          {
            stepNumber: 2,
            title: {
              en: "Sample & Test Buchholz Accumulated Gas",
              gu: "બુખોલ્ઝ ગેસ સેમ્પલિંગ અને પરીક્ષણ"
            },
            instruction: {
              en: "Attach sampling syringe to the upper gas release petcock. Test gas flammability with chemical tester. White/grey gas indicates cellulose insulation breakdown.",
              gu: "ઉપરના ગેસ રીલીઝ વાલ્વ પર સિરીંજ લગાવો. ગેસનું પરીક્ષણ કરો. સફેદ/ભૂખરો ગેસ વાઇન્ડિંગનું કાગળ ઇન્સ્યુલેશન બળી ગયાનું દર્શાવે છે."
            },
            componentHighlight: "buchholz_relay",
            toolAction: "visual_loupe",
            targetMeasurement: "Hydrogen & Acetylene Detected"
          },
          {
            stepNumber: 3,
            title: {
              en: "Oil Dielectric Breakdown Voltage (BDV) Test",
              gu: "ઓઇલ ડાઇઇલેક્ટ્રિક બ્રેકડાઉન વોલ્ટેજ (BDV) ટેસ્ટ"
            },
            instruction: {
              en: "Draw bottom oil sample into clean test bottle. Measure BDV using portable oil cup tester. Acceptance minimum is 40 kV/2.5mm gap. If below 30 kV, oil filtration is compulsory.",
              gu: "તળિયેથી ઓઇલ સેમ્પલ લો. પોર્ટેબલ ટેસ્ટર વડે BDV માપો. નિયમ મુજબ ઓછામાં ઓછું ૪૦ kV હોવું જોઈએ. જો ૩૦ kV થી ઓછું હોય તો ઓઇલ ફિલ્ટરેશન ફરજિયાત છે."
            },
            componentHighlight: "drain_valve",
            toolAction: "multimeter",
            targetMeasurement: "26.4 kV (FAIL - FILTER REQUIRED)"
          }
        ]
      },
      {
        id: "tx-fault-silicagel-pink",
        keywords: [
          "silica", "breather", "pink", "blue", "moisture", "humidity", "water", "air",
          "સિલિકા", "બ્લીધર", "ગુલાબી", "વાદળી", "ભેજ", "તેલ ટાંકી", "હવા"
        ],
        symptom: {
          en: "Silica Gel Breather Crystals Turned Completely Pink (Moisture Saturated)",
          gu: "સિલિકા જેલ બ્લીધરના ક્રિસ્ટલ સંપૂર્ણ ગુલાબી થઈ ગયા (ભેજથી ભરાઈ ગયા)"
        },
        urgency: "HIGH",
        confidence: 0.95,
        visualClues: {
          en: "Translucent glass cylinder shows pink crystals, oil seal cup dry or clogged",
          gu: "કાચના સિલિન્ડરમાં વાદળીને બદલે ગુલાબી દાણા દેખાવા, ઓઇલ સીલ કપ સૂકો હોવો"
        },
        affectedComponent: "silicagel_breather",
        toolNeeded: "visual_loupe",
        arPinPosition: [0.45, 0.55, 0.3],
        steps: [
          {
            stepNumber: 1,
            title: {
              en: "Unscrew Breather Assembly & Check Oil Cup",
              gu: "બ્લીધર એસેમ્બલી ખોલવી અને ઓઇલ કપ તપાસવો"
            },
            instruction: {
              en: "Unscrew bottom oil seal cup. Verify transformer mineral oil level in the cup. The oil traps dust and stops atmospheric air ingress when idle.",
              gu: "નીચેનો ઓઇલ સીલ કપ ખોલો. કપમાં ટ્રાન્સફોર્મર ઓઇલનું સ્તર તપાસો. આ ઓઇલ ધૂળ અને વાતાવરણના ભેજને અંદર જતાં અટકાવે છે."
            },
            componentHighlight: "silicagel_breather",
            toolAction: "visual_loupe",
            targetMeasurement: "Oil Level OK"
          },
          {
            stepNumber: 2,
            title: {
              en: "Replace Saturated Pink Gel with Active Deep Blue Gel",
              gu: "ગુલાબી જેલ કાઢીને સક્રિય ડીપ બ્લુ જેલ ભરવી"
            },
            instruction: {
              en: "Empty pink cobalt-chloride silica gel crystals. Refill with fresh, oven-baked deep blue crystals (reactivated at 140°C for 3 hours). Ensure top gasket creates airtight seal.",
              gu: "ગુલાબી થઈ ગયેલા દાણા ખાલી કરો. ૧૪૦°C તાપમાને શેકેલા તાજા વાદળી દાણા ભરો. ઉપરની ગાસ્કેટ સંપૂર્ણ એરટાઇટ રહે તેની ખાતરી કરો."
            },
            componentHighlight: "silicagel_breather",
            toolAction: "torque_wrench",
            targetMeasurement: "Sealed Airtight"
          }
        ]
      },
      {
        id: "tx-fault-bushing-flashover",
        keywords: [
          "bushing", "flashover", "crack", "spark", "porcelain", "creepage", "carbon",
          "બુશિંગ", "તણખા", "તિરાડ", "કાર્બન", "ઇન્સ્યુલેટર", "સ્પાર્કિંગ"
        ],
        symptom: {
          en: "HV Porcelain Bushing Surface Tracking, Carbon Traces & Crack",
          gu: "એચવી પોર્સેલીન બુશિંગ સપાટી પર કાર્બન ટ્રેકિંગ અને તિરાડ"
        },
        urgency: "CRITICAL",
        confidence: 0.93,
        visualClues: {
          en: "Black lightning-tree carbon burn marks on ceramic skirts, porcelain hairline fracture",
          gu: "સિરામિક સ્કર્ટ્સ પર વીજળી જેવી કાળી બળેલી રેખાઓ, પોર્સેલીનમાં તિરાડ"
        },
        affectedComponent: "hv_bushings",
        toolNeeded: "visual_loupe",
        arPinPosition: [0.0, 1.1, 0.0],
        steps: [
          {
            stepNumber: 1,
            title: {
              en: "Clean Creepage Path & Inspect Micro-cracks",
              gu: "ક્રીપેજ પાથ સાફ કરવો અને માઇક્રો-ક્રેક તપાસવી"
            },
            instruction: {
              en: "Wipe porcelain sheds using isopropyl alcohol. Inspect for chips or hairline cracks along sheds. Any structural crack requires complete bushing replacement.",
              gu: "આઇસોપ્રોપીલ આલ્કોહોલ વડે સિરામિક બુશિંગ સાફ કરો. કોઈ તિરાડ છે કે નહીં તે બૃહદ્દર્શક કાચથી તપાસો. તિરાડ હોય તો બુશિંગ બદલવું પડશે."
            },
            componentHighlight: "hv_bushings",
            toolAction: "visual_loupe",
            targetMeasurement: "Crack Depth >2mm (REPLACE)"
          },
          {
            stepNumber: 2,
            title: {
              en: "Insulation Resistance (Megger) Test",
              gu: "ઇન્સ્યુલેશન રેઝિસ્ટન્સ (મેગર) ટેસ્ટ"
            },
            instruction: {
              en: "Apply 2.5 kV DC test voltage between HV terminal and earth tank. Insulation resistance must exceed 1000 Mega-ohms. If under 100 MΩ, replace bushing.",
              gu: "હાઇ-વોલ્ટેજ ટર્મિનલ અને અર્થ ટેન્ક વચ્ચે ૨.૫ kV DC ટેસ્ટ વોલ્ટેજ આપો. ઇન્સ્યુલેશન રેઝિસ્ટન્સ ૧૦૦૦ મેગા-ઓહ્મથી વધુ હોવું જોઈએ."
            },
            componentHighlight: "hv_bushings",
            toolAction: "multimeter",
            targetMeasurement: "1420 MΩ (PASS)"
          }
        ]
      }
    ]
  },
  {
    id: "HVAC-CHILL-800T",
    code: "HVAC-800T",
    title: {
      en: "Industrial Water-Cooled Centrifugal Chiller & Refrigeration Unit",
      gu: "ઔદ્યોગિક વોટર-કૂલ્ડ સેન્ટ્રીફ્યુગલ ચિલર અને રેફ્રિજરેશન યુનિટ"
    },
    category: {
      en: "Underground Tunnel Ventilation & HVAC",
      gu: "અંડરગ્રાઉન્ડ ટનલ વેન્ટિલેશન અને HVAC"
    },
    specs: {
      en: "800 TR Capacity, R134a Eco Refrigerant, Semi-Hermetic Twin Screw Compressor",
      gu: "૮૦૦ TR ક્ષમતા, R134a રેફ્રિજરેન્ટ, સેમી-હર્મેટિક ટ્વિન સ્ક્રૂ કમ્પ્રેસર"
    },
    defaultModel: "chiller",
    faults: [
      {
        id: "chiller-fault-high-head-pressure",
        keywords: [
          "pressure", "high", "head", "condenser", "trip", "cooling", "scale", "temp",
          "દબાણ", "હાઇ પ્રેશર", "કન્ડેન્સર", "કૂલિંગ ટાવર", "કાંપ", "ગરમી", "ટ્રીપ"
        ],
        symptom: {
          en: "Compressor Discharge High Head Pressure Trip (>16.5 Bar / 240 PSI)",
          gu: "કમ્પ્રેસર ડિસ્ચાર્જ હાઇ હેડ પ્રેશર ટ્રીપ (>૧૬.૫ બાર / ૨૪૦ PSI)"
        },
        urgency: "HIGH",
        confidence: 0.94,
        visualClues: {
          en: "Condenser water supply temperature elevated (>38°C), high amp draw on compressor motor",
          gu: "કન્ડેન્સર પાણીનું તાપમાન ૩૮°C થી વધુ હોવું, કમ્પ્રેસર મોટર વધુ એમ્પિયર લેતી હોવી"
        },
        affectedComponent: "condenser",
        toolNeeded: "thermal_scanner",
        arPinPosition: [0.4, 0.4, -0.3],
        steps: [
          {
            stepNumber: 1,
            title: {
              en: "Cooling Water Flow & Delta-T Measurement",
              gu: "કૂલિંગ વોટર ફ્લો અને ડેલ્ટા-T માપન"
            },
            instruction: {
              en: "Measure condenser water inlet and outlet temperatures. Normal delta-T is 5.0°C. If delta-T is <2.5°C, water flow is restricted by scaled condenser copper tubes.",
              gu: "કન્ડેન્સર પાણીનું ઇનલેટ અને આઉટલેટ તાપમાન માપો. સામાન્ય ડેલ્ટા-T ૫.૦°C હોય છે. જો ૨.૫°C થી ઓછું હોય, તો ટ્યુબમાં સ્કેલિંગ/કાંપ જમા થયો છે."
            },
            componentHighlight: "condenser",
            toolAction: "thermal_scanner",
            targetMeasurement: "Inlet: 36°C / Outlet: 38°C (ΔT=2°C FAIL)"
          },
          {
            stepNumber: 2,
            title: {
              en: "Clean Condenser Water Strainer & Tube Descaling",
              gu: "કન્ડેન્સર વોટર સ્ટ્રેનર સફાઈ અને ટ્યુબ ડિસ્કેલિંગ"
            },
            instruction: {
              en: "Isolate cooling tower loop. Remove condenser end-bell covers. Use nylon tube brush or chemical sulfamic acid flush to descale copper heat exchange tubes.",
              gu: "કૂલિંગ ટાવર લૂપ બંધ કરો. કન્ડેન્સરના કવર ખોલો. નાયલોન બ્રશ અથવા કેમિકલ ફ્લશ વડે તાંબાની ટ્યુબ્સમાંથી કાંપ દૂર કરો."
            },
            componentHighlight: "condenser",
            toolAction: "visual_loupe",
            targetMeasurement: "Tubes Clean & Clear"
          }
        ]
      },
      {
        id: "chiller-fault-gas-leak",
        keywords: [
          "gas", "refrigerant", "leak", "r134a", "low", "suction", "freeze", "frost",
          "ગેસ", "રેફ્રિજરેન્ટ", "લીક", "બરફ", "ફ્રોસ્ટ", "ઓછું દબાણ", "વાલ્વ"
        ],
        symptom: {
          en: "Low Evaporator Suction Pressure & Frosting on Expansion Valve",
          gu: "લો ઇવેપોરેટર સક્શન પ્રેશર અને એક્સપાન્સન વાલ્વ પર બરફ જામવો"
        },
        urgency: "HIGH",
        confidence: 0.92,
        visualClues: {
          en: "Bubbles in liquid line sight glass, white frost coat on thermostatic expansion valve",
          gu: "લિક્વિડ લાઇન સાઇટ ગ્લાસમાં પરપોટા દેખાવા, વાલ્વ પર સફેદ બરફનું પડ જામવું"
        },
        affectedComponent: "expansion_valve",
        toolNeeded: "thermal_scanner",
        arPinPosition: [-0.4, 0.35, 0.2],
        steps: [
          {
            stepNumber: 1,
            title: {
              en: "Sight Glass Bubble Inspection & Subcooling Check",
              gu: "સાઇટ ગ્લાસ બબલ તપાસ અને સબકૂલિંગ ચેક"
            },
            instruction: {
              en: "Examine sight glass during steady compressor operation. Continuous bubbling indicates refrigerant loss or dry liquid line.",
              gu: "કમ્પ્રેસર ચાલુ હોય ત્યારે સાઇટ ગ્લાસ જુઓ. સતત પરપોટા દેખાય તો રેફ્રિજરેન્ટ ગેસ લીક થયો છે."
            },
            componentHighlight: "sight_glass",
            toolAction: "visual_loupe",
            targetMeasurement: "Continuous Vapor Bubbles"
          },
          {
            stepNumber: 2,
            title: {
              en: "Electronic Sniffer Leak Detection & Flare Nut Tightening",
              gu: "ઇલેક્ટ્રોનિક સ્નિફર વડે લીક શોધવું અને નટ્સ ટાઇટ કરવા"
            },
            instruction: {
              en: "Probe all Schrader service ports, flare fittings, and compressor shaft seal with halogen leak sniffer. Re-torque flare nut to 35 Nm with copper sealing washer.",
              gu: "હેલોજન સ્નિફર વડે તમામ સર્વિસ પોર્ટ અને નટ્સ તપાસો જ્યાંથી ગેસ નીકળે છે. ફ્લેર નટને ૩૫ Nm પર ટાઇટ કરો."
            },
            componentHighlight: "expansion_valve",
            toolAction: "torque_wrench",
            targetMeasurement: "35 Nm (Zero Leak)"
          }
        ]
      }
    ]
  }
];
