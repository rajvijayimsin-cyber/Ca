import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

/**
 * The square that sits where an app puts its logo.
 *
 * Every layout drew the same medical-cross glyph on a gradient tile. That is
 * the right default — a mock of an app nobody has branded yet — but it stayed
 * there even after the customer uploaded their own logo, because the design
 * preview never read the override store. Now each layout hands its own tile
 * `sx` and its own glyph to this component, so the shape, size and radius the
 * layout chose are preserved either way and only what is drawn inside changes.
 *
 * The image is `contain`-fitted on a light tile rather than stretched onto the
 * gradient: a customer's logo is usually a wordmark with its own background,
 * and a gradient behind it reads as a rendering fault.
 */
export default function PreviewBrandMark({
  logoUrl,
  logoMark,
  alt,
  sx,
  children,
}: {
  logoUrl?: string | null;
  /** Two or three letters, drawn on the tile when there is no image. */
  logoMark?: string | null;
  alt?: string;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}) {
  if (logoUrl) {
    return (
      <Box
        sx={[
          ...(Array.isArray(sx) ? sx : [sx]),
          // Overrides the tile's gradient, and only that: size, radius and
          // flex behaviour still come from the layout.
          {
            background: '#fff',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            overflow: 'hidden',
            p: '2px',
          },
        ]}
      >
        <Box
          component="img"
          src={logoUrl}
          alt={alt ? `${alt} logo` : 'Logo'}
          sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </Box>
    );
  }
  const mark = logoMark?.trim().slice(0, 3).toUpperCase();
  if (mark) {
    // Drawn as SVG text on a viewBox rather than a styled Typography, because
    // these tiles run from 24px in a strip to 72px in a hero and an em size
    // picked for one is wrong in the other; a viewBox scales itself.
    return (
      <Box sx={sx}>
        <Box
          component="svg"
          viewBox="0 0 24 24"
          role="img"
          aria-label={alt ? `${alt} logo` : 'Logo'}
          sx={{ width: '70%', height: '70%', display: 'block' }}
        >
          <text
            x="12"
            y="12"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={mark.length > 2 ? 9 : 11}
            fontWeight="700"
            fill="#fff"
            letterSpacing="0.3"
          >
            {mark}
          </text>
        </Box>
      </Box>
    );
  }
  return <Box sx={sx}>{children}</Box>;
}
