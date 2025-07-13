export interface Vendor {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  priceRange: string;
  isVeg: boolean;
  isOpen: boolean;
  tags: string[];
  description: string;
  image?: string;
  distance: number;
  popularity: number;
  isFavorite: boolean;
  isVisited: boolean;
  area: string;
  phone: string;
  menu: MenuItem[];
  reviews: Review[];
  hours: Hours;
  categories: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  isVeg: boolean;
  category: string;
}

export interface Review {
  id: string;
  rating: number;
  text: string;
  author: string;
  date: string;
}

export interface Hours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string; // "09:00"
  close: string; // "22:00"
  isClosed: boolean;
}

export interface FilterOptions {
  foodTypes: string[];
  categories: string[];
  openNow: boolean;
  searchQuery: string;
}

export interface ClusterPoint {
  id: string;
  latitude: number;
  longitude: number;
  isCluster: boolean;
  count?: number;
  vendor?: Vendor;
  clusterId?: number;
}