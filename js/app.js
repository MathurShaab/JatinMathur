// api/chat.js
export default async function handler(req, res) {
    if (req.method === "POST") {
        const { message } = req.body;

        const response = await fetch("https://api.gemini.com/v1/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer AIzaSyDMHifgHgbiEp5yjjcwAqydW4eA-BJ-2T8"
            },
            body: JSON.stringify({
                prompt: message
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.reply });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
