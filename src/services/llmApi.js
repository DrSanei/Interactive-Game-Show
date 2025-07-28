// llmApi.js
// Example for calling DeepSeek or Grok LLM
// Replace endpoint/key with your LLM provider info

export async function getLLMSummary(comments) {
  // Example POST to your Grok/DeepSeek LLM API
  const response = await fetch('YOUR_LLM_API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer YOUR_API_KEY', // if needed
    },
    body: JSON.stringify({
      prompt: `Summarize these comments about who is mafia: ${comments.join("\n")}`,
      // add any other API-specific params
    }),
  });
  const result = await response.json();
  return result.summary || result.choices?.[0]?.text || "";
}
