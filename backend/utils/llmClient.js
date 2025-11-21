const axios = require("axios");

module.exports = {
  ask: async (prompt) => {
    try {
      const key = process.env.LLM_API_KEY;
      const url = process.env.LLM_API_URL;
      const model = process.env.LLM_MODEL || "llama-3.1-8b-instant";

      const response = await axios.post(
        url,
        {
          model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 500,
        },
        {
          headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (err) {
      console.error("Groq LLM Error:", err.response?.data || err.message);
      throw new Error("LLM request failed");
    }
  },
};
