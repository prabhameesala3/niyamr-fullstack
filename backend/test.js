require("dotenv").config();
const axios = require("axios");

async function test() {
  try {
    const res = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: "Say hello" }],
      },
      {
        headers: {
          Authorization: "Bearer " + process.env.LLM_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res.data.choices[0].message.content);
  } catch (e) {
    console.error("TEST ERROR:", e.response?.data || e.message);
  }
}

test();
