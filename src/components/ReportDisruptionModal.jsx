import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2, Building2, MapPin } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const ReportDisruptionModal = ({ isOpen, onClose }) => {
  const { buildings, addDisruption } = useAccessibility();

  const [buildingId, setBuildingId] = useState(buildings[0]?.id || '');
  const [facilityType, setFacilityType] = useState('elevator'); // 'elevator' | 'entrance' | 'ramp' | 'washroom' | 'door'
  const [severity, setSeverity] = useState('critical'); // 'critical' | 'moderate' | 'minor'
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedAlternative, setSuggestedAlternative] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    const selectedB = buildings.find(b => b.id === buildingId);

    addDisruption({
      buildingId,
      buildingName: selectedB?.name || 'Campus Building',
      title: title.trim(),
      type: facilityType,
      severity,
      location: location.trim(),
      description: description.trim() || 'Barrier reported by campus student.',
      suggestedAlternative: suggestedAlternative.trim() || 'Use nearest primary accessible corridor.',
      reportedBy: 'Student Community Report',
      estimatedResolution: 'Under Review by Dispatch',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setTitle('');
      setLocation('');
      setDescription('');
      setSuggestedAlternative('');
    }, 1600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close report barrier modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Accessibility Barrier Reported!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your report is now live on the Campus Disruption Radar. Students planning routes are being alerted automatically.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-red-100 text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h3 id="report-modal-title" className="text-lg font-black text-slate-900">
                  Report Accessibility Barrier
                </h3>
                <p className="text-xs text-slate-500">
                  Help fellow students navigate safely around sudden disruptions.
                </p>
              </div>
            </div>

            {/* Building Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Campus Building:
              </label>
              <select
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600"
              >
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>

            {/* Type & Severity Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Barrier Category:
                </label>
                <select
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value)}
                  className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600"
                >
                  <option value="elevator">Elevator Outage</option>
                  <option value="door">Power Door Malfunction</option>
                  <option value="ramp">Blocked Ramp / Walkway</option>
                  <option value="washroom">Washroom Issue</option>
                  <option value="other">Construction / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Severity:
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-red-600 font-bold"
                >
                  <option value="critical">Critical (Step-Free blocked)</option>
                  <option value="moderate">Moderate (Delay / Heavy push)</option>
                  <option value="minor">Minor (Convenience)</option>
                </select>
              </div>
            </div>

            {/* Issue Title */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Issue Summary:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Elevator 2 Stuck on Floor 3 or West Ramp Barricaded"
                className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600"
              />
            </div>

            {/* Exact Location */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Exact Location / Room / Floor:
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Near Room 204 or North East Exit Door"
                className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600"
              />
            </div>

            {/* Suggested Bypass */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Suggested Accessible Bypass / Workaround:
              </label>
              <input
                type="text"
                value={suggestedAlternative}
                onChange={(e) => setSuggestedAlternative(e.target.value)}
                placeholder="e.g. Use East Elevator C or enter through Main Sliding Portico"
                className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Publish Barrier Alert Immediately</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

