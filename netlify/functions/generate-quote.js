const https = require('https');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { companyName, tradeType, jobDescription, clientName } = JSON.parse(event.body);

    const prompt = `You are a professional ${tradeType} contractor quote generator. Create a detailed, professional quote for the following job:

Job Description: ${jobDescription}

Generate a complete quote that includes:
1. Professional project description (2-3 sentences)
2. Detailed line items with individual prices (be specific and realistic)
3. Labor costs (itemized)
4. Materials (if applicable, itemized)
5. Total cost (sum of all items)
6. Payment terms: "50% deposit required, balance due upon completion"
7. Estimated timeline (be realistic for this type of work)
8. Warranty/guarantee: "1-year workmanship guarantee" or similar

Make the pricing realistic and competitive for the ${tradeType} industry. The quote is for a client named ${clientName}.

Format the quote professionally with clear sections and line breaks. Use this structure:

PROJECT DESCRIPTION:
[2-3 sentence description]

LINE ITEMS:
1. [Item description] ........................ $[price]
2. [Item description] ........................ $[price]
[etc]

TOTAL: $[sum]

PAYMENT TERMS:
50% deposit required to begin work
Balance due upon completion

TIMELINE:
[Realistic estimate]

WARRANTY:
[Warranty details]

Return ONLY the formatted quote text. No extra commentary.`;

    const requestData = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
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

    const apiResponse = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            console.log('API Response:', JSON.stringify(parsed, null, 2));
            resolve(parsed);
          } catch (e) {
            console.error('JSON Parse Error:', e);
            console.error('Raw data:', data);
            reject(e);
          }
        });
      });
      req.on('error', (err) => {
        console.error('Request error:', err);
        reject(err);
      });
      req.write(requestData);
      req.end();
    });

    console.log('Checking API response structure...');
    
    if (apiResponse.error) {
      console.error('Anthropic API Error:', apiResponse.error);
      throw new Error(`Anthropic API Error: ${apiResponse.error.message || JSON.stringify(apiResponse.error)}`);
    }

    if (apiResponse.content && apiResponse.content[0]) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          quote: apiResponse.content[0].text
        })
      };
    } else {
      console.error('Unexpected API response structure:', JSON.stringify(apiResponse, null, 2));
      throw new Error('Invalid response from AI');
    }

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate quote',
        details: error.message 
      })
    };
  }
};
