const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ success: false, error: 'Query is required.' });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: query,
            config: {
                systemInstruction: "You are C7 Intelligence Engine, an elite, highly structured, and precise AI search engine. Provide comprehensive, accurate, and executive-level answers with clear breakdowns.",
            }
        });

        res.json({
            success: true,
            answer: response.text,
            node: 'C7-Core-Matrix-Node-01'
        });

    } catch (error) {
        console.error('C7 Generation Error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Internal C7 Node synthesis failed.' 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`C7 Search Backend running on port ${PORT}`);
});
            
