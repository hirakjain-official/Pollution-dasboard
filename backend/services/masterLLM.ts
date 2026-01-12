import OpenAI from "openai";
import { getLiveWards } from "./inMemoryWeatherService";
import { getComplaints } from "./inMemoryWeatherService";


export class MasterLLMService {
    private openai: OpenAI;
    private isConfigured: boolean;
    private model: string;

    constructor() {
        const apiKey = process.env.OPENROUTER_API_KEY;
        this.isConfigured = !!apiKey && apiKey !== "your_openrouter_api_key_here";
        this.model = "openai/gpt-oss-120b:free"; 

        this.openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey || "dummy-key",
        });
    }

    
    async processQuery(prompt: string, domain: "mission" | "complaint" | "strategy" | "general"): Promise<any> {
        const context = this.getGlobalContext();
        const systemPrompt = this.getSystemPrompt(domain, context);

        if (!this.isConfigured) {
            console.log(`⚠️ Master LLM not configured. Using High-Fidelity Simulation for ${domain}.`);
            return this.runSimulation(domain, prompt, context);
        }

        try {
            console.log(`🧠 Master LLM Thinking... [Domain: ${domain}]`);
            const completion = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
            });

            const content = completion.choices[0].message.content;
            return JSON.parse(content || "{}");
        } catch (error) {
            console.error("❌ Master LLM Failure:", error);
            
            return this.runSimulation(domain, prompt, context);
        }
    }

    private getGlobalContext() {
        
        const wards = getLiveWards();
        const complaints = getComplaints();

        
        const avgAQI = wards.reduce((acc, w) => acc + w.pmLevel, 0) / (wards.length || 1);
        const criticalWards = wards.filter(w => w.pmLevel > 200).map(w => w.name);
        const recentComplaints = complaints.slice(0, 5).map(c => `${c.type} in ${c.ward}`);

        return {
            avgAQI: Math.round(avgAQI),
            criticalWards,
            weather: wards[0] ? { temp: wards[0].temperature, wind: wards[0].windSpeed } : { temp: 30, wind: 5 },
            activeComplaints: complaints.length,
            recentIssues: recentComplaints
        };
    }

    private getSystemPrompt(domain: string, context: any): string {
        const baseContext = `
            Current City Status:
            - Average AQI: ${context.avgAQI}
            - Critical Zones: ${context.criticalWards.join(", ")}
            - Weather: ${context.weather.temp}°C, Wind ${context.weather.wind}km/h
            - Active Complaints: ${context.activeComplaints}
        `;

        switch (domain) {
            case "mission":
                return `You are the specific Tactical Commander for Delhi Pollution Control. 
                        ${baseContext}
                        Your job is to generate specific deployment routes for anti-pollution vehicles.
                        Output JSON with fields: { strategy: string, routes: [{ id: string, path: string[], action: string }], teamInstructions: string[] }`;
            case "complaint":
                return `You are a Complaint Analyst. 
                        ${baseContext}
                        Analyze the citizen report. 
                        Output JSON with fields: { severity: "High"|"Medium"|"Low", sentiment: "Angry"|"Concerned"|"Neutral", category: string, recommendedAction: string }`;
            case "strategy":
                return `You are a Senior Policy Advisor. 
                        ${baseContext}
                        Provide high-level strategic advice.
                        Output JSON with fields: { analysis: string, shortTermGoals: string[], longTermGoals: string[], riskAssessment: string }`;
            default:
                return `You are a helpful AI assistant for city management. ${baseContext}`;
        }
    }

    private runSimulation(domain: string, prompt: string, context: any): any {
        
        switch (domain) {
            case "mission":
                return {
                    strategy: `Deploy intensive water sprinkling in ${context.criticalWards[0] || "Central"} due to AQI ${context.avgAQI}.`,
                    routes: [
                        { id: "R1", path: ["Ward A", "Ward B"], action: "Mist Spraying" },
                        { id: "R2", path: ["Ward C"], action: "Dust Vacuuming" }
                    ],
                    teamInstructions: ["Focus on main roads", "Coordinate with traffic police"]
                };
            case "complaint":
                
                const isUrgent = prompt.toLowerCase().includes("fire") || prompt.toLowerCase().includes("burning");
                return {
                    severity: isUrgent ? "High" : "Medium",
                    sentiment: "Concerned",
                    category: isUrgent ? "Fire Incident" : "General Pollution",
                    recommendedAction: isUrgent ? "Dispatch Fire Tender immediately" : "Schedule inspection"
                };
            case "strategy":
                return {
                    analysis: `[SIMULATION MODE] Pollution levels are ${context.avgAQI > 200 ? "critical" : "moderate"} (Avg AQI: ${context.avgAQI}). Immediate intervention required in ${context.criticalWards.length} zones. (Note: Set OPENROUTER_API_KEY for real AI analysis)`,
                    shortTermGoals: ["Reduce PM2.5 by 15%", "Resolve pending complaints"],
                    longTermGoals: ["Electrify public transport", "Green cover expansion"],
                    riskAssessment: "High risk of respiratory issues in vulnerable populations."
                };
            default:
                return { error: "Simulation not implemented for this domain" };
        }
    }
}


export const masterLLM = new MasterLLMService();
