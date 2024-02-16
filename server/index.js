const GITHUB_CLIENT_ID = "89699af404caf50e8e38";
const GITHUB_CLIENT_SECRET = "7c9fef2d6248747fc74c70cf50a15cb9c3bce032";
const axios = require("axios");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/code", async (req, res) => {
  try {
    const { code } = req.query;
    console.log("Code", code);

    const data = await axios.get(
      "https://github.com/login/oauth/access_token",
      {
        params: {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: code,
        },
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "application/json",
        },
      }
    );

    console.log("d", data.data);
    res.json(data.data);
  } catch (error) {
    res.json(error.message);
  }
});

app.listen(4000, (err) => {
  console.log("Err", err);
});
