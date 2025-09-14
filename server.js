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
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating speech");
  }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
