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
                    "Identify food ingredients in this image. Return ONLY a comma separated list.",
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

      const ingredients =
        response.choices[0]
          .message.content;

      fs.unlinkSync(imagePath);

      res.json({
        ingredients,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error:
          "Image analysis failed",
      });

    }

  }
);

app.listen(3001, () => {

  console.log(
    "🚀 AI Server running on port 3001"
  );

});