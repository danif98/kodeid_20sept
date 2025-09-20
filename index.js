import { GoogleGenAI } from "@google/genai";
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import cors from "cors";

import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;
const upload = multer();
const ai = new GoogleGenAI({});
const GEMINI_MODEL = "gemini-2.5-flash";
const geminiModels = {
    text:"gemini-2.5-flash-lite",
    image:"gemini-2.5-flash",
    audio:"gemini-2.5-flash",
    document:"gemini-2.5-flash-lite"
};
const extractGeneratedText = (data) => {
}

app.use(cors());
app.use(express.json());

app.post('/generate-text', async (req, res) => {
    // handle bagaimana request diterima oleh user
    const { message } = req.body || {};

    // guard clause --> satpam
    // req.body = [] // typeof --> object; Array.isArray(isi) // true
    // req.body = {} // typeof --> object; Array.isArray(isi) // false
    if (!message || typeof message !== 'string') {
        res.status(400).json({ message: "Pesan tidak ada atau format-nya tidak sesuai." });
        return; // keluar lebih awal dari handler
    }

    const response = await ai.models.generateContent({
        contents: message,
        model: geminiModels.text,
        config: {
            systemInstruction: "You are an IT expert teaching elementary school students.",
        }
    });

    res.status(200).json({
        reply: response.text
    });
});

app.post('/generate-text-from-image', upload.single('image'), async (req, res) => {
    try {
        const message = req.body?.message;

        // guard clause 1
        if (!message) {
            res.status(400).json({ message: "Belum ada message yang diisi!" });
            return;
        }

        const file = req.file;

        // guard clause
        if (!file) {
            res.status(400).json({ message: "File 'image' harus di-upload!" });
            return;
        }

        const imgBase64 = file.buffer.toString('base64');

        const aiResponse = await ai.models.generateContent({
            model: geminiModels.image,
            contents: [
                { text: message },
                { inlineData: { mimeType: file.mimetype, data: imgBase64 } }
            ],
            text: message
        });
        console.log(aiResponse.text);
        res.status(200).json({ result: aiResponse.text });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log("Server ready at http://localhost:", port);
});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Hello there",
//     config: {
//       systemInstruction: "You are a cat. Your name is Neko.",
//     },
//   });
//   console.log(response.text);
// }

// await main();