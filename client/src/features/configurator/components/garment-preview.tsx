import { useId, useState } from 'react';
import { contrastColor } from '@/components/shared/color-swatch';
import type { PrintPlacement } from '@/types';
import { sideOf, type GarmentSide, type PlacedPrint } from '../state/configurator-reducer';

/**
 * Flat 2D mock-up of the garment used until the Three.js / R3F canvas is implemented.
 * Offsets are normalized (-1..1) inside a placement zone, +Y points down in this preview.
 */

interface Zone {
  x: number;
  y: number;
  w: number;
  h: number;
}

const ZONES: Record<PrintPlacement, Zone> = {
  front: { x: 132, y: 105, w: 136, h: 175 },
  back: { x: 132, y: 95, w: 136, h: 195 },
  'left-sleeve': { x: 50, y: 86, w: 42, h: 42 },
  'right-sleeve': { x: 308, y: 86, w: 42, h: 42 },
  hood: { x: 168, y: 6, w: 64, h: 36 },
};

const BODY_PATH =
  'M150 40 Q200 78 250 40 L312 56 L374 122 L330 168 L300 142 L300 420 Q200 432 100 420 L100 142 L70 168 L26 122 L88 56 Z';
const BACK_BODY_PATH =
  'M150 40 Q200 52 250 40 L312 56 L374 122 L330 168 L300 142 L300 420 Q200 432 100 420 L100 142 L70 168 L26 122 L88 56 Z';
// Drawn behind the body: the dome sits above the shoulders and its lower part fills the neckline
const HOOD_PATH = 'M136 54 Q126 -8 200 -8 Q274 -8 264 54 Q200 96 136 54 Z';

interface GarmentPreviewProps {
  baseColor: string;
  prints: PlacedPrint[];
  side: GarmentSide;
  withHood?: boolean;
  selectedId?: string | null;
  onSelect?: (localId: string | null) => void;
  className?: string;
}

export function GarmentPreview({
  baseColor,
  prints,
  side,
  withHood,
  selectedId,
  onSelect,
  className,
}: GarmentPreviewProps) {
  const uid = useId().replace(/:/g, '');
  const clipId = `garment-clip-${uid}`;
  const shadeId = `garment-shade-${uid}`;
  const bodyPath = side === 'front' ? BODY_PATH : BACK_BODY_PATH;
  const outline = contrastColor(baseColor) === '#FFFFFF' ? 'rgba(255,255,255,0.25)' : 'rgba(17,24,39,0.25)';

  const visible = prints
    .filter((p) => {
      const printSide = sideOf(p.placement);
      if (p.placement === 'hood' && !withHood) return false;
      return printSide === null || printSide === side;
    })
    .sort((a, b) => a.zIndex - b.zIndex);

  const selected = visible.find((p) => p.localId === selectedId);

  return (
    <svg
      viewBox="0 -10 400 450"
      className={className}
      role="img"
      aria-label={`Макет виробу, ${side === 'front' ? 'вигляд спереду' : 'вигляд ззаду'}`}>
      <defs>
        <clipPath id={clipId}>
          <path d={bodyPath} />
          {withHood && <path d={HOOD_PATH} />}
        </clipPath>
        <linearGradient id={shadeId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      {/* Garment */}
      <g onClick={() => onSelect?.(null)}>
        {withHood && <path d={HOOD_PATH} fill={baseColor} stroke={outline} strokeWidth="2" />}
        <path d={bodyPath} fill={baseColor} stroke={outline} strokeWidth="2" />
        <path d={bodyPath} fill={`url(#${shadeId})`} pointerEvents="none" />
        {side === 'front' && <path d="M150 40 Q200 78 250 40" fill="none" stroke={outline} strokeWidth="3" />}
      </g>

      {/* Prints */}
      <g clipPath={`url(#${clipId})`}>
        {visible.map((print) => {
          const box = printBox(print);
          return (
            <g
              key={print.localId}
              transform={`rotate(${print.rotation} ${box.cx} ${box.cy})`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(print.localId);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect?.(print.localId);
              }}
              role={onSelect ? 'button' : undefined}
              tabIndex={onSelect ? 0 : undefined}
              aria-label={onSelect ? `Вибрати принт ${print.name}` : undefined}
              className={onSelect ? 'cursor-pointer outline-none' : undefined}>
              <PrintImage print={print} box={box} />
            </g>
          );
        })}
      </g>

      {/* Selection: zone outline + print frame */}
      {selected && (
        <g pointerEvents="none">
          <rect
            {...zoneRect(ZONES[selected.placement])}
            fill="none"
            className="stroke-accent"
            strokeWidth="1.5"
            strokeDasharray="5 4"
            rx="4"
          />
          {(() => {
            const box = printBox(selected);
            return (
              <rect
                x={box.x - 3}
                y={box.y - 3}
                width={box.w + 6}
                height={box.h + 6}
                transform={`rotate(${selected.rotation} ${box.cx} ${box.cy})`}
                fill="none"
                className="stroke-accent"
                strokeWidth="2"
                rx="3"
              />
            );
          })()}
        </g>
      )}
    </svg>
  );
}

const zoneRect = (zone: Zone) => ({ x: zone.x, y: zone.y, width: zone.w, height: zone.h });

type Box = ReturnType<typeof printBox>;

/** Print image with a neutral placeholder when the URL is missing or fails to load. */
function PrintImage({ print, box }: { print: PlacedPrint; box: Box }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (!print.imageUrl || failedUrl === print.imageUrl) {
    return (
      <g>
        <rect
          x={box.x}
          y={box.y}
          width={box.w}
          height={box.h}
          rx="4"
          fill="rgba(255,255,255,0.55)"
          stroke="rgba(17,24,39,0.35)"
          strokeDasharray="4 3"
        />
        <text
          x={box.cx}
          y={box.cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={Math.max(8, Math.min(14, box.w / 7))}
          className="fill-foreground">
          {print.name}
        </text>
      </g>
    );
  }

  return (
    <image
      href={print.imageUrl}
      x={box.x}
      y={box.y}
      width={box.w}
      height={box.h}
      preserveAspectRatio="xMidYMid meet"
      onError={() => setFailedUrl(print.imageUrl)}
    />
  );
}

function printBox(print: PlacedPrint) {
  const zone = ZONES[print.placement];
  const aspect = print.widthPx && print.heightPx ? print.heightPx / print.widthPx : 1;

  let w = zone.w * 0.6 * print.scale;
  let h = w * aspect;
  // Keep tall prints inside the zone height at scale 1
  const maxH = zone.h * 0.7 * print.scale;
  if (h > maxH) {
    h = maxH;
    w = h / aspect;
  }

  const cx = zone.x + zone.w / 2 + (print.offsetX * zone.w) / 2;
  const cy = zone.y + zone.h / 2 + (print.offsetY * zone.h) / 2;

  return { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy };
}
