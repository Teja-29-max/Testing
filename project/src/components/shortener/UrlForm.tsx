import React from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  InputAdornment,
  Chip,
} from '@mui/material';
import { Globe, Clock, Hash, X } from 'lucide-react';
import { UrlSubmission } from '../../types';
import { validateUrl, validateValidityPeriod, validateShortcode } from '../../utils/validation';
import { logger } from '../../services/loggingService';

interface UrlFormProps {
  index: number;
  submission: UrlSubmission;
  onSubmissionChange: (index: number, submission: UrlSubmission) => void;
  onRemove: (index: number) => void;
  isSubmitting: boolean;
  errors: { [key: string]: string };
  canRemove: boolean;
}

export const UrlForm: React.FC<UrlFormProps> = ({
  index,
  submission,
  onSubmissionChange,
  onRemove,
  isSubmitting,
  errors,
  canRemove,
}) => {
  React.useEffect(() => {
    logger.debug('UrlForm component mounted', 'UrlForm', 'useEffect', { index });
  }, [index]);

  const handleInputChange = (field: keyof UrlSubmission, value: string) => {
    logger.debug('Input field changed', 'UrlForm', 'handleInputChange', { 
      field, 
      index,
      valueLength: value.length
    });

    const updatedSubmission = { ...submission, [field]: value };
    onSubmissionChange(index, updatedSubmission);
  };

  const handleRemove = () => {
    logger.info('Removing URL form', 'UrlForm', 'handleRemove', { index });
    onRemove(index);
  };

  const urlValidation = validateUrl(submission.originalUrl);
  const periodValidation = validateValidityPeriod(submission.validityPeriod?.toString() || '');
  const shortcodeValidation = validateShortcode(submission.preferredShortcode || '');

  const urlError = errors[`url_${index}`] || (!urlValidation.isValid ? urlValidation.error : '');
  const periodError = errors[`period_${index}`] || (!periodValidation.isValid ? periodValidation.error : '');
  const shortcodeError = errors[`shortcode_${index}`] || (!shortcodeValidation.isValid ? shortcodeValidation.error : '');

  return (
    <Card 
      sx={{ 
        mb: 3,
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 6,
        },
      }}
      elevation={3}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="primary" fontWeight={600}>
            URL #{index + 1}
          </Typography>
          {canRemove && (
            <Button
              onClick={handleRemove}
              color="error"
              variant="outlined"
              size="small"
              startIcon={<X size={16} />}
              disabled={isSubmitting}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Remove
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            label="Original URL"
            placeholder="https://example.com/very-long-url"
            value={submission.originalUrl}
            onChange={(e) => handleInputChange('originalUrl', e.target.value)}
            error={!!urlError}
            helperText={urlError}
            disabled={isSubmitting}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Globe size={20} color={urlError ? '#d32f2f' : '#9e9e9e'} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
              },
            }}
          />

          <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
            <TextField
              label="Validity Period"
              placeholder="e.g., 60"
              type="number"
              value={submission.validityPeriod || ''}
              onChange={(e) => handleInputChange('validityPeriod', e.target.value)}
              error={!!periodError}
              helperText={periodError || 'Optional: Duration in minutes'}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Clock size={20} color={periodError ? '#d32f2f' : '#9e9e9e'} />
                  </InputAdornment>
                ),
                inputProps: { min: 1, max: 525600 }
              }}
              sx={{ flex: 1 }}
            />

            <TextField
              label="Custom Shortcode"
              placeholder="e.g., my-link"
              value={submission.preferredShortcode || ''}
              onChange={(e) => handleInputChange('preferredShortcode', e.target.value)}
              error={!!shortcodeError}
              helperText={shortcodeError || 'Optional: 3-20 characters, letters/numbers only'}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Hash size={20} color={shortcodeError ? '#d32f2f' : '#9e9e9e'} />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
          </Box>

          {submission.validityPeriod && (
            <Box mt={1}>
              <Chip
                label={`Expires in ${submission.validityPeriod} minutes`}
                color="info"
                variant="outlined"
                size="small"
                icon={<Clock size={16} />}
              />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};