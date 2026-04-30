// FILE: frontend/context/CompareContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [selectedIds, setSelectedIds] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('compareIds');
    if (stored) {
      try {
        setSelectedIds(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('compareIds');
      }
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('compareIds', JSON.stringify(selectedIds));
  }, [selectedIds]);

  const addCollege = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const removeCollege = (id) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const toggleCollege = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const clearSelected = () => setSelectedIds([]);

  return (
    <CompareContext.Provider
      value={{ selectedIds, addCollege, removeCollege, toggleCollege, clearSelected }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}
