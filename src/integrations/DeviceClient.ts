
import axios from "axios";
import { config } from "../config";

export interface Device {
    sku: string;
    name: string;
    description: string;
    image: string;
    price: number; // Assuming price is managed here or in Purchase DB? 
    // The architecture diagram implies DeviceService gives device info. 
    // But Price is in Order/Basket table. 
    // Let's assume we fetch device existence and basic info, 
    // and maybe the price comes from the client or another source 
    // BUT for "Place Order", we usually want the current price. 
    // The schema has price in Order table. 
    // Let's assume DeviceService provides it or we pass it. 
    // Reviewing the prompt: "API GET device details". 
    // I'll assume DeviceService provides it.
}

export class DeviceClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = config.deviceServiceUrl;
    }

    async getDevice(sku: string): Promise<Device | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/devices/${sku}`);
            return response.data as Device;
        } catch (error) {
            console.error(`Error fetching device ${sku}:`, error);
            return null;
        }
    }
}

export const deviceClient = new DeviceClient();
