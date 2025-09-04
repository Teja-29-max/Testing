import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Alert,
  Fade,
  LinearProgress,
} from '@mui/material';
import { Plus, Link as LinkIcon, Zap } from 'lucide-react';
import { UrlForm } from '../components/shortener/UrlForm';
import { ResultCard } from '../components/shortener/ResultCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { UrlSubmission, ShortenedUrl } from '../types';
import { urlService } from '../services/urlService';
import { logger } from '../services/loggingService';
import { validateUrl, validateValidityPeriod, validateShortcode } from '../utils/validation';

export const UrlShortener: React.FC = () => {
  const [submissions, setSubmissions] = useState<UrlSubmission[]>([
    { originalUrl: '', validityPeriod: undefined, preferredShortcode: '' }
  ]);
  const [results, setResults] = useState<ShortenedUrl[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string>('');

  React.useEffect(() => {
    logger.info('UrlShortener page mounted', 'UrlShortener', 'useEffect');
  }, []);

  const handleAddForm = () => {
    if (submissions.length < 5) {
      logger.info('Adding new URL form', 'UrlShortener', 'handleAddForm', { 
        currentCount: submissions.length 
      });
      setSubmissions([...submissions, { originalUrl: '', validityPeriod: undefined, preferredShortcode: '' }]);
    } else {
      logger.warn('Cannot add more forms: maximum reached', 'UrlShortener', 'handleAddForm', { 
        maxForms: 5 
      });
    }
  };

  const handleRemoveForm = (index: number) => {
    logger.info('Removing URL form', 'UrlShortener', 'handleRemoveForm', { 
      index, 
      remainingForms: submissions.length - 1 
    });
    setSubmissions(submissions.filter((_, i) => i !== index));
    
    // Clear errors for removed form
    const newErrors = { ...errors };
    delete newErrors[`url_${index}`];
    delete newErrors[`period_${index}`];
    delete newErrors[`shortcode_${index}`];
    setErrors(newErrors);
  };

  const handleSubmissionChange = (index: number, submission: UrlSubmission) => {
    logger.debug('URL submission changed', 'UrlShortener', 'handleSubmissionChange', { 
      index,
      hasUrl: !!submission.originalUrl,
      hasValidityPeriod: !!submission.validityPeriod,
      hasShortcode: !!submission.preferredShortcode
    });

    const newSubmissions = [...submissions];
    newSubmissions[index] = submission;
    setSubmissions(newSubmissions);

    // Clear errors for this form when user makes changes
    const newErrors = { ...errors };
    delete newErrors[`url_${index}`];
    delete newErrors[`period_${index}`];
    delete newErrors[`shortcode_${index}`];
    setErrors(newErrors);
    setSubmitError('');
  };

  const validateAllSubmissions = (): boolean => {
    logger.info('Validating all submissions', 'UrlShortener', 'validateAllSubmissions', { 
      submissionCount: submissions.length 
    });

    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    submissions.forEach((submission, index) => {
      if (!submission.originalUrl.trim()) {
        return; // Skip empty submissions
      }

      const urlValidation = validateUrl(submission.originalUrl);
      if (!urlValidation.isValid) {
        newErrors[`url_${index}`] = urlValidation.error!;
        isValid = false;
      }

      if (submission.validityPeriod !== undefined) {
        const periodValidation = validateValidityPeriod(submission.validityPeriod.toString());
        if (!periodValidation.isValid) {
          newErrors[`period_${index}`] = periodValidation.error!;
          isValid = false;
        }
      }

      if (submission.preferredShortcode) {
        const shortcodeValidation = validateShortcode(submission.preferredShortcode);
        if (!shortcodeValidation.isValid) {
          newErrors[`shortcode_${index}`] = shortcodeValidation.error!;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      logger.warn('Validation failed for one or more submissions', 'UrlShortener', 'validateAllSubmissions', { 
        errorCount: Object.keys(newErrors).length 
      });
    } else {
      logger.info('All submissions validated successfully', 'UrlShortener', 'validateAllSubmissions');
    }

    return isValid;
  };

  const handleSubmitAll = async () => {
    logger.info('Starting bulk URL shortening process', 'UrlShortener', 'handleSubmitAll', { 
      submissionCount: submissions.length 
    });

    if (!validateAllSubmissions()) {
      return;
    }

    const validSubmissions = submissions.filter(s => s.originalUrl.trim());
    
    if (validSubmissions.length === 0) {
      logger.warn('No valid URLs to submit', 'UrlShortener', 'handleSubmitAll');
      setSubmitError('Please enter at least one URL to shorten');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setResults([]);

    try {
      const promises = validSubmissions.map(async (submission, index) => {
        logger.info('Processing URL submission', 'UrlShortener', 'handleSubmitAll', { 
          index,
          originalUrl: submission.originalUrl
        });

        const response = await urlService.shortenUrl(submission);
        
        if (response.success && response.data) {
          logger.info('URL shortened successfully', 'UrlShortener', 'handleSubmitAll', { 
            index,
            shortCode: response.data.shortCode
          });
          return response.data;
        } else {
          logger.error('Failed to shorten URL', 'UrlShortener', 'handleSubmitAll', { 
            index,
            error: response.error,
            originalUrl: submission.originalUrl
          });
          throw new Error(response.error || 'Failed to shorten URL');
        }
      });

      const results = await Promise.all(promises);
      setResults(results);
      
      logger.info('Bulk URL shortening completed successfully', 'UrlShortener', 'handleSubmitAll', { 
        successCount: results.length,
        totalSubmitted: validSubmissions.length
      });

      // Reset forms after successful submission
      setSubmissions([{ originalUrl: '', validityPeriod: undefined, preferredShortcode: '' }]);
      
    } catch (error: any) {
      logger.error('Error during bulk URL shortening', 'UrlShortener', 'handleSubmitAll', { 
        error: error.message
      });
      setSubmitError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validSubmissionsCount = submissions.filter(s => s.originalUrl.trim()).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4} textAlign="center">
        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
          <LinkIcon size={32} color="#1976d2" />
          <Typography variant="h3" color="primary" fontWeight={700}>
            URL Shortener
          </Typography>
        </Box>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Shorten up to 5 URLs simultaneously with custom options
        </Typography>
        <Typography variant="body2" color="textSecondary">
          AFFORDMED - Fit & Affordability Solutions
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight={600}>
              URL Submissions
            </Typography>
            
            {submitError && (
              <Fade in>
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError}
                </Alert>
              </Fade>
            )}

            {isSubmitting && <LinearProgress sx={{ mb: 2 }} />}

            {submissions.map((submission, index) => (
              <UrlForm
                key={index}
                index={index}
                submission={submission}
                onSubmissionChange={handleSubmissionChange}
                onRemove={handleRemoveForm}
                isSubmitting={isSubmitting}
                errors={errors}
                canRemove={submissions.length > 1}
              />
            ))}

            <Box display="flex" gap={2} mt={3}>
              <Button
                onClick={handleAddForm}
                disabled={submissions.length >= 5 || isSubmitting}
                variant="outlined"
                startIcon={<Plus size={20} />}
                sx={{ flex: 1 }}
              >
                Add URL ({submissions.length}/5)
              </Button>
              
              <Button
                onClick={handleSubmitAll}
                disabled={validSubmissionsCount === 0 || isSubmitting}
                variant="contained"
                size="large"
                startIcon={<Zap size={20} />}
                sx={{ 
                  flex: 2,
                  fontWeight: 600,
                  py: 1.5,
                }}
              >
                {isSubmitting ? 'Shortening...' : `Shorten ${validSubmissionsCount} URL${validSubmissionsCount !== 1 ? 's' : ''}`}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, minHeight: 400 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight={600}>
              Shortened URLs
            </Typography>
            
            {isSubmitting ? (
              <LoadingSpinner message="Creating shortened URLs..." />
            ) : results.length > 0 ? (
              <Box>
                <Alert severity="success" sx={{ mb: 3 }}>
                  Successfully created {results.length} shortened URL{results.length !== 1 ? 's' : ''}!
                </Alert>
                {results.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </Box>
            ) : (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                minHeight={300}
                textAlign="center"
              >
                <LinkIcon size={48} color="#e0e0e0" />
                <Typography variant="h6" color="textSecondary" mt={2}>
                  No URLs shortened yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Submit your URLs to see the shortened results here
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};