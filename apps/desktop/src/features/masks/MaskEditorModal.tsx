import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Paintbrush, Eraser, RotateCcw, Check, X, ShieldAlert } from 'lucide-react';

interface MaskEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onSaveMask: (maskDataUrl: string) => void;
}

export const MaskEditorModal: React.FC<MaskEditorModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onSaveMask,
}) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState<number>(20);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    };
  }, [isOpen, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)'; // Soft red overlay
      ctx.fillStyle = 'rgba(239, 68, 68, 0.75)';
    } else {
      ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a pure black and white mask canvas (255 = inpaint, 0 = keep)
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const expCtx = exportCanvas.getContext('2d');
    if (!expCtx) return;

    // Fill background black
    expCtx.fillStyle = '#000000';
    expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Read mask alpha from interactive canvas
    const mainCtx = canvas.getContext('2d');
    if (mainCtx) {
      const imgData = mainCtx.getImageData(0, 0, canvas.width, canvas.height);
      const expImgData = expCtx.getImageData(0, 0, exportCanvas.width, exportCanvas.height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i + 3] > 20) {
          expImgData.data[i] = 255;
          expImgData.data[i + 1] = 255;
          expImgData.data[i + 2] = 255;
          expImgData.data[i + 3] = 255;
        }
      }
      expCtx.putImageData(expImgData, 0, 0);
    }

    const maskDataUrl = exportCanvas.toDataURL('image/png');
    onSaveMask(maskDataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-qfixer-dark-card border border-qfixer-dark-border rounded-xl shadow-2xl flex flex-col w-full max-w-5xl max-h-[90vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-qfixer-dark-border bg-qfixer-dark-bg/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
              <Paintbrush className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t('workspace.mask_editor', 'ویرایشگر دستی ماسک و پاک‌سازی لکه')}</h3>
              <p className="text-xs text-slate-400">
                {t('workspace.mask_editor_desc', 'نواحی دارای لکه یا واترمارک را با قلم‌مو رنگ کنید تا بدون آسیب به متن پاک‌سازی شوند')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 bg-qfixer-dark-bg/80 border-b border-qfixer-dark-border text-sm">
          <div className="flex items-center gap-2">
            <Button
              variant={tool === 'brush' ? 'accent' : 'secondary'}
              size="sm"
              onClick={() => setTool('brush')}
              className="gap-2"
            >
              <Paintbrush className="w-4 h-4" />
              قلم‌مو (انتخاب لکه)
            </Button>
            <Button
              variant={tool === 'eraser' ? 'accent' : 'secondary'}
              size="sm"
              onClick={() => setTool('eraser')}
              className="gap-2"
            >
              <Eraser className="w-4 h-4" />
              پاک‌کن
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} className="gap-2 text-slate-400">
              <RotateCcw className="w-4 h-4" />
              پاک کردن همه
            </Button>
          </div>

          {/* Brush Size Slider */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <span className="text-xs text-slate-400">اندازه قلم:</span>
            <Slider
              min={5}
              max={80}
              step={1}
              value={brushSize}
              onChange={setBrushSize}
              className="w-32"
            />
            <span className="text-xs font-mono font-medium text-qfixer-lime">{brushSize}px</span>
          </div>
        </div>

        {/* Interactive Drawing Canvas Area */}
        <div className="relative flex-1 bg-neutral-950 overflow-auto flex items-center justify-center p-4 min-h-[400px]">
          <div className="relative max-w-full max-h-full inline-block shadow-lg border border-slate-800">
            {/* Background Original Image */}
            <img
              src={imageSrc}
              alt="Source Document"
              className="max-h-[60vh] max-w-full object-contain pointer-events-none select-none block"
            />
            {/* Interactive Drawing Layer on Top */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="absolute inset-0 w-full h-full cursor-crosshair"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-qfixer-dark-border bg-qfixer-dark-bg/60">
          <div className="flex items-center gap-2 text-xs text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <span>متون و خطوط علمی موجود در زیر لایه به کمک الگوریتم‌های Inpainting بازسازی خواهند شد.</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onClose}>
              {t('common.cancel', 'انصراف')}
            </Button>
            <Button variant="accent" onClick={handleApply} disabled={!hasDrawn} className="gap-2">
              <Check className="w-4 h-4" />
              اعمال بازسازی روی تصویر
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
