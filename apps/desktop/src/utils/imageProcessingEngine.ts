/**
 * Real-time In-Browser Scientific Image Processing Engine for QFixer Desktop.
 *
 * Implements:
 * 1. Multi-scale Background Illumination Estimation & Shadow Flattening
 * 2. Adaptive Paper Whitening without ink erosion
 * 3. Ink Density & Contrast Restoration (Preserves math formulas, fractions, radicals)
 * 4. High-pass Unsharp Sharpening
 * 5. Diagram Color Preservation
 */

export interface EnhancementOptions {
  shadowRemoval: number;       // 0 to 100
  backgroundCleaning: number;  // 0 to 100
  inkContrast: number;         // 0 to 100
  noiseRemoval: number;        // 0 to 100
  sharpening: number;          // 0 to 100
  protectColors: boolean;
}

export function processImageRealtime(
  sourceCanvas: HTMLCanvasElement,
  options: EnhancementOptions
): HTMLCanvasElement {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  // Create working canvas
  const outCanvas = document.createElement("canvas");
  outCanvas.width = width;
  outCanvas.height = height;
  const outCtx = outCanvas.getContext("2d", { willReadFrequently: true });
  const srcCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });

  if (!outCtx || !srcCtx) return sourceCanvas;

  const srcImageData = srcCtx.getImageData(0, 0, width, height);
  const srcData = srcImageData.data;

  const outImageData = outCtx.createImageData(width, height);
  const outData = outImageData.data;

  // Step 1: Compute Grayscale luminance and build a fast downscaled background luminance map
  const gray = new Float32Array(width * height);
  for (let i = 0, p = 0; i < srcData.length; i += 4, p++) {
    // Standard perceptual luminance
    gray[p] = 0.299 * srcData[i] + 0.587 * srcData[i + 1] + 0.114 * srcData[i + 2];
  }

  // Fast background estimation using block-based dilation and smoothing
  // to model shadows and uneven lighting
  const blockSize = Math.max(16, Math.min(64, Math.floor(Math.min(width, height) / 20)));
  const blocksX = Math.ceil(width / blockSize);
  const blocksY = Math.ceil(height / blockSize);
  const bgGrid = new Float32Array(blocksX * blocksY);

  for (let by = 0; by < blocksY; by++) {
    for (let bx = 0; bx < blocksX; bx++) {
      const startX = bx * blockSize;
      const endX = Math.min(width, startX + blockSize);
      const startY = by * blockSize;
      const endY = Math.min(height, startY + blockSize);

      // In paper documents, background is the maximum/95th percentile luminance in the block
      let maxVal = 0;
      for (let y = startY; y < endY; y += 2) {
        for (let x = startX; x < endX; x += 2) {
          const val = gray[y * width + x];
          if (val > maxVal) maxVal = val;
        }
      }
      bgGrid[by * blocksX + bx] = Math.max(maxVal, 100);
    }
  }

  // Pre-calculate parameter factors
  const shadowFactor = options.shadowRemoval / 100;
  const paperCleanFactor = options.backgroundCleaning / 100;
  const inkFactor = 1 + (options.inkContrast / 100) * 1.2;
  const sharpenFactor = (options.sharpening / 100) * 0.8;
  const protectColors = options.protectColors;

  // Bilinear interpolation for smooth background subtraction
  for (let y = 0; y < height; y++) {
    const gy = y / blockSize;
    const by0 = Math.min(Math.floor(gy), blocksY - 1);
    const by1 = Math.min(by0 + 1, blocksY - 1);
    const ty = gy - by0;

    for (let x = 0; x < width; x++) {
      const gx = x / blockSize;
      const bx0 = Math.min(Math.floor(gx), blocksX - 1);
      const bx1 = Math.min(bx0 + 1, blocksX - 1);
      const tx = gx - bx0;

      // Interpolate background estimate
      const top = (1 - tx) * bgGrid[by0 * blocksX + bx0] + tx * bgGrid[by0 * blocksX + bx1];
      const btm = (1 - tx) * bgGrid[by1 * blocksX + bx0] + tx * bgGrid[by1 * blocksX + bx1];
      const bgVal = Math.max((1 - ty) * top + ty * btm, 30);

      const idx = (y * width + x) * 4;
      const r = srcData[idx];
      const g = srcData[idx + 1];
      const b = srcData[idx + 2];
      const a = srcData[idx + 3];

      const lum = gray[y * width + x];

      // Calculate normalized luminance against local estimated background (shadow removal)
      let normLum = (lum / bgVal) * 255;
      // Blend between original and shadow-flattened based on shadowRemoval slider
      let flatLum = (1 - shadowFactor) * lum + shadowFactor * normLum;

      // Paper Whitening: Gently lift near-white and light gray background to pure clean paper (255)
      if (paperCleanFactor > 0) {
        const whiteThreshold = 220 - paperCleanFactor * 50;
        if (flatLum > whiteThreshold) {
          const ratio = (flatLum - whiteThreshold) / (255 - whiteThreshold);
          flatLum = flatLum + (255 - flatLum) * (ratio * paperCleanFactor);
        }
      }

      // Ink Density Enhancement: Darken text and formulas
      if (inkFactor > 1 && flatLum < 190) {
        flatLum = Math.max(0, 190 - (190 - flatLum) * inkFactor);
      }

      // Preserve diagram colors or monochrome enhancement
      if (protectColors) {
        // Detect if pixel has meaningful color saturation
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const sat = maxC > 0 ? (maxC - minC) / maxC : 0;

        if (sat > 0.18) {
          // Color stroke (blue diagram line, red arrow, green highlight)
          const scale = flatLum / Math.max(lum, 1);
          outData[idx] = Math.min(255, Math.max(0, r * scale));
          outData[idx + 1] = Math.min(255, Math.max(0, g * scale));
          outData[idx + 2] = Math.min(255, Math.max(0, b * scale));
          outData[idx + 3] = a;
          continue;
        }
      }

      // Grayscale/Monochrome text output with clean paper background
      const finalVal = Math.min(255, Math.max(0, Math.round(flatLum)));
      outData[idx] = finalVal;
      outData[idx + 1] = finalVal;
      outData[idx + 2] = finalVal;
      outData[idx + 3] = a;
    }
  }

  // Step 2: High-pass sharpening if requested
  if (sharpenFactor > 0.05) {
    applyUnsharpSharpen(outData, width, height, sharpenFactor);
  }

  outCtx.putImageData(outImageData, 0, 0);
  return outCanvas;
}

function applyUnsharpSharpen(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  amount: number
) {
  const copy = new Uint8ClampedArray(data);

  // 3x3 Laplace sharpening kernel
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      const top = ((y - 1) * width + x) * 4;
      const btm = ((y + 1) * width + x) * 4;
      const lft = (y * width + (x - 1)) * 4;
      const rgt = (y * width + (x + 1)) * 4;

      // Sharpen luminance
      for (let c = 0; c < 3; c++) {
        const val = copy[idx + c];
        const laplacian = 4 * val - (copy[top + c] + copy[btm + c] + copy[lft + c] + copy[rgt + c]);
        data[idx + c] = Math.min(255, Math.max(0, val + laplacian * amount));
      }
    }
  }
}
