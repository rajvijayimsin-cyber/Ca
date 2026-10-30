import { useState, useCallback } from 'react';
import api from '../api';
import { FieldDef } from '../components/CrudModal';

interface UseCrudOptions {
  baseEndpoint: string;          // e.g., '/api/patients'
  fields: FieldDef[];            // form fields for create/edit
  onSuccess?: () => void;        // callback after any CRUD op (e.g., refetch)
  resourceName?: string;         // for dialog titles (e.g., 'Care Recipient')
}

export function useCrud({ baseEndpoint, fields, onSuccess, resourceName = 'Item' }: UseCrudOptions) {
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = useCallback(async (data: Record<string, any>) => {
    setLoading(true);
    setError('');
    try {
      await api.post(baseEndpoint, data);
      setShowCreate(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Create failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseEndpoint, onSuccess]);

  const handleEdit = useCallback(async (data: Record<string, any>) => {
    if (!editItem?.id) return;
    setLoading(true);
    setError('');
    try {
      await api.put(`${baseEndpoint}/${editItem.id}`, data);
      setEditItem(null);
      onSuccess?.();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseEndpoint, editItem, onSuccess]);

  const handleDelete = useCallback(async () => {
    if (!deleteItem?.id) return;
    setLoading(true);
    setError('');
    try {
      await api.delete(`${baseEndpoint}/${deleteItem.id}`);
      setDeleteItem(null);
      onSuccess?.();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Delete failed');
    } finally {
      setLoading(false);
    }
  }, [baseEndpoint, deleteItem, onSuccess]);

  return {
    // State
    showCreate, editItem, deleteItem, loading, error,
    fields, resourceName,
    // Actions
    openCreate: () => setShowCreate(true),
    closeCreate: () => setShowCreate(false),
    openEdit: (item: any) => setEditItem(item),
    closeEdit: () => setEditItem(null),
    openDelete: (item: any) => setDeleteItem(item),
    closeDelete: () => setDeleteItem(null),
    handleCreate, handleEdit, handleDelete,
  };
}

export default useCrud;
