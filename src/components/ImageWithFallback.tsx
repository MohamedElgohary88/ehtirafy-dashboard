import React, { useState } from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';

interface ImageWithFallbackProps extends BoxProps<'img'> {
  src?: string;
  fallbackSrc?: string;
  alt?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  fallbackSrc = `${import.meta.env.BASE_URL}logo.png`, 
  alt = '', 
  ...props 
}) => {
  const [errorSrc, setErrorSrc] = useState<string | null>(null);

  const currentSrc = (errorSrc === src || !src) ? fallbackSrc : src;

  return (
    <Box
      component="img"
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (errorSrc !== src) {
          setErrorSrc(src || null);
        }
      }}
      {...props}
    />
  );
};
