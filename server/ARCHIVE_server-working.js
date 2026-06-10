require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const OpenAI = require("openai");

const app = express();

app.use(cors());

const upload = multer({
  dest: "uploads/",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {

  res.send(
    "Kristen's Kitchen backend running 🚀"
  );

});

app.post(

  "/analyze-image",

  upload.single("image"),

  async (req, res) => {

    try {

      const imagePath =
        req.file.path;

      const preference =
        req.body.preference;

      const chefPersonality =
        req.body.chefPersonality;

      const base64Image =
        fs.readFileSync(imagePath, {
          encoding: "base64",
        });

      const response =
        await openai.chat.completions.create({

          model: "gpt-4o-mini",

          messages: [

            {
              role: "user",

              content: [

                {
                  type: "text",

                  text:
`You are a professional chef AI.

The user wants:
${preference} style recipes.

Respond with the personality and cooking style of:
${chefPersonality}

Identify all ingredients visible in this food image.

Return ONLY valid JSON.

Use this exact structure:

{
  "title": "",
  "description": "",
  "time": "",
  "difficulty": "",
  "ingredients": [],
  "instructions": [],
  "missingIngredients": [],
  "optionalUpgrades": []
}

Do not include markdown.
Do not include explanation text.
Only return valid JSON.`,
                },

                {
                  type: "image_url",

                  image_url: {
                    url:
`data:image/jpeg;base64,${base64Image}`,
                  },

                },

              ],

            },

          ],

        });

      const recipe =
        response.choices[0]
          .message.content;

      fs.unlinkSync(imagePath);

      res.json({
        recipe,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message,
      });

    }

  }

);

app.listen(3001, () => {

  console.log(
    "🚀 AI Server running on port 3001"
  );

});