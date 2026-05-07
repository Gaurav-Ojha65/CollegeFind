'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SavedContext = createContext();

export function SavedProvider({ children }) {
  const { token, user } = useAuth();
  const [savedColleges, setSavedColleges] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchSaved();
    } else {
      setSavedColleges([]);
    }
  }, [token]);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSavedColleges(data.data);
      }
    } catch (err) {
      console.error('Error fetching saved colleges', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaved = async (college) => {
    if (!token) return { success: false, error: 'Please login to save colleges' };

    const isSaved = savedColleges.some((c) => c.id === college.id);
    
    // Optimistic UI
    if (isSaved) {
      setSavedColleges((prev) => prev.filter((c) => c.id !== college.id));
    } else {
      setSavedColleges((prev) => [{...college, saved_at: new Date().toISOString()}, ...prev]);
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/saved/${college.id}`;
      const method = isSaved ? 'DELETE' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        fetchSaved();
        return { success: false, error: data.error };
      }
      return { success: true };
    } catch (err) {
      fetchSaved(); // Revert
      return { success: false, error: err.message };
    }
  };

  const isSaved = (collegeId) => {
    return savedColleges.some((c) => c.id === collegeId);
  };

  return (
    <SavedContext.Provider value={{ savedColleges, loading, toggleSaved, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within SavedProvider');
  }
  return context;
}
