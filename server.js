const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/search', async (req, res) => {
    try {
        const { query, fileData, mimeType } = req.body;
        if (!query && !fileData) {
            return res.status(400).json({ success: false, error: 'Query or file attachment is required.' });
        }

        let contents = [query || "Analyze this file attachment thoroughly and format the response cleanly."];
        
        if (fileData) {
            contents.push({
                inlineData: {
                    data: fileData,
                    mimeType: mimeType || 'image/jpeg'
                }
            });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents: contents,
            config: {
                systemInstruction: "You are C7 Intelligence Engine, an elite AI search and document synthesis platform. Provide precise, executive-level answers, breakdown insights clearly, and format outputs so users can easily read or convert them.",
            }
        });

        res.json({
            success: true,
            answer: response.text,
            node: 'C7-Global-Matrix-Node-01'
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
            
        
