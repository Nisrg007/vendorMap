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
  image: string;
  distance: number;
  popularity: number;
  isFavorite: boolean;
  isVisited: boolean;
}
