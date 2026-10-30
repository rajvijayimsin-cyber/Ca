import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, CircularProgress, Alert, MenuItem, Switch, FormControlLabel, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'datetime' | 'select' | 'boolean' | 'textarea';
  required?: boolean;
  options?: string[];  // for select type
  defaultValue?: any;
}

interface CrudModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  title: string;
  fields: FieldDef[];
  initialValues?: Record<string, any>;  // for edit mode
  loading?: boolean;
  error?: string;
}

const CrudModal: React.FC<CrudModalProps> = ({
  open, onClose, onSubmit, title, fields, initialValues, loading, error,
}) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (open) {
      const defaults: Record<string, any> = {};
      fields.forEach(f => {
        defaults[f.name] = initialValues?.[f.name] ?? f.defaultValue ?? (f.type === 'boolean' ? false : f.type === 'number' ? 0 : '');
      });
      setValues(defaults);
      setSubmitError('');
    }
  }, [open, initialValues, fields]);

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      await onSubmit(values);
      onClose();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.detail || err?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          {(submitError || error) && <Alert severity="error" sx={{ mb: 2 }}>{submitError || error}</Alert>}
          {fields.map(f => (
            <Box key={f.name} sx={{ mb: 2 }}>
              {f.type === 'boolean' ? (
                <FormControlLabel
                  control={<Switch checked={!!values[f.name]} onChange={e => handleChange(f.name, e.target.checked)} />}
                  label={f.label}
                />
              ) : f.type === 'select' ? (
                <TextField select fullWidth label={f.label} value={values[f.name] || ''} onChange={e => handleChange(f.name, e.target.value)} required={f.required}>
                  {(f.options || []).map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              ) : f.type === 'textarea' ? (
                <TextField fullWidth multiline rows={3} label={f.label} value={values[f.name] || ''} onChange={e => handleChange(f.name, e.target.value)} required={f.required} />
              ) : (
                <TextField fullWidth label={f.label} type={f.type === 'datetime' ? 'datetime-local' : f.type} value={values[f.name] || ''} onChange={e => handleChange(f.name, f.type === 'number' ? Number(e.target.value) : e.target.value)} required={f.required} InputLabelProps={f.type === 'date' || f.type === 'datetime' ? { shrink: true } : undefined} />
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : (initialValues ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CrudModal;
export type { CrudModalProps };
