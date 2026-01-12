import { Resource, ShiftPlan, Contractor, IResource, IShiftPlan, IContractor, IRoute } from "./models";

export interface IStorage {
  
  getResources(): Promise<IResource[]>;
  updateResource(id: string, updates: Partial<IResource>): Promise<IResource | null>;

  
  getShiftPlan(date: Date, type: string): Promise<IShiftPlan | null>;
  createShiftPlan(plan: Partial<IShiftPlan>): Promise<IShiftPlan>;

  
  getContractors(): Promise<IContractor[]>;

  
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
}

export class MongoStorage implements IStorage {
  async getResources(): Promise<IResource[]> {
    return await Resource.find();
  }

  async updateResource(id: string, updates: Partial<IResource>): Promise<IResource | null> {
    return await Resource.findByIdAndUpdate(id, updates, { new: true });
  }

  async getShiftPlan(date: Date, type: string): Promise<IShiftPlan | null> {
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await ShiftPlan.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
      shiftType: type
    });
  }

  async createShiftPlan(plan: Partial<IShiftPlan>): Promise<IShiftPlan> {
    const newPlan = new ShiftPlan(plan);
    return await newPlan.save();
  }

  async getContractors(): Promise<IContractor[]> {
    return await Contractor.find();
  }

  async getUser(id: string): Promise<any | undefined> {
    return undefined; 
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    
    if (username === 'gov') {
      return { id: 'gov', username: 'gov', password: 'gov' };
    }
    return undefined;
  }
}

export const storage = new MongoStorage();
