const https = require('https');

// Location-based pricing database
// Prices in local currency (CAD for Canada, USD for USA)
const PRICING_DATA = {
  canada: {
    Alberta: {
      currency: 'CAD', laborMin: 50, laborMax: 75, minimumJob: 175,
      landscaping: { lawn_mowing_per_sqft: 0.04, hedge_trimming_per_hour: 50, debris_removal: 85, planting_per_plant: 25 },
      painting: { interior_per_sqft: 2.50, exterior_per_sqft: 3.00, primer_per_sqft: 0.80 },
      roofing: { shingles_per_sqft: 4.50, flat_roof_per_sqft: 6.00, tear_off_per_sqft: 1.50 },
      plumbing: { hourly: 110, service_call: 150, drain_cleaning: 200 },
      electrical: { hourly: 120, panel_upgrade: 2500, outlet_install: 175 },
      hvac: { furnace_install: 3500, ac_install: 3000, service_call: 175 },
      cleaning: { per_sqft: 0.18, deep_clean_per_hour: 45, move_out: 350 },
      handyman: { hourly: 70, minimum: 175 },
      fencing: { wood_per_ft: 28, vinyl_per_ft: 35, chain_link_per_ft: 20 },
      flooring: { hardwood_per_sqft: 8, laminate_per_sqft: 5, tile_per_sqft: 7 }
    },
    Ontario: {
      currency: 'CAD', laborMin: 55, laborMax: 85, minimumJob: 200,
      landscaping: { lawn_mowing_per_sqft: 0.05, hedge_trimming_per_hour: 55, debris_removal: 95, planting_per_plant: 30 },
      painting: { interior_per_sqft: 3.00, exterior_per_sqft: 3.50, primer_per_sqft: 0.90 },
      roofing: { shingles_per_sqft: 5.00, flat_roof_per_sqft: 7.00, tear_off_per_sqft: 2.00 },
      plumbing: { hourly: 130, service_call: 175, drain_cleaning: 250 },
      electrical: { hourly: 140, panel_upgrade: 3000, outlet_install: 200 },
      hvac: { furnace_install: 4000, ac_install: 3500, service_call: 200 },
      cleaning: { per_sqft: 0.22, deep_clean_per_hour: 50, move_out: 400 },
      handyman: { hourly: 80, minimum: 200 },
      fencing: { wood_per_ft: 32, vinyl_per_ft: 42, chain_link_per_ft: 24 },
      flooring: { hardwood_per_sqft: 10, laminate_per_sqft: 6, tile_per_sqft: 9 }
    },
    'British Columbia': {
      currency: 'CAD', laborMin: 55, laborMax: 90, minimumJob: 200,
      landscaping: { lawn_mowing_per_sqft: 0.05, hedge_trimming_per_hour: 55, debris_removal: 100, planting_per_plant: 35 },
      painting: { interior_per_sqft: 3.00, exterior_per_sqft: 3.75, primer_per_sqft: 1.00 },
      roofing: { shingles_per_sqft: 5.50, flat_roof_per_sqft: 7.50, tear_off_per_sqft: 2.00 },
      plumbing: { hourly: 135, service_call: 175, drain_cleaning: 250 },
      electrical: { hourly: 145, panel_upgrade: 3200, outlet_install: 210 },
      hvac: { furnace_install: 4200, ac_install: 3800, service_call: 200 },
      cleaning: { per_sqft: 0.23, deep_clean_per_hour: 52, move_out: 420 },
      handyman: { hourly: 82, minimum: 200 },
      fencing: { wood_per_ft: 35, vinyl_per_ft: 45, chain_link_per_ft: 26 },
      flooring: { hardwood_per_sqft: 11, laminate_per_sqft: 7, tile_per_sqft: 10 }
    },
    Quebec: {
      currency: 'CAD', laborMin: 45, laborMax: 70, minimumJob: 175,
      landscaping: { lawn_mowing_per_sqft: 0.04, hedge_trimming_per_hour: 45, debris_removal: 80, planting_per_plant: 25 },
      painting: { interior_per_sqft: 2.50, exterior_per_sqft: 3.00, primer_per_sqft: 0.80 },
      roofing: { shingles_per_sqft: 4.50, flat_roof_per_sqft: 6.00, tear_off_per_sqft: 1.75 },
      plumbing: { hourly: 110, service_call: 150, drain_cleaning: 200 },
      electrical: { hourly: 115, panel_upgrade: 2500, outlet_install: 175 },
      hvac: { furnace_install: 3500, ac_install: 3000, service_call: 175 },
      cleaning: { per_sqft: 0.17, deep_clean_per_hour: 42, move_out: 325 },
      handyman: { hourly: 65, minimum: 175 },
      fencing: { wood_per_ft: 26, vinyl_per_ft: 34, chain_link_per_ft: 19 },
      flooring: { hardwood_per_sqft: 8, laminate_per_sqft: 5, tile_per_sqft: 7 }
    },
    Manitoba: {
      currency: 'CAD', laborMin: 45, laborMax: 68, minimumJob: 150,
      landscaping: { lawn_mowing_per_sqft: 0.04, hedge_trimming_per_hour: 45, debris_removal: 75, planting_per_plant: 22 },
      painting: { interior_per_sqft: 2.25, exterior_per_sqft: 2.75, primer_per_sqft: 0.75 },
      roofing: { shingles_per_sqft: 4.25, flat_roof_per_sqft: 5.75, tear_off_per_sqft: 1.50 },
      plumbing: { hourly: 105, service_call: 140, drain_cleaning: 185 },
      electrical: { hourly: 110, panel_upgrade: 2400, outlet_install: 165 },
      hvac: { furnace_install: 3200, ac_install: 2800, service_call: 165 },
      cleaning: { per_sqft: 0.16, deep_clean_per_hour: 40, move_out: 300 },
      handyman: { hourly: 62, minimum: 150 },
      fencing: { wood_per_ft: 25, vinyl_per_ft: 32, chain_link_per_ft: 18 },
      flooring: { hardwood_per_sqft: 7, laminate_per_sqft: 4.5, tile_per_sqft: 6.5 }
    },
    Saskatchewan: {
      currency: 'CAD', laborMin: 45, laborMax: 68, minimumJob: 150,
      landscaping: { lawn_mowing_per_sqft: 0.04, hedge_trimming_per_hour: 44, debris_removal: 75, planting_per_plant: 22 },
      painting: { interior_per_sqft: 2.25, exterior_per_sqft: 2.75, primer_per_sqft: 0.75 },
      roofing: { shingles_per_sqft: 4.25, flat_roof_per_sqft: 5.75, tear_off_per_sqft: 1.50 },
      plumbing: { hourly: 105, service_call: 140, drain_cleaning: 185 },
      electrical: { hourly: 108, panel_upgrade: 2350, outlet_install: 160 },
      hvac: { furnace_install: 3200, ac_install: 2800, service_call: 165 },
      cleaning: { per_sqft: 0.16, deep_clean_per_hour: 40, move_out: 295 },
      handyman: { hourly: 60, minimum: 150 },
      fencing: { wood_per_ft: 25, vinyl_per_ft: 32, chain_link_per_ft: 18 },
      flooring: { hardwood_per_sqft: 7, laminate_per_sqft: 4.5, tile_per_sqft: 6.5 }
    },
    'Nova Scotia': {
      currency: 'CAD', laborMin: 42, laborMax: 65, minimumJob: 150,
      landscaping: { lawn_mowing_per_sqft: 0.04, hedge_trimming_per_hour: 42, debris_removal: 70, planting_per_plant: 20 },
      painting: { interior_per_sqft: 2.25, exterior_per_sqft: 2.75, primer_per_sqft: 0.75 },
      roofing: { shingles_per_sqft: 4.25, flat_roof_per_sqft: 5.75, tear_off_per_sqft: 1.50 },
      plumbing: { hourly: 100, service_call: 135, drain_cleaning: 180 },
      electrical: { hourly: 105, panel_upgrade: 2300, outlet_install: 158 },
      hvac: { furnace_install: 3100, ac_install: 2700, service_call: 160 },
      cleaning: { per_sqft: 0.15, deep_clean_per_hour: 38, move_out: 285 },
      handyman: { hourly: 58, minimum: 150 },
      fencing: { wood_per_ft: 24, vinyl_per_ft: 30, chain_link_per_ft: 17 },
      flooring: { hardwood_per_sqft: 7, laminate_per_sqft: 4, tile_per_sqft: 6 }
    }
  },
  us: {
    California: {
      currency: 'USD', laborMin: 65, laborMax: 95, minimumJob: 250,
      landscaping: { lawn_mowing_per_sqft: 0.05, hedge_trimming_per_hour: 60, debris_removal: 100, planting_per_plant: 35 },
      painting: { interior_per_sqft: 3.50, exterior_per_sqft: 4.00, primer_per_sqft: 1.00 },
      roofing: { shingles_per_sqft: 5.50, flat_roof_per_sqft: 7.50, tear_off_per_sqft: 2.00 },
      plumbing: { hourly: 150, service_call: 200, drain_cleaning: 280 },
      electrical: { hourly: 160, panel_upgrade: 3500, outlet_install: 250 },
      hvac: { furnace_install: 4500, ac_install: 4000, service_call: 225 },
      cleaning: { per_sqft: 0.25, deep_clean_per_hour: 55, move_out: 450 },
      handyman: { hourly: 90, minimum: 250 },
      fencing: { wood_per_ft: 35, vinyl_per_ft: 45, chain_link_per_ft: 25 },
      flooring: { hardwood_per_sqft: 12, laminate_per_sqft: 7, tile_per_sqft: 11 }
    },
    Texas: {
      currency: 'USD', laborMin: 45, laborMax: 70, minimumJob: 150,
      landscaping: { lawn_mowing_per_sqft: 0.035, hedge_trimming_per_hour: 45, debris_removal: 70, planting_per_plant: 22 },
      painting: { interior_per_sqft: 2.25, exterior_per_sqft: 2.75, primer_per_sqft: 0.75 },
      roofing: { shingles_per_sqft: 4.00, flat_roof_per_sqft: 5.50, tear_off_per_sqft: 1.50 },
      plumbing: { hourly: 110, service_call: 150, drain_cleaning: 200 },
      electrical: { hourly: 115, panel_upgrade: 2500, outlet_install: 175 },
      hvac: { furnace_install: 3200, ac_install: 2800, service_call: 175 },
      cleaning: { per_sqft: 0.17, deep_clean_per_hour: 40, move_out: 300 },
      handyman: { hourly: 65, minimum: 150 },
      fencing: { wood_per_ft: 25, vinyl_per_ft: 32, chain_link_per_ft: 18 },
      flooring: { hardwood_per_sqft: 8, laminate_per_sqft: 5, tile_per_sqft: 7 }
    },
    Florida: {
      currency: 'USD', laborMin: 45, laborMax: 70, minimumJob: 150,
      landscaping: { lawn_mowing_per_sqft: 0.04, hedge_trimming_per_hour: 48, debris_removal: 75, planting_per_plant: 24 },
      painting: { interior_per_sqft: 2.50, exterior_per_sqft: 3.00, primer_per_sqft: 0.80 },
      roofing: { shingles_per_sqft: 4.50, flat_roof_per_sqft: 6.00, tear_off_per_sqft: 1.75 },
      plumbing: { hourly: 115, service_call: 155, drain_cleaning: 210 },
      electrical: { hourly: 120, panel_upgrade: 2600, outlet_install: 180 },
      hvac: { furnace_install: 3000, ac_install: 3200, service_call: 180 },
      cleaning: { per_sqft: 0.18, deep_clean_per_hour: 42, move_out: 325 },
      handyman: { hourly: 68, minimum: 150 },
      fencing: { wood_per_ft: 26, vinyl_per_ft: 33, chain_link_per_ft: 19 },
      flooring: { hardwood_per_sqft: 8, laminate_per_sqft: 5, tile_per_sqft: 7.5 }
    },
    'New York': {
      currency: 'USD', laborMin: 60, laborMax: 95, minimumJob: 250,
      landscaping: { lawn_mowing_per_sqft: 0.05, hedge_trimming_per_hour: 60, debris_removal: 100, planting_per_plant: 35 },
      painting: { interior_per_sqft: 3.50, exterior_per_sqft: 4.00, primer_per_sqft: 1.00 },
      roofing: { shingles_per_sqft: 5.50, flat_roof_per_sqft: 7.50, tear_off_per_sqft: 2.25 },
      plumbing: { hourly: 155, service_call: 200, drain_cleaning: 285 },
      electrical: { hourly: 165, panel_upgrade: 3800, outlet_install: 260 },
      hvac: { furnace_install: 4800, ac_install: 4200, service_call: 235 },
      cleaning: { per_sqft: 0.26, deep_clean_per_hour: 58, move_out: 475 },
      handyman: { hourly: 92, minimum: 250 },
      fencing: { wood_per_ft: 36, vinyl_per_ft: 46, chain_link_per_ft: 26 },
      flooring: { hardwood_per_sqft: 13, laminate_per_sqft: 8, tile_per_sqft: 12 }
    },
    Illinois: {
      currency: 'USD', laborMin: 50, laborMax: 78, minimumJob: 175,
      landscaping: { lawn_mowing_per_sqft: 0.04, hedge_trimming_per_hour: 52, debris_removal: 85, planting_per_plant: 28 },
      painting: { interior_per_sqft: 2.75, exterior_per_sqft: 3.25, primer_per_sqft: 0.85 },
      roofing: { shingles_per_sqft: 4.75, flat_roof_per_sqft: 6.50, tear_off_per_sqft: 1.75 },
      plumbing: { hourly: 125, service_call: 165, drain_cleaning: 230 },
      electrical: { hourly: 135, panel_upgrade: 2900, outlet_install: 210 },
      hvac: { furnace_install: 3700, ac_install: 3300, service_call: 185 },
      cleaning: { per_sqft: 0.20, deep_clean_per_hour: 48, move_out: 365 },
      handyman: { hourly: 75, minimum: 175 },
      fencing: { wood_per_ft: 28, vinyl_per_ft: 36, chain_link_per_ft: 21 },
      flooring: { hardwood_per_sqft: 9, laminate_per_sqft: 5.5, tile_per_sqft: 8 }
    },
    Washington: {
      currency: 'USD', laborMin: 55, laborMax: 85, minimumJob: 200,
      landscaping: { lawn_mowing_per_sqft: 0.05, hedge_trimming_per_hour: 55, debris_removal: 95, planting_per_plant: 32 },
      painting: { interior_per_sqft: 3.00, exterior_per_sqft: 3.75, primer_per_sqft: 0.95 },
      roofing: { shingles_per_sqft: 5.25, flat_roof_per_sqft: 7.00, tear_off_per_sqft: 2.00 },
      plumbing: { hourly: 140, service_call: 185, drain_cleaning: 260 },
      electrical: { hourly: 148, panel_upgrade: 3200, outlet_install: 225 },
      hvac: { furnace_install: 4100, ac_install: 3600, service_call: 210 },
      cleaning: { per_sqft: 0.22, deep_clean_per_hour: 52, move_out: 400 },
      handyman: { hourly: 82, minimum: 200 },
      fencing: { wood_per_ft: 32, vinyl_per_ft: 42, chain_link_per_ft: 23 },
      flooring: { hardwood_per_sqft: 11, laminate_per_sqft: 6.5, tile_per_sqft: 10 }
    },
    // Default US rates for states not specifically listed
    default: {
      currency: 'USD', laborMin: 45, laborMax: 70, minimumJob: 150,
      landscaping: { lawn_mowing_per_sqft: 0.04, hedge_trimming_per_hour: 48, debris_removal: 75, planting_per_plant: 25 },
      painting: { interior_per_sqft: 2.50, exterior_per_sqft: 3.00, primer_per_sqft: 0.80 },
      roofing: { shingles_per_sqft: 4.50, flat_roof_per_sqft: 6.00, tear_off_per_sqft: 1.75 },
      plumbing: { hourly: 115, service_call: 155, drain_cleaning: 215 },
      electrical: { hourly: 120, panel_upgrade: 2700, outlet_install: 185 },
      hvac: { furnace_install: 3300, ac_install: 3000, service_call: 180 },
      cleaning: { per_sqft: 0.18, deep_clean_per_hour: 43, move_out: 330 },
      handyman: { hourly: 68, minimum: 150 },
      fencing: { wood_per_ft: 27, vinyl_per_ft: 35, chain_link_per_ft: 20 },
      flooring: { hardwood_per_sqft: 9, laminate_per_sqft: 5.5, tile_per_sqft: 8 }
    }
  }
};

// Default Canada rates for provinces not specifically listed
PRICING_DATA.canada.default = {
  currency: 'CAD', laborMin: 45, laborMax: 70, minimumJob: 150,
  landscaping: { lawn_mowing_per_sqft: 0.04, hedge_trimming_per_hour: 47, debris_removal: 80, planting_per_plant: 23 },
  painting: { interior_per_sqft: 2.50, exterior_per_sqft: 3.00, primer_per_sqft: 0.80 },
  roofing: { shingles_per_sqft: 4.50, flat_roof_per_sqft: 6.00, tear_off_per_sqft: 1.75 },
  plumbing: { hourly: 110, service_call: 145, drain_cleaning: 200 },
  electrical: { hourly: 115, panel_upgrade: 2500, outlet_install: 175 },
  hvac: { furnace_install: 3300, ac_install: 2900, service_call: 175 },
  cleaning: { per_sqft: 0.17, deep_clean_per_hour: 43, move_out: 320 },
  handyman: { hourly: 65, minimum: 150 },
  fencing: { wood_per_ft: 27, vinyl_per_ft: 34, chain_link_per_ft: 19 },
  flooring: { hardwood_per_sqft: 8, laminate_per_sqft: 5, tile_per_sqft: 7 }
};

function getPricingForLocation(country, provinceState, trade) {
  const countryData = PRICING_DATA[country] || PRICING_DATA['us'];
  const locationData = countryData[provinceState] || countryData['default'];
  const tradeRates = locationData[trade] || {};
  const currency = locationData.currency || 'USD';

  let pricingText = `REAL MARKET RATES — ${provinceState || 'Your Area'}, ${country === 'canada' ? 'Canada' : 'USA'} (${currency})\n`;
  pricingText += `Labor rate range: ${currency} $${locationData.laborMin}–$${locationData.laborMax}/hour\n`;
  pricingText += `Minimum job: ${currency} $${locationData.minimumJob}\n`;
  pricingText += `Currency: ${currency}\n\n`;

  if (Object.keys(tradeRates).length > 0) {
    pricingText += `${trade.toUpperCase()} SPECIFIC RATES:\n`;
    Object.entries(tradeRates).forEach(([key, val]) => {
      pricingText += `- ${key.replace(/_/g, ' ')}: ${currency} $${val}\n`;
    });
  }

  return pricingText;
}

// Fetch contractor's past quotes from Firestore REST API
// This is the RAG "retrieval" step — pull real past data before generating
async function getPastQuotesContext(userId, tradeType) {
  if (!userId || !process.env.FIREBASE_PROJECT_ID) return null;

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'smart-quote-app';

    // Query Firestore REST API for this user's past quotes
    const path = `/v1/projects/${projectId}/databases/(default)/documents:runQuery`;

    const queryBody = JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'quotes' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'userId' },
            op: 'EQUAL',
            value: { stringValue: userId }
          }
        },
        orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
        limit: 8
      }
    });

    const options = {
      hostname: 'firestore.googleapis.com',
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(queryBody)
      }
    };

    // Note: For public Firestore rules this works without auth token
    // If your rules require auth, add: 'Authorization': `Bearer ${process.env.FIREBASE_TOKEN}`
    const response = await makeRequest(options, queryBody);

    if (!response || !Array.isArray(response)) return null;

    // Parse the quotes from Firestore response format
    const quotes = [];
    response.forEach(item => {
      if (!item.document || !item.document.fields) return;
      const fields = item.document.fields;
      quotes.push({
        tradeType: fields.tradeType?.stringValue || '',
        quoteText: fields.quoteText?.stringValue || '',
        clientName: fields.clientName?.stringValue || '',
        createdAt: fields.createdAt?.stringValue || ''
      });
    });

    if (quotes.length === 0) return null;

    // Extract pricing patterns from past quotes
    // Look for TOTAL, SUBTOTAL, LABOR lines to understand this contractor's pricing style
    const pricingPatterns = [];
    const laborRates = [];
    const totals = [];
    const warranties = [];
    const paymentTerms = [];
    const timelines = [];

    quotes.forEach(quote => {
      const text = quote.quoteText || '';

      // Extract total amounts
      const totalMatch = text.match(/(?:SUBTOTAL|TOTAL)[:\s]+\$?([\d,]+(?:\.\d{2})?)/i);
      if (totalMatch) totals.push(parseFloat(totalMatch[1].replace(',', '')));

      // Extract labor rates
      const laborMatch = text.match(/LABOR[:\s]+\$?([\d,]+(?:\.\d{2})?)/i);
      if (laborMatch) laborRates.push(parseFloat(laborMatch[1].replace(',', '')));

      // Extract warranty terms
      const warrantyMatch = text.match(/WARRANTY[:\s\n]+([^\n]+)/i);
      if (warrantyMatch) warranties.push(warrantyMatch[1].trim());

      // Extract payment terms
      const paymentMatch = text.match(/PAYMENT TERMS[:\s\n]+([^\n]+)/i);
      if (paymentMatch) paymentTerms.push(paymentMatch[1].trim());

      // Extract timeline
      const timelineMatch = text.match(/(?:TIMELINE|ESTIMATED TIME)[:\s\n]+([^\n]+)/i);
      if (timelineMatch) timelines.push(timelineMatch[1].trim());

      // Note the trade type
      if (quote.tradeType) pricingPatterns.push(quote.tradeType);
    });

    // Build context summary for Claude
    let context = `\nTHIS CONTRACTOR'S PAST PRICING PATTERNS (${quotes.length} past quotes analyzed):\n`;

    if (totals.length > 0) {
      const avgTotal = totals.reduce((a, b) => a + b, 0) / totals.length;
      const minTotal = Math.min(...totals);
      const maxTotal = Math.max(...totals);
      context += `- Their typical quote range: $${minTotal.toFixed(0)} – $${maxTotal.toFixed(0)}\n`;
      context += `- Their average quote total: $${avgTotal.toFixed(0)}\n`;
    }

    if (laborRates.length > 0) {
      const avgLabor = laborRates.reduce((a, b) => a + b, 0) / laborRates.length;
      context += `- Their typical labor charge: $${avgLabor.toFixed(0)}\n`;
    }

    if (warranties.length > 0) {
      // Use the most recent warranty wording
      context += `- Their standard warranty: "${warranties[0]}"\n`;
    }

    if (paymentTerms.length > 0) {
      context += `- Their preferred payment terms: "${paymentTerms[0]}"\n`;
    }

    if (timelines.length > 0) {
      context += `- Their typical timeline format: "${timelines[0]}"\n`;
    }

    context += `\nIMPORTANT: Match this contractor's established pricing style and terms in the new quote. If their past quotes show higher or lower prices than the market rates above, lean toward their actual pricing history.\n`;

    return context;

  } catch (error) {
    // Never fail the whole quote just because past quotes couldn't be fetched
    console.error('Could not fetch past quotes (non-fatal):', error.message);
    return null;
  }
}

// Helper to make HTTPS requests
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('JSON parse error: ' + body.substring(0, 200))); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const {
      companyName, tradeType, jobDescription, clientName,
      location, country, userId,
      manualLineItems, manualSubtotal, paymentTerms, timeline, warranty, notes,
      mode
    } = JSON.parse(event.body);

    const userCountry = country || 'us';
    const userLocation = location || '';

    // RAG STEP 1: Get real pricing data for this location
    const pricingContext = getPricingForLocation(userCountry, userLocation, tradeType || 'handyman');

    // RAG STEP 2: Get this contractor's past quotes to learn their pricing style
    // Fails silently — never blocks quote generation
    const pastQuotesContext = await getPastQuotesContext(userId, tradeType);

    let prompt = '';

    if (mode === 'format-only') {
      // MANUAL QUOTE MODE: Contractor provided their own items, just format it professionally
      prompt = `You are a professional document formatter for contractors.

The contractor has provided their own line items and prices. Your job is to format these into a clean, professional quote document.

DO NOT change any prices or descriptions — use exactly what the contractor provided.
DO NOT add extra items or change the total.
DO format it cleanly and professionally.

CONTRACTOR'S INFORMATION:
Company: ${companyName}
Client: ${clientName}
Trade: ${tradeType}
Project: ${jobDescription}

CONTRACTOR'S LINE ITEMS (use these exactly):
${manualLineItems}

SUBTOTAL: $${manualSubtotal ? manualSubtotal.toFixed(2) : '0.00'}

PAYMENT TERMS: ${paymentTerms || '50% deposit required, balance due on completion'}
TIMELINE: ${timeline || 'To be confirmed'}
WARRANTY: ${warranty || 'Workmanship guaranteed'}
${notes ? 'ADDITIONAL NOTES: ' + notes : ''}

Format this into a professional quote with these sections:
PROJECT DESCRIPTION:
[1-2 sentences describing the project based on the information above]

LINE ITEMS:
[List each item exactly as provided with exact prices]

SUBTOTAL: $[exact subtotal from above]

PAYMENT TERMS:
[Use the payment terms provided]

ESTIMATED TIMELINE:
[Use the timeline provided]

WARRANTY:
[Use the warranty provided]
${notes ? '\nNOTES:\n[Include the additional notes]' : ''}

Return ONLY the formatted quote content. Do not change any prices or add commentary.`;

    } else {
      // AI QUOTE MODE: AI generates the full quote using location pricing + past quote learning
      prompt = `You are a professional ${tradeType} contractor quote generator with expertise in ${userLocation ? userLocation + ',' : ''} ${userCountry === 'canada' ? 'Canada' : 'USA'} market rates.

${pricingContext}
${pastQuotesContext || ''}
IMPORTANT PRICING RULES:
- Use the real market rates above as your baseline for all pricing
- All prices must be in ${userCountry === 'canada' ? 'Canadian Dollars (CAD)' : 'US Dollars (USD)'}
- Make pricing competitive but realistic for ${userLocation || 'this area'}
- Factor in local labor costs shown above
${pastQuotesContext ? '- PRIORITIZE this contractor\'s own past pricing patterns over the generic market rates when they differ' : ''}

Create a detailed, professional quote for the following job:
Job Description: ${jobDescription}

Generate ONLY the quote content with these sections:

PROJECT DESCRIPTION:
[2-3 sentences explaining the work to be performed]

LINE ITEMS:
1. [Item description] ........................ $[price based on real local rates]
2. [Item description] ........................ $[price]
[continue for all relevant items]

LABOR: $[amount based on local hourly rates above]

MATERIALS: $[amount if applicable]

SUBTOTAL: $[sum before tax]

PAYMENT TERMS:
50% deposit required to begin work
Balance due upon completion

ESTIMATED TIMELINE:
[Realistic estimate for this type of work in this region]

WARRANTY:
[Standard warranty for this trade]

DO NOT include company name, client name, date, or contact information.
Return ONLY the formatted quote content.`;
    }

    const requestData = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const apiResponse = await makeRequest(options, requestData);

    if (apiResponse.error) {
      throw new Error(`Anthropic API Error: ${apiResponse.error.message}`);
    }

    if (apiResponse.content && apiResponse.content[0]) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ quote: apiResponse.content[0].text })
      };
    } else {
      throw new Error('Invalid response from AI');
    }

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate quote', details: error.message })
    };
  }
};
