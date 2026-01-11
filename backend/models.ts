import mongoose, { Schema, Document } from 'mongoose';

// --- Interfaces ---

export interface IResource extends Document {
    name: string;
    type: 'sprinkler' | 'smog_gun' | 'tanker';
    status: 'active' | 'maintenance' | 'idle';
    location: { lat: number; lng: number };
    ward: string;
}

export interface IRouteStep {
    text: string;
    completed: boolean;
}

export interface IRoute {
    vehicleId: string;
    path: [number, number][]; // Array of [lat, lng]
    priority: 'High' | 'Standard';
    assignedTo: string;
}

export interface IShiftPlan extends Document {
    date: Date;
    shiftType: 'morning' | 'evening' | 'night';
    routes: IRoute[];
    active: boolean;
    focus?: string;
    steps?: string[];
    impactedWards?: string[];
}

export interface IContractor extends Document {
    name: string;
    assignedWard: string;
    complianceScore: number;
    tasksCompleted: number;
    totalTasks: number;
}

// --- Schemas ---

const ResourceSchema = new Schema<IResource>({
    name: { type: String, required: true },
    type: { type: String, enum: ['sprinkler', 'smog_gun', 'tanker'], required: true },
    status: { type: String, enum: ['active', 'maintenance', 'idle'], default: 'idle' },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    ward: { type: String, required: true }
});

const RouteSchema = new Schema({
    vehicleId: { type: String, required: true },
    path: { type: [[Number]], required: true },
    priority: { type: String, enum: ['High', 'Standard'], default: 'Standard' },
    assignedTo: { type: String }
});

const ShiftPlanSchema = new Schema<IShiftPlan>({
    date: { type: Date, default: Date.now },
    shiftType: { type: String, enum: ['morning', 'evening', 'night'], required: true },
    routes: [RouteSchema],
    active: { type: Boolean, default: true },
    focus: { type: String, default: "General Patrol" },
    steps: { type: [String], default: [] },
    impactedWards: { type: [String], default: [] }
});

const ContractorSchema = new Schema<IContractor>({
    name: { type: String, required: true },
    assignedWard: { type: String, required: true },
    complianceScore: { type: Number, default: 100 },
    tasksCompleted: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 0 }
});

// --- Models ---

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
export const ShiftPlan = mongoose.model<IShiftPlan>('ShiftPlan', ShiftPlanSchema);
export const Contractor = mongoose.model<IContractor>('Contractor', ContractorSchema);

// --- Extended Models for Dashboard ---

export interface IWard extends Document {
    id: string; // Keep string ID for now to match frontend 'north', 'south' etc if possible, or use _id
    name: string;
    color: string;
    coordinates: [number, number][];
    pmLevel: number;
    pm25: number;
    humidity: number;
    temperature: number;
    windSpeed: number;
    routesCount: number;
    routesNeedingAction: number;
    lastUpdated: string;
    contractor: string; // Name or ID
    effectiveness: number;
    riskIndex: number;
    complaints: number;
}

export interface IHotspot extends Document {
    name: string;
    lat: number;
    lng: number;
    pmLevel: number;
    type: "construction" | "traffic" | "industrial" | "dust";
    severity: "low" | "medium" | "high" | "critical";
}

export interface IActionRecommendation extends Document {
    ward: string;
    action: string;
    priority: "high" | "medium" | "low";
    department: string;
    estimatedImpact: string;
    deadline: string;
    status: "pending" | "in_progress" | "completed";
}

export interface IActionHistory extends Document {
    date: string;
    time: string;
    ward: string;
    action: string;
    department: string;
    contractor: string;
    pmBefore: number;
    pmAfter: number;
    effectiveness: number;
    status: "completed" | "partial" | "failed";
}

export interface ICitizenComplaint extends Document {
    date: string;
    ward: string;
    type: string;
    description: string;
    pmCorrelation: number;
    resolved: boolean;
}

const WardSchema = new Schema<IWard>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    coordinates: { type: [[Number]], required: true },
    pmLevel: { type: Number, required: true },
    pm25: { type: Number, required: true },
    humidity: { type: Number, required: true },
    temperature: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    routesCount: { type: Number, default: 0 },
    routesNeedingAction: { type: Number, default: 0 },
    lastUpdated: { type: String, default: "Just now" },
    contractor: { type: String, default: "" },
    effectiveness: { type: Number, default: 0 },
    riskIndex: { type: Number, default: 0 },
    complaints: { type: Number, default: 0 }
});

const HotspotSchema = new Schema<IHotspot>({
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    pmLevel: { type: Number, required: true },
    type: { type: String, enum: ["construction", "traffic", "industrial", "dust"], required: true },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], required: true }
});

const ActionRecommendationSchema = new Schema<IActionRecommendation>({
    ward: { type: String, required: true },
    action: { type: String, required: true },
    priority: { type: String, enum: ["high", "medium", "low"], required: true },
    department: { type: String, required: true },
    estimatedImpact: { type: String, required: true },
    deadline: { type: String, required: true },
    status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" }
});

const ActionHistorySchema = new Schema<IActionHistory>({
    date: { type: String, required: true },
    time: { type: String, required: true },
    ward: { type: String, required: true },
    action: { type: String, required: true },
    department: { type: String, required: true },
    contractor: { type: String, required: true },
    pmBefore: { type: Number, required: true },
    pmAfter: { type: Number, required: true },
    effectiveness: { type: Number, default: 0 },
    status: { type: String, enum: ["completed", "partial", "failed"], required: true }
});

const CitizenComplaintSchema = new Schema<ICitizenComplaint>({
    date: { type: String, required: true },
    ward: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    pmCorrelation: { type: Number, default: 0 },
    resolved: { type: Boolean, default: false }
});

export const Ward = mongoose.model<IWard>('Ward', WardSchema);
export const Hotspot = mongoose.model<IHotspot>('Hotspot', HotspotSchema);
export const ActionRecommendation = mongoose.model<IActionRecommendation>('ActionRecommendation', ActionRecommendationSchema);
export const ActionHistory = mongoose.model<IActionHistory>('ActionHistory', ActionHistorySchema);
export const CitizenComplaint = mongoose.model<ICitizenComplaint>('CitizenComplaint', CitizenComplaintSchema);
