import React, { createContext, useContext, useState, useCallback } from 'react';
import { saveLocal, loadLocal } from '../utils/localStorage';

interface AppState {
  selectedItem: Record<string, any> | null;
  selectedItemType: string;
  items: Record<string, any[]>; // key = feature/table name, value = items array
}

interface AppContextType extends AppState {
  selectItem: (item: Record<string, any>, type: string) => void;
  clearSelection: () => void;
  addItem: (type: string, item: Record<string, any>) => void;
  updateItem: (type: string, id: string, data: Record<string, any>) => void;
  deleteItem: (type: string, id: string) => void;
  getItems: (type: string) => any[];
}

const AppContext = createContext<AppContextType>({
  selectedItem: null, selectedItemType: '', items: {},
  selectItem: () => {}, clearSelection: () => {},
  addItem: () => {}, updateItem: () => {}, deleteItem: () => {},
  getItems: () => [],
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(null);
  const [selectedItemType, setSelectedItemType] = useState('');
  const [items, setItems] = useState<Record<string, any[]>>(() => loadLocal('app_items', {}));

  const selectItem = useCallback((item: Record<string, any>, type: string) => {
    setSelectedItem(item);
    setSelectedItemType(type);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItem(null);
    setSelectedItemType('');
  }, []);

  const addItem = useCallback((type: string, item: Record<string, any>) => {
    setItems(prev => {
      const updated = { ...prev, [type]: [...(prev[type] || []), { ...item, id: Date.now().toString() }] };
      saveLocal('app_items', updated);
      return updated;
    });
  }, []);

  const updateItem = useCallback((type: string, id: string, data: Record<string, any>) => {
    setItems(prev => {
      const list = prev[type] || [];
      const updated = { ...prev, [type]: list.map(it => it.id === id ? { ...it, ...data } : it) };
      saveLocal('app_items', updated);
      return updated;
    });
  }, []);

  const deleteItem = useCallback((type: string, id: string) => {
    setItems(prev => {
      const updated = { ...prev, [type]: (prev[type] || []).filter(it => it.id !== id) };
      saveLocal('app_items', updated);
      return updated;
    });
  }, []);

  const getItems = useCallback((type: string) => items[type] || [], [items]);

  return (
    <AppContext.Provider value={{ selectedItem, selectedItemType, items, selectItem, clearSelection, addItem, updateItem, deleteItem, getItems }}>
      {children}
    </AppContext.Provider>
  );
};
