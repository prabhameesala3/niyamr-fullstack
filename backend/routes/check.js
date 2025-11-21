const express = require("express");
const router = express.Router();
const llm = require("../utils/llmClient");

router.post("/", async (req, res) => {
  try {
    const { text, rules } = req.body;

    if (!text || !rules || !Array.isArray(rules)) {
      return res.status(400).json({ results: [], error: "Invalid input" });
    }

    const results = [];

    for (const rule of rules) {
      const prompt = `
You are a document analysis assistant.

RULE: "${rule}"

DOCUMENT:
${text}

Respond ONLY in JSON:
{
  "status": "pass" | "fail",
  "evidence": "one sentence",
  "reasoning": "short reasoning",
  "confidence": number
}`;

      let response;

      try {
        response = await llm.ask(prompt);
      } catch (err) {
        console.error("LLM ERROR:", err);
        results.push({
          rule,
          status: "fail",
          evidence: "LLM request failed",
          reasoning: "Could not connect to LLM",
          confidence: 0
        });
        continue;
      }

      let parsedJSON;
      try {
        // parsedJSON = JSON.parse(response);
        parsedJSON = JSON.parse(response);
        parsedJSON.rule = rule;  // <-- ADD THIS LINE

      } catch (err) {
        // parsedJSON = {
        //   rule,
        //   status: "fail",
        //   evidence: "LLM returned non-JSON output",
        //   reasoning: response.slice(0, 200),
        //   confidence: 0
        // };
          parsedJSON = {
          rule,  // <-- ADD THIS
          status: "fail",
          evidence: "LLM returned non-JSON output",
          reasoning: response.slice(0, 200),
          confidence: 0
        };

      }

      results.push(parsedJSON);
    }

    res.json({ results });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ results: [], error: "Internal Server Error" });
  }
});

module.exports = router;