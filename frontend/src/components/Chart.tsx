import React from 'react';
import { Box, Typography } from '@mui/material';
import { AppTheme } from '../hooks/useAppTheme';
import { cardSx, sectionHeadingSx } from '../utils/themeStyles';

interface ChartDataPoint {
  label: string;
  value: number;
  change?: number;
}

interface ChartProps {
  type: 'bar' | 'line' | 'donut';
  data: ChartDataPoint[];
  theme: AppTheme;
  title?: string;
  height?: number;
  colors?: string[];
}

const BarChart: React.FC<{ data: ChartDataPoint[]; theme: AppTheme; height: number; colors: string[] }> = ({
  data,
  theme,
  height,
  colors,
}) => {
  if (!Array.isArray(data) || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height, pt: 2 }}>
      {data.map((point, idx) => {
        const barHeight = (point.value / maxVal) * (height - 30);
        const color = colors[idx % colors.length];
        return (
          <Box
            key={idx}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 40,
                height: barHeight,
                borderRadius: `${theme.borderRadius / 3}px ${theme.borderRadius / 3}px 0 0`,
                background: `linear-gradient(180deg, ${color} 0%, ${color}BB 100%)`,
                transition: 'height 0.3s ease',
                cursor: 'default',
                '&:hover': {
                  opacity: 0.85,
                  transform: 'scaleY(1.02)',
                  transformOrigin: 'bottom',
                },
              }}
            />
            <Typography
              sx={{
                fontSize: '0.6rem',
                color: theme.textSecondary,
                fontFamily: theme.fontFamily,
                textAlign: 'center',
              }}
            >
              {point.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

const LineChart: React.FC<{ data: ChartDataPoint[]; theme: AppTheme; height: number; colors: string[] }> = ({
  data,
  theme,
  height,
  colors,
}) => {
  if (!Array.isArray(data) || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = Math.min(...data.map(d => d.value));
  const range = maxVal - minVal || 1;
  const chartHeight = height - 40;
  const padding = 20;

  const points = data.map((d, i) => ({
    x: padding + i * ((100 - 2 * padding) / Math.max(data.length - 1, 1)),
    y: chartHeight - ((d.value - minVal) / range) * (chartHeight - 20) + 10,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = pathD +
    ` L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  const color = colors[0];

  return (
    <Box sx={{ position: 'relative', height }}>
      <svg width="100%" height={chartHeight + 30} viewBox={`0 0 100 ${chartHeight + 30}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(frac => (
          <line
            key={frac}
            x1={padding}
            y1={10 + (1 - frac) * (chartHeight - 20)}
            x2={100 - padding}
            y2={10 + (1 - frac) * (chartHeight - 20)}
            stroke={theme.border}
            strokeWidth="0.3"
          />
        ))}
        {/* Area fill */}
        <path d={areaD} fill={`${color}15`} />
        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2" fill={color} stroke={theme.surface} strokeWidth="1" />
        ))}
      </svg>
      {/* X-axis labels */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: `${padding}%`, mt: -1 }}>
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((d, i) => (
          <Typography
            key={i}
            sx={{
              fontSize: '0.55rem',
              color: theme.textSecondary,
              fontFamily: theme.fontFamily,
            }}
          >
            {d.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

const DonutChart: React.FC<{ data: ChartDataPoint[]; theme: AppTheme; height: number; colors: string[] }> = ({
  data,
  theme,
  height,
  colors,
}) => {
  if (!Array.isArray(data) || data.length === 0) return null;
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let cumulative = 0;
  const segments = data.map((d, i) => {
    const start = cumulative / total;
    cumulative += d.value;
    const end = cumulative / total;
    return { ...d, start, end, color: colors[i % colors.length] };
  });

  // Build conic-gradient
  const gradientStops = segments.flatMap(seg => [
    `${seg.color} ${(seg.start * 100).toFixed(1)}%`,
    `${seg.color} ${(seg.end * 100).toFixed(1)}%`,
  ]);

  const size = Math.min(height - 40, 140);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center', py: 2 }}>
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `conic-gradient(${gradientStops.join(', ')})`,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            backgroundColor: theme.surface,
          },
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
        {segments.map((seg, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: 2, backgroundColor: seg.color, flexShrink: 0 }} />
            <Typography
              sx={{
                fontSize: '0.72rem',
                color: theme.text,
                fontFamily: theme.fontFamily,
                whiteSpace: 'nowrap',
              }}
            >
              {seg.label}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: theme.textSecondary,
                fontFamily: theme.numberFont,
              }}
            >
              {seg.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  theme,
  title,
  height = 200,
  colors,
}) => {
  const defaultColors = [theme.primary, theme.secondary, theme.success, theme.warning, theme.info, theme.error];
  const chartColors = colors || defaultColors;

  return (
    <Box
      sx={{
        ...cardSx(theme),
        p: 2,
      }}
    >
      {title && (
        <Typography
          sx={{
            ...sectionHeadingSx(theme),
            mb: 1,
          }}
        >
          {title}
        </Typography>
      )}
      {type === 'bar' && <BarChart data={data} theme={theme} height={height} colors={chartColors} />}
      {type === 'line' && <LineChart data={data} theme={theme} height={height} colors={chartColors} />}
      {type === 'donut' && <DonutChart data={data} theme={theme} height={height} colors={chartColors} />}
    </Box>
  );
};

export default Chart;
