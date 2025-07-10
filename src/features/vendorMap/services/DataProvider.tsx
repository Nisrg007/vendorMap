import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { mockVendors } from '../data/mockData';
import { DatabaseService } from './DatabaseService';
import { Vendor } from '../../../types/vendor';


interface VendorFilters {
  isVeg: boolean | null;
  isOpen: boolean | null;
  priceRange: string | null;
  minRating: number | null;
}

interface DataContextType {
  vendors: Vendor[];
  loading: boolean;
  filters: VendorFilters;
  setFilters: React.Dispatch<React.SetStateAction<VendorFilters>>;
  refreshVendors: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<VendorFilters>({
    isVeg: null,
    isOpen: null,
    priceRange: null,
    minRating: null,
  });

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);

      // Mock fallback if DatabaseService is not connected to a real DB
      const data = await DatabaseService.getVendors?.() ?? mockVendors;

      setVendors(data);
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      if (filters.isVeg !== null && vendor.isVeg !== filters.isVeg) return false;
      if (filters.isOpen !== null && vendor.isOpen !== filters.isOpen) return false;
      if (filters.priceRange && vendor.priceRange !== filters.priceRange) return false;
      if (filters.minRating && vendor.rating < filters.minRating) return false;
      return true;
    });
  }, [vendors, filters]);

  const value: DataContextType = {
    vendors: filteredVendors,
    loading,
    filters,
    setFilters,
    refreshVendors: loadVendors,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
