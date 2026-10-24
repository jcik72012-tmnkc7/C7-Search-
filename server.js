const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '15mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/search', async (req, res) => {
    try {
        const { query, fileData, mimeType } = req.body;

        if (!query && !fileData) {
            return res.status(400).json({ error: 'Query or attachment required.' });
        }

        const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            systemInstruction: "You are the C7 Intelligence Engine, a world-class AI search, research, and technical assistant created by Chiranjivi Guru. Provide a comprehensive, highly detailed, well-structured explanation with bullet points, core principles, and essential real-world examples for the user's inquiry."
        });

        let parts = [];

        if (fileData) {
            parts.push({
                inlineData: {
                    data: fileData,
                    mimeType: mimeType || 'image/jpeg'
                }
            });
        }

        parts.push(query ? query : "Analyze this uploaded document/image in detail.");

        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            answer: text,
            node: 'C7 Global Distributed Cluster'
        });

    } catch (error) {
        console.error('C7 Engine Backend Error:', error);
        res.status(500).json({ error: 'Internal C7 Node synthesis failed.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`C7 Intelligence Engine Backend active on port ${PORT}`);
});
         
        
