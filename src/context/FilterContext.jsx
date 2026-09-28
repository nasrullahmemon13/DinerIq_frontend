import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FilterContext = createContext(null);

export const DATE_RANGE_OPTIONS = [
  { value: 'ALL', label: 'Full Year (2025)' },
  { value: 'Q1', label: 'Q1 (Jan – Mar)' },
  { value: 'Q2', label: 'Q2 (Apr – Jun)' },
  { value: 'Q3', label: 'Q3 (Jul – Sep)' },
  { value: 'Q4', label: 'Q4 (Oct – Dec)' },
  { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
  { value: 'LAST_90_DAYS', label: 'Last 90 Days' },
];

export function FilterProvider({ children }) {
  const { token } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('ALL');
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    if (!token) {
      setLocations([]);
      setSelectedLocation('ALL');
      setSelectedDateRange('ALL');
      setLoadingLocations(false);
      return;
    }
    let isMounted = true;
    const fetchLocations = async () => {
      setLoadingLocations(true);
      try {
        const res = await fetch('/api/v1/locations', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setLocations(Array.isArray(data) ? data : []);
          }
        }
      } catch (err) {
        console.error('Failed to load locations for filter:', err);
      } finally {
        if (isMounted) setLoadingLocations(false);
      }
    };
    fetchLocations();
    return () => { isMounted = false; };
  }, [token]);

  const value = {
    selectedLocation,
    setSelectedLocation,
    selectedDateRange,
    setSelectedDateRange,
    locations,
    loadingLocations,
    dateRangeOptions: DATE_RANGE_OPTIONS
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
