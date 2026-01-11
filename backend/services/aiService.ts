import OpenAI from "openai";

const API_KEY = process.env.OPENROUTER_API_KEY;

// Initialize OpenAI client pointing to OpenRouter
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: API_KEY || "dummy-key", // Prevent crash if key is missing, but calls will fail
});

export async function generateActionPlan(wardName: string, aqi: number, resources: any) {
    if (!API_KEY) {
        return {
            plan: "AI Service Unavailable: OPENROUTER_API_KEY not set.",
            recommendations: []
        };
    }

    const prompt = `
    You are an expert pollution control logistics planner for Delhi.
    Generate a specific action plan for Ward: ${wardName}.
    Current AQI: ${aqi}.
    Available Resources: ${JSON.stringify(resources)}.
    
    Output a JSON object with:
    1. "strategy": A brief text summary of the strategy.
    2. "actions": An array of specific actions (e.g., "Deploy Anti-Smog Gun at X").
    3. "priority": "High", "Medium", or "Low".
    
    Keep it concise and practical.
  `;

    try {
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b:free", // Free tier model
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    } catch (error) {
        console.error("AI Generation Error:", error);
        return null;
    }
}
