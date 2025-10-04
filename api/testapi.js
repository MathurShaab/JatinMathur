const response = await fetch("https://generativeai.googleapis.com/v1beta2/models/text-bison-001:generate", {
  method: "POST",
  headers: {
    "Authorization": "Bearer AIzaSyDMHifgHgbiEp5yjjcwAqydW4eA-BJ-2T8",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "prompt": prompt,
    "temperature": 0.7,
    "maxOutputTokens": 300
  })
});
