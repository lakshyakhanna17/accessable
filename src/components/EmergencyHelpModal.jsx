import React from 'react';
import { X, PhoneCall, ShieldCheck, Car, HelpCircle, ExternalLink } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/campusData';

export const EmergencyHelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close mobility assistance modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <span className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-sm">
            <PhoneCall className="w-5 h-5" />
          </span>
          <div>
            <h3 id="emergency-modal-title" className="text-xl font-black text-slate-900">
              Campus Mobility Assistance & Dispatch
            </h3>
            <p className="text-xs text-slate-500">
              24/7 on-demand accessible escorts, shuttle rides, and lift emergencies.
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          {EMERGENCY_CONTACTS.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  {item.hours}
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <a
                href={`tel:${item.number.replace(/\D/g, '')}`}
                className="shrink-0 px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {item.number}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
          <strong>Need an urgent accessible ride between classes?</strong> The Campus Mobility Shuttle provides door-to-door accessible cart transport across all quads. Request 10-15 minutes prior to class change.
        </div>

      </div>
    </div>
  );
};
