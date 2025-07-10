import { mockVendors } from '../data/mockData';
import { calculateDistance } from '../utils/geoUtils';
import { Vendor } from '../../../types/vendor';

export class DatabaseService {
  static async getVendors(): Promise<Vendor[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockVendors);
      }, 500);
    });
  }

  static async getVendorById(id: string): Promise<Vendor | undefined> {
    const vendors = await this.getVendors();
    return vendors.find((v) => v.id === id);
  }

  static async searchVendors(query: string): Promise<Vendor[]> {
    const vendors = await this.getVendors();
    return vendors.filter((v) =>
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  static async getVendorsByLocation(lat: number, lng: number, radius: number = 5): Promise<Vendor[]> {
    const vendors = await this.getVendors();
    return vendors.filter((v) => {
      const distance = calculateDistance(lat, lng, v.latitude, v.longitude);
      return distance <= radius;
    });
  }
}
