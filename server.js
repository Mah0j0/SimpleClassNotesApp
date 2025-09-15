const express = require("express");
const fetch = require("node-fetch"); // versión 2
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Servir archivos estáticos desde public
app.use(express.static("public"));

const IBM_API_KEY = process.env.IBM_API_KEY;
const IBM_URL = process.env.IBM_URL;

app.post("/tts", async (req, res) => {
  console.log('--- /tts called ---');
  console.log('body:', req.body);
  try {
    const text = req.body.text;
    if (!text) {
      console.log('no text in body');
      return res.status(400).json({ error: 'No text provided' });
    }

    console.log('Calling IBM with text length:', text.length);
    const ibmResponse = await fetch(`${IBM_URL}/v1/synthesize?voice=es-LA_SofiaV3Voice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "audio/mp3",
        "Authorization": "Basic " + Buffer.from("apikey:" + IBM_API_KEY).toString("base64"),
      },
      body: JSON.stringify({ text }),
    });

    console.log('IBM status:', ibmResponse.status, ibmResponse.statusText);
    if (!ibmResponse.ok) {
      const errText = await ibmResponse.text();
      console.error('IBM error body:', errText);
      return res.status(502).json({ error: 'IBM TTS error', details: errText });
    }

    const audioBuffer = await ibmResponse.arrayBuffer();

    // Guardar archivo para verificar que realmente llegó audio
    const filename = `./audios/note_${Date.now()}.mp3`;
    fs.mkdirSync('./audios', { recursive: true });
    fs.writeFileSync(filename, Buffer.from(audioBuffer));
    console.log('Saved file:', filename);

    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('server exception:', err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
