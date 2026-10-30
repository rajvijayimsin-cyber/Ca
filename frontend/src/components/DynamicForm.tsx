import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Select, MenuItem, FormControl, InputLabel, Box, IconButton, Divider,
  Switch, FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'select' | 'boolean' | 'textarea';
  required?: boolean;
  options?: string[]; // for select type
  defaultValue?: any;
}

interface DynamicFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  title: string;
  fields: FormField[];
  initialData?: Record<string, any>;
  submitLabel?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  open, onClose, onSubmit, title, fields, initialData, submitLabel = 'Save',
}) => {
  const [form, setForm] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    fields.forEach(f => { init[f.name] = initialData?.[f.name] ?? f.defaultValue ?? ''; });
    return init;
  });

  const handleChange = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {fields.map(field => {
            if (field.type === 'select' && field.options) {
              return (
                <FormControl key={field.name} fullWidth size="small">
                  <InputLabel>{field.label}</InputLabel>
                  <Select value={form[field.name] || ''} label={field.label}
                    onChange={e => handleChange(field.name, e.target.value)}>
                    {field.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </Select>
                </FormControl>
              );
            }
            if (field.type === 'boolean') {
              return (
                <FormControlLabel key={field.name}
                  control={<Switch checked={!!form[field.name]} onChange={e => handleChange(field.name, e.target.checked)} />}
                  label={field.label} />
              );
            }
            if (field.type === 'textarea') {
              return (
                <TextField key={field.name} fullWidth size="small" multiline rows={3}
                  label={field.label} value={form[field.name] || ''}
                  onChange={e => handleChange(field.name, e.target.value)}
                  required={field.required} />
              );
            }
            return (
              <TextField key={field.name} fullWidth size="small"
                label={field.label} type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text'}
                value={form[field.name] || ''}
                onChange={e => handleChange(field.name, e.target.value)}
                required={field.required}
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined} />
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ textTransform: 'none' }}>{submitLabel}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DynamicForm;
