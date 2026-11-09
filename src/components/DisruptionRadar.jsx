import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ThumbsUp, 
  ArrowRight, 
  PlusCircle, 
  Building2, 
  RefreshCw,
  Info,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const DisruptionRadar = ({ onOpenReportModal, onNavigateWithReroute }) => {
  const { disruptions, confirmDisruption, resolveDisruption, announce } = useAccessibility();
  const [filterSeverity, setFilterSeverity] = useState('all'); // 'all' | 'critical' | 'moderate'
  const [filterStatus, setFilterStatus] = useState('active'); // 'active' | 'all'
  const [confirmedIds, setConfirmedIds] = useState([]);

  // Filtered disruptions
  const filtered = disruptions.filter(item => {
    if (filterStatus === 'active' && item.status === 'resolved') return false;
    if (filterSeverity !== 'all' && item.severity !== filterSeverity) return false;
    return true;
  });

  const handleConfirm = (id, title) => {
    if (confirmedIds.includes(id)) return;
    confirmDisruption(id);
    setConfirmedIds(prev => [...prev, id]);
  };

  const handleResolve = (id, title) => {
    resolveDisruption(id);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Reporting CTA */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-300/40 rounded-3xl p-5 md:p-6 shadow-soft">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500 text-white shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Live Campus Accessibility Disruption Radar
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Crowdsourced and facilities-verified alerts for elevator outages, frozen push-buttons, construction barricades, and detour recommendations.
            </p>
          </div>

          <button
            onClick={onOpenReportModal}
            className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shrink-0 transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report New Barrier</span>
          </button>
        </div>

        {/* Filter Badges Bar */}
        <div className="mt-5 pt-4 border-t border-amber-200/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Filter Severity:</span>
            
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                filterSeverity === 'all' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white/80 text-slate-700 hover:bg-white'
              }`}
            >
              All Alerts ({disruptions.length})
            </button>

            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                filterSeverity === 'critical' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/80 text-red-700 hover:bg-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Critical Outages
            </button>

            <button
              onClick={() => setFilterSeverity('moderate')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                filterSeverity === 'moderate' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-white/80 text-amber-700 hover:bg-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Moderate Delays
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Status:</span>
            <button
              onClick={() => setFilterStatus(filterStatus === 'active' ? 'all' : 'active')}
              className="text-xs font-semibold text-blue-700 bg-white/90 px-2.5 py-1 rounded-lg hover:bg-white transition-colors border border-blue-200"
            >
              {filterStatus === 'active' ? 'Showing: Active Only' : 'Showing: Active + Resolved'}
            </button>
          </div>
        </div>
      </div>

      {/* Disruption Cards Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No disruptions found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              All reported campus facilities matching your filter are currently operational and clear of mobility barriers.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isCritical = item.severity === 'critical';
            const isResolved = item.status === 'resolved';
            const isConfirmedByUser = confirmedIds.includes(item.id);

            return (
              <div 
                key={item.id}
                className={`bg-white rounded-3xl p-5 md:p-6 shadow-soft border transition-all ${
                  isResolved 
                    ? 'border-emerald-200 opacity-75' 
                    : isCritical 
                      ? 'border-red-200 hover:border-red-300' 
                      : 'border-amber-200 hover:border-amber-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left Column: Disruption Info */}
                  <div className="space-y-2 flex-1">
                    
                    {/* Status & Severity badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isResolved ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Resolved
                        </span>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                          isCritical 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          <AlertTriangle className={`w-3.5 h-3.5 ${isCritical ? 'text-red-600' : 'text-amber-600'}`} />
                          {isCritical ? 'Critical Barrier' : 'Moderate Disruption'}
                        </span>
                      )}

                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {item.buildingName}
                      </span>

                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Reported {item.reportedTime} by <strong className="text-slate-600">{item.reportedBy}</strong>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-extrabold text-slate-900">
                      {item.title}
                    </h3>

                    {/* Exact Location */}
                    <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{item.location}</span>
                    </p>

                    {/* Description */}
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed pt-1">
                      {item.description}
                    </p>

                    {/* Suggested Alternative Detour Route */}
                    {item.suggestedAlternative && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs md:text-sm">
                        <div className="flex items-center gap-1.5 font-bold text-blue-950 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Recommended Step-Free Bypass:</span>
                        </div>
                        <p className="leading-relaxed">
                          {item.suggestedAlternative}
                        </p>
                      </div>
                    )}

                    {/* Estimated Resolution */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Estimated fix: <strong className="text-slate-700">{item.estimatedResolution}</strong></span>
                    </div>

                  </div>

                  {/* Right Column: Community actions & reroute navigation */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    
                    {/* Confirm Button */}
                    {!isResolved && (
                      <button
                        onClick={() => handleConfirm(item.id, item.title)}
                        disabled={isConfirmedByUser}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isConfirmedByUser 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
                        }`}
                        title="Confirm you have seen this disruption"
                      >
                        {isConfirmedByUser ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Confirmed ({item.confirmationsCount})</span>
                          </>
                        ) : (
                          <>
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Confirm ({item.confirmationsCount})</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Route Bypass CTA */}
                    {item.hasReroute && !isResolved && (
                      <button
                        onClick={() => {
                          if (onNavigateWithReroute) onNavigateWithReroute(item);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <span>Navigate Bypass</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Mark as resolved button */}
                    {!isResolved && (
                      <button
                        onClick={() => handleResolve(item.id, item.title)}
                        className="text-[11px] font-medium text-slate-400 hover:text-slate-700 underline py-1"
                      >
                        Mark as resolved
                      </button>
                    )}

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

