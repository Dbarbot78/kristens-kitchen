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

app.post(

  "/analyze-image",

  upload.single("image"),

  async (req, res) => {

    try {

      const imagePath =
        req.file.path;

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

Identify all ingredients visible in this food image.

Then create:
1. Recipe name
2. Short description
3. Ingredient list
4. Step-by-step cooking instructions
5. Estimated cooking time
6. Difficulty level

Format the response clearly and cleanly for a mobile cooking app.`,
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