import type { Express } from "express";
import { createServer, type Server } from "http";
import mongoose from "mongoose";
import { storage } from "./storage";
import { Ward, Hotspot, ActionRecommendation, ActionHistory, CitizenComplaint } from "./models";
import { seedDatabase } from "./seed";
import { fetchWeather, fetchAQI } from "./services/weatherService";
import { generateActionPlan } from "./services/aiService";
import { updateLiveData } from "./services/liveDataService";
import { getLiveWards, updateLiveWeatherData, addComplaint, getComplaints, getShiftPlan, generateAutoShiftPlan, getHistory } from "./services/inMemoryWeatherService";
import { masterLLM } from "./services/masterLLM";


import {
  citizenComplaints,
  actionHistory,
  actionRecommendations
} from "../client/src/data/mockData";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  const isMongoConnected = () => mongoose.connection.readyState === 1;

  

  
  
  app.get("/api/wards", async (req, res) => {
    const wards = getLiveWards();
    console.log(`📤 /api/wards returning ${wards.length} wards, first PM2.5=${wards[0]?.pm25}`);
    res.json(wards);
  });

  
  app.get("/api/hotspots", async (req, res) => {
    if (!isMongoConnected()) {
      const liveWards = getLiveWards();
      const hotWards = liveWards.filter(w => w.pmLevel > 200);
      const mockHotspots = hotWards.map((w, i) => ({
        id: `hotspot-${i}`,
        name: `${w.name} Critical Zone`,
        lat: w.coordinates[0][0],
        lng: w.coordinates[0][1],
        pmLevel: w.pmLevel,
        type: ["construction", "traffic", "industrial"][i % 3],
        severity: "critical"
      }));
      return res.json(mockHotspots);
    }
    const hotspots = await Hotspot.find();
    res.json(hotspots);
  });

  
  app.get("/api/actions/recommendations", async (req, res) => {
    if (!isMongoConnected()) {
      return res.json(actionRecommendations);
    }
    const actions = await ActionRecommendation.find();
    res.json(actions);
  });

  
  app.get("/api/actions/history", async (req, res) => {
    if (!isMongoConnected()) {
      return res.json(actionHistory);
    }
    const history = await ActionHistory.find();
    res.json(history);
  });

  
  app.get("/api/complaints", async (req, res) => {
    if (!isMongoConnected()) {
      
      const live = getComplaints();
      return res.json([...live, ...citizenComplaints]);
    }
    const complaints = await CitizenComplaint.find();
    res.json(complaints);
  });

  app.post("/api/complaints", async (req, res) => {
    
    const analysis = await masterLLM.processQuery(
      `Analyze this complaint: "${req.body.description}". Location: ${req.body.ward}. Type: ${req.body.type}`,
      "complaint"
    );

    const enrichedComplaint = {
      ...req.body,
      severity: analysis.severity || "Medium",
      sentiment: analysis.sentiment || "Neutral",
      aiAnalysis: analysis
    };

    if (!isMongoConnected()) {
      const complaint = addComplaint(enrichedComplaint);
      return res.json(complaint);
    }
    const complaint = await CitizenComplaint.create(enrichedComplaint);
    res.json(complaint);
  });

  
  app.get("/api/resources", async (req, res) => {
    if (!isMongoConnected()) {
      const mockResources = [
        { id: "1", type: "sprinkler", status: "active", ward: "North", count: 12 },
        { id: "2", type: "sweeper", status: "active", ward: "South", count: 8 }
      ];
      return res.json(mockResources);
    }
    const resources = await storage.getResources();
    res.json(resources);
  });

  app.patch("/api/resources/:id", async (req, res) => {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: "MongoDB required for updates" });
    }
    const id = req.params.id;
    const updates = req.body;
    const updated = await storage.updateResource(id, updates);
    res.json(updated);
  });

  
  app.get("/api/shifts", async (req, res) => {
    if (!isMongoConnected()) {
      const type = (req.query.type as string) || "morning";
      const plan = getShiftPlan(type);
      return res.json(plan);
    }
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const type = (req.query.type as string) || "morning";
    const plan = await storage.getShiftPlan(date, type);
    res.json(plan || { message: "No plan found", routes: [] });
  });

  
  app.post("/api/shifts/auto-generate", async (req, res) => {
    const type = (req.body.type as string) || "morning";
    const plan = await generateAutoShiftPlan(type);
    res.json(plan);
  });

  app.post("/api/shifts", async (req, res) => {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: "MongoDB required for creating shifts" });
    }
    const plan = await storage.createShiftPlan(req.body);
    res.json(plan);
  });

  
  app.get("/api/contractors", async (req, res) => {
    if (!isMongoConnected()) {
      const mockContractors = [
        { id: "1", name: "ABC Contractors", assignedWards: ["north", "central"], complianceScore: 92, tasksCompleted: 45, tasksPending: 3 },
        { id: "2", name: "XYZ Services", assignedWards: ["south", "east"], complianceScore: 78, tasksCompleted: 30, tasksPending: 8 }
      ];
      return res.json(mockContractors);
    }
    const contractors = await storage.getContractors();
    res.json(contractors);
  });

  
  app.post("/api/wards/refresh", async (req, res) => {
    if (!isMongoConnected()) {
      const result = await updateLiveWeatherData();
      const mode = result.mode === "real_api" ? "Real OpenWeatherMap data" : "Simulated data";
      return res.json({
        success: true,
        message: `Updated ${result.updated} wards with ${mode}`,
        ...result
      });
    }
    try {
      const result = await updateLiveData();
      res.json({
        success: true,
        message: `Updated ${result.updated} wards${result.failed > 0 ? `, ${result.failed} failed` : ''}`,
        ...result
      });
    } catch (error) {
      console.error("Ward refresh failed:", error);
      res.status(500).json({ error: "Failed to refresh ward data" });
    }
  });

  
  app.post("/api/seed", async (req, res) => {
    if (!isMongoConnected()) {
      return res.status(503).json({
        error: "MongoDB required for seeding",
        message: "Running in in-memory mode with live weather data"
      });
    }
    try {
      const result = await seedDatabase();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Seeding failed" });
    }
  });

  

  
  app.post("/api/weather/live", async (req, res) => {
    const { lat, lng } = req.body;
    const targetLat = lat || 28.6139;
    const targetLng = lng || 77.2090;

    try {
      const [weather, aqi] = await Promise.all([
        fetchWeather(targetLat, targetLng),
        fetchAQI(targetLat, targetLng)
      ]);
      res.json({ weather, aqi });
    } catch (error) {
      console.error("External weather fetch failed:", error);
      res.status(500).json({ error: "Failed to fetch external weather data" });
    }
  });

  
  
  app.post("/api/ai/plan", async (req, res) => {
    const { mission } = req.body;
    try {
      const plan = await masterLLM.processQuery(
        `Generate a technical deployment plan for mission: "${mission || "Reduce PM2.5 in critical zones"}"`,
        "mission"
      );
      res.json(plan);
    } catch (error) {
      console.error("AI Plan generation failed:", error);
      res.status(500).json({ error: "AI generation failed" });
    }
  });

  
  app.post("/api/ai/strategy", async (req, res) => {
    try {
      const strategy = await masterLLM.processQuery(
        "Analyze current city-wide data and provide strategic recommendations.",
        "strategy"
      );
      res.json(strategy);
    } catch (error) {
      console.error("Strategy generation failed:", error);
      res.status(500).json({ error: "Strategy generation failed" });
    }
  });

  
  app.get("/api/history", (req, res) => {
    try {
      const history = getHistory();
      res.json(history);
    } catch (error: any) {
      console.error("History fetch error:", error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  });

  
  app.get("/api/debug/weather", async (req, res) => {
    try {
      const lat = 28.6139;
      const lng = 77.2090;
      const [weather, aqi] = await Promise.all([
        fetchWeather(lat, lng),
        fetchAQI(lat, lng)
      ]);

      if (!weather || !aqi) {
        return res.status(500).json({ error: "API returned null (likely auth or quota issue)" });
      }

      res.json({
        source: "Real OpenWeatherMap API",
        weather,
        aqi,
        raw_key_test: process.env.OPENWEATHER_API_KEY ? "Key Configured" : "Key Missing"
      });
    } catch (error: any) {
      res.status(500).json({
        error: "Fetch failed",
        details: error.message,
        stack: error.stack
      });
    }
  });

  return httpServer;
}
