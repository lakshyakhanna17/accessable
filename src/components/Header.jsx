import React, { useState } from 'react';
import { 
  Compass, 
  AlertTriangle, 
  MapPin, 
  PhoneCall, 
  PlusCircle, 
  SlidersHorizontal, 
  Accessibility, 
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const Header = ({ 
  activeTab, 
  setActiveTab, 
  onOpenReportModal, 
  onOpenEmergencyModal,
  onOpenAccessibilitySettings
}) => {
  const { disruptions, savedFacilityIds, announce } = useAccessibility();
  const activeDisruptionsCount = disruptions.filter(d => d.status === 'active').length;

  const handleTabClick = (tabId, label) => {
    setActiveTab(tabId);
    announce(`Switched to ${label} view`);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors duration-200">
      {/* Top emergency & live alert banner if disruptions are active */}
      {activeDisruptionsCount > 0 && (
        <div 
          role="region" 
          aria-label="Active campus accessibility notice"
          className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs md:text-sm text-amber-900 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
            </span>
            <p className="font-medium truncate">
              <strong>Live Campus Notice:</strong> {activeDisruptionsCount} active accessibility disruptions reported today (elevators & exterior ramps).
            </p>
            <button
              onClick={() => handleTabClick('disruptions', 'Disruption Radar')}
              className="ml-auto underline font-semibold text-amber-950 hover:text-amber-800 shrink-0 text-xs px-2 py-0.5 rounded hover:bg-amber-100 transition-colors"
            >
              View live alerts & reroutes →
            </button>
          </div>
        </div>
      )}

      {/* Main Header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 transform hover:scale-105 transition-all">
              <Accessibility className="w-6 h-6 md:w-7 md:h-7" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  AccessAble
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 rounded-full">
                  Campus Navigator
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Step-Free Entrances • Active Elevators • Accessible Restrooms
              </p>
            </div>
          </div>

          {/* Action buttons (Report, Shuttle, Accessibility Settings) */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Quick Report Issue Button */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-all shadow-xs"
              title="Report an elevator outage, door issue, or blocked ramp"
              aria-label="Report an accessibility issue"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Report Issue</span>
            </button>

            {/* Emergency / Mobility Shuttle Button */}
            <button
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold rounded-xl bg-amber-500/10 text-amber-900 border border-amber-300/60 hover:bg-amber-500/20 transition-all shadow-xs"
              title="Campus Accessibility Shuttle & Emergency Dispatch"
              aria-label="Call Campus Mobility Shuttle or Emergency Services"
            >
              <PhoneCall className="w-4 h-4 text-amber-700" />
              <span className="hidden md:inline">Mobility Shuttle</span>
            </button>

            {/* Accessibility Quick Settings Button */}
            <button
              onClick={onOpenAccessibilitySettings}
              className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all"
              title="Adjust Contrast, Font Size, Dyslexic Mode & Preferences"
              aria-label="Open accessibility toolbar settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">A11y Toolkit</span>
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav 
          aria-label="Main Navigation" 
          className="flex space-x-1 sm:space-x-2 border-t border-slate-100 py-2 overflow-x-auto scrollbar-none"
        >
          <button
            onClick={() => handleTabClick('map', 'Campus Map')}
            className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Campus Interactive Map</span>
          </button>

          <button
            onClick={() => handleTabClick('disruptions', 'Disruption Radar')}
            className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all relative ${
              activeTab === 'disruptions'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Disruption Radar</span>
            {activeDisruptionsCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                activeTab === 'disruptions' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
              }`}>
                {activeDisruptionsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('navigator', 'Step-Free Navigator')}
            className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'navigator'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Step-Free Route Planner</span>
          </button>

          <button
            onClick={() => handleTabClick('directory', 'Facilities Directory')}
            className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'directory'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Facilities Directory</span>
          </button>

          <button
            onClick={() => handleTabClick('saved', 'Saved Facilities')}
            className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'saved'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>My Saved ({savedFacilityIds.length})</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

