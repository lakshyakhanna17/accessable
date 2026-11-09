import React from 'react';
import { 
  X, 
  Building2, 
  DoorClosed, 
  ArrowUpDown, 
  Bath, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  Navigation,
  Compass
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const FacilityDetailModal = ({ facility, onClose, onRouteToFacility }) => {
  const { savedFacilityIds, toggleBookmark } = useAccessibility();

  if (!facility) return null;

  const isBookmarked = savedFacilityIds.includes(facility.id);
  const isDisrupted = facility.status === 'disrupted';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="facility-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Tag & Status */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isDisrupted 
              ? 'bg-red-100 text-red-800' 
              : 'bg-emerald-100 text-emerald-800'
          }`}>
            {isDisrupted ? '⚠️ Disruption in Effect' : '✓ Verified Accessible'}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Updated {facility.verifiedDate || 'Recently'}
          </span>
        </div>

        {/* Title */}
        <h3 id="facility-modal-title" className="text-xl font-extrabold text-slate-900">
          {facility.title}
        </h3>

        {/* Building & Floor */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mt-1">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>{facility.buildingName} • {facility.floor}</span>
        </div>

        {/* Specifications Breakdown */}
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Verified Architectural Specifications
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {facility.slopeGradient && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Ramp Incline</span>
                <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">{facility.slopeGradient}</span>
              </div>
            )}

            {facility.doorType && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Door Actuator</span>
                <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">{facility.doorType}</span>
              </div>
            )}

            {facility.capacity && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Weight / Capacity</span>
                <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">{facility.capacity}</span>
              </div>
            )}

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Rating</span>
              <span className="font-extrabold text-slate-800 text-sm mt-0.5 block flex items-center gap-1">
                ⭐ {facility.rating || 5.0} / 5.0
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-600 block mb-2">Verified Features:</span>
            <div className="flex flex-wrap gap-1.5">
              {facility.features?.map((f, i) => (
                <span key={i} className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-xl border border-blue-100">
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>

          {/* Tips */}
          {facility.notes && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Student Navigation Note:</strong> {facility.notes}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => toggleBookmark(facility.id)}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
              isBookmarked 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4 fill-current" />
            <span>{isBookmarked ? 'Saved in Favorites' : 'Bookmark Facility'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onRouteToFacility) onRouteToFacility(facility.buildingId);
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <Navigation className="w-4 h-4" />
            <span>Plan Step-Free Route</span>
          </button>
        </div>

      </div>
    </div>
  );
};

