import React from 'react';
import { 
  X, 
  SlidersHorizontal, 
  Sun, 
  Moon, 
  Type, 
  Sparkles, 
  Volume2, 
  Eye, 
  RotateCcw,
  Check
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const AccessibilityToolbar = ({ isOpen, onClose }) => {
  const {
    highContrast,
    setHighContrast,
    dyslexicFont,
    setDyslexicFont,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
    mobilityProfile,
    setMobilityProfile,
    announce
  } = useAccessibility();

  if (!isOpen) return null;

  const handleReset = () => {
    setHighContrast(false);
    setDyslexicFont(false);
    setFontSize('normal');
    setReducedMotion(false);
    setMobilityProfile('wheelchair_power');
    announce("Accessibility preferences reset to default.");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-panel-title"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close accessibility toolbar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <span className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-xs">
            <SlidersHorizontal className="w-5 h-5" />
          </span>
          <div>
            <h3 id="a11y-panel-title" className="text-lg font-black text-slate-900">
              Accessibility & Display Toolkit
            </h3>
            <p className="text-xs text-slate-500">
              Personalize contrast, typography, and motion to match your needs.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* High Contrast Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="font-bold text-xs text-slate-800 block">High Contrast Mode</span>
              <span className="text-[11px] text-slate-500">Maximized visibility for low-vision users</span>
            </div>
            <button
              onClick={() => {
                setHighContrast(!highContrast);
                announce(`High contrast mode ${!highContrast ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                highContrast ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
              aria-label="Toggle high contrast mode"
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
            </button>
          </div>

          {/* Dyslexia-Friendly Font */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="font-bold text-xs text-slate-800 block">Dyslexia-Friendly Typography</span>
              <span className="text-[11px] text-slate-500">Heavy baselines & increased letter spacing</span>
            </div>
            <button
              onClick={() => {
                setDyslexicFont(!dyslexicFont);
                announce(`Dyslexia font mode ${!dyslexicFont ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                dyslexicFont ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
              aria-label="Toggle dyslexia-friendly font"
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
            </button>
          </div>

          {/* Text Size Scaling */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="font-bold text-xs text-slate-800 block mb-2">Text Scale:</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: '100% (Default)' },
                { id: 'large', label: '125% (Large)' },
                { id: 'xlarge', label: '150% (X-Large)' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setFontSize(item.id);
                    announce(`Font size set to ${item.label}`);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    fontSize === item.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="font-bold text-xs text-slate-800 block">Reduce Motion</span>
              <span className="text-[11px] text-slate-500">Disable pulsing and sliding transitions</span>
            </div>
            <button
              onClick={() => {
                setReducedMotion(!reducedMotion);
                announce(`Reduced motion ${!reducedMotion ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                reducedMotion ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
              aria-label="Toggle reduced motion"
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
            </button>
          </div>

        </div>

        {/* Reset Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

