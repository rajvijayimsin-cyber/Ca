import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
}

const DetailModal: React.FC<DetailModalProps> = ({ open, onClose, title, data }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {title}
      <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
    </DialogTitle>
    <Divider />
    <DialogContent>
      {Object.entries(data).map(([key, value]) => (
        <Box key={key} sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #eee' }}>
          <Typography sx={{ width: 140, fontWeight: 600, fontSize: '0.85rem', color: '#666', textTransform: 'capitalize' }}>
            {key.replace(/_/g, ' ')}
          </Typography>
          <Typography sx={{ flex: 1, fontSize: '0.85rem' }}>{String(value ?? '—')}</Typography>
        </Box>
      ))}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default DetailModal;
