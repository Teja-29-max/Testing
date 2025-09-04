import React from 'react';
import { Alert, AlertTitle, Collapse } from '@mui/material';
import { AlertTriangle } from 'lucide-react';

interface ErrorAlertProps {
  error: string;
  show: boolean;
  onClose?: () => void;
  severity?: 'error' | 'warning' | 'info';
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  show, 
  onClose,
  severity = 'error'
}) => {
  return (
    <Collapse in={show}>
      <Alert 
        severity={severity} 
        onClose={onClose}
        icon={<AlertTriangle size={20} />}
        sx={{ mb: 2 }}
      >
        <AlertTitle>
          {severity === 'error' ? 'Error' : severity === 'warning' ? 'Warning' : 'Information'}
        </AlertTitle>
        {error}
      </Alert>
    </Collapse>
  );
};