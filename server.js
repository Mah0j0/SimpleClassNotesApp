import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const IBM_API_KEY = process.env.IBM_API_KEY;
const IBM_URL = process.env.IBM_URL;

app.post("/tts", async (req, res) => {
  try {
    const text = req.body.text;
    const voice = "es-LA_SofiaV3Voice";

    const response = await fetch(`${IBM_URL}/v1/synthesize?voice=${voice}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "audio/mp3",
        "Authorization":
          "Basic " + Buffer.from("apikey:" + IBM_API_KEY).toString("base64"),
      },
      body: JSON.stringify({ text }),
    });

    const audioBuffer = await response.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    fs.writeFileSync(`./audios/note_${Date.now()}.mp3`, Buffer.from(audioBuffer));
    //./ significa que 
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating speech");
  }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
