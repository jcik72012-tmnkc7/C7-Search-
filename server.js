const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for file uploads

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/search', async (req, res) => {
    try {
        const { query, fileData, mimeType } = req.body;
        if (!query && !fileData) {
            return res.status(400).json({ success: false, error: 'Query or file is required.' });
        }

        let contents = [query || "Analyze this attached file and convert it into a structured PDF-ready layout format."];
        
        // If an image or document was uploaded, include it in the Gemini payload
        if (fileData) {
            contents.push({
                inlineData: {
                    data: fileData,
                    mimeType: mimeType || 'image/jpeg'
                }
            });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: contents,
            config: {
                systemInstruction: "You are C7 Intelligence Engine, an elite AI search and document synthesis engine. Provide comprehensive, accurate executive responses, analyze attached files thoroughly, and format output cleanly for PDF or document conversion.",
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
         
