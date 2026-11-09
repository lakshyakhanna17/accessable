import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  DoorClosed, 
  ArrowUpDown, 
  Bath, 
  AlertTriangle, 
  Info, 
  Maximize2, 
  CheckCircle2, 
  Layers, 
  Search, 
  MapPin, 
  ExternalLink,
  ShieldAlert,
  Sliders,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const CampusMapViewer = ({ onSelectFacility, onSelectBuilding, onOpenRouteWithDestination }) => {
  const { buildings, facilities, disruptions, savedFacilityIds, toggleBookmark } = useAccessibility();

  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'entrance' | 'elevator' | 'washroom' | 'disrupted'
  const [activeBuildingId, setActiveBuildingId] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(facilities[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('all');

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    return facilities.filter(item => {
      // Type filter
      if (selectedFilter === 'entrance' && item.type !== 'entrance') return false;
      if (selectedFilter === 'elevator' && item.type !== 'elevator') return false;
      if (selectedFilter === 'washroom' && item.type !== 'washroom') return false;
      if (selectedFilter === 'disrupted' && item.status !== 'disrupted') return false;

      // Building filter
      if (activeBuildingId && item.buildingId !== activeBuildingId) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.title.toLowerCase().includes(query);
        const matchesBuilding = item.buildingName.toLowerCase().includes(query);
        const matchesFeatures = item.features?.some(f => f.toLowerCase().includes(query));
        if (!matchesName && !matchesBuilding && !matchesFeatures) return false;
      }

      return true;
    });
  }, [facilities, selectedFilter, activeBuildingId, searchQuery]);

  // Facilities with active disruptions
  const disruptedFacilityIds = useMemo(() => {
    return disruptions.filter(d => d.status === 'active').map(d => d.facilityId);
  }, [disruptions]);

  const activeBuildingObj = buildings.find(b => b.id === activeBuildingId);

  return (
    <div className="space-y-4">
      
      {/* Top Map Filter & Quick Search Controls */}
      <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-200/80">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          
          {/* Quick Search */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entrances, braille elevators, accessible washrooms..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Show:</span>

            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Facilities ({facilities.length})
            </button>

            <button
              onClick={() => setSelectedFilter('entrance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedFilter === 'entrance'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <DoorClosed className="w-3.5 h-3.5" />
              <span>Entrances</span>
            </button>

            <button
              onClick={() => setSelectedFilter('elevator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedFilter === 'elevator'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Elevators</span>
            </button>

            <button
              onClick={() => setSelectedFilter('washroom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedFilter === 'washroom'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
              }`}
            >
              <Bath className="w-3.5 h-3.5" />
              <span>Restrooms</span>
            </button>

            <button
              onClick={() => setSelectedFilter('disrupted')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedFilter === 'disrupted'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Active Alerts</span>
            </button>
          </div>
        </div>

        {/* Building selector pills */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-semibold text-slate-400 whitespace-nowrap">Focus Building:</span>
          <button
            onClick={() => setActiveBuildingId(null)}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeBuildingId === null ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Campus Buildings
          </button>
          {buildings.map(b => (
            <button
              key={b.id}
              onClick={() => setActiveBuildingId(activeBuildingId === b.id ? null : b.id)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeBuildingId === b.id
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{b.name}</span>
              <span className="text-[10px] opacity-75">({b.code})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Map & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* SVG Interactive Campus Map Canvas (8 cols on large screens) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-elevated border border-slate-800 text-white relative overflow-hidden flex flex-col justify-between min-h-[460px] md:min-h-[540px]">
          
          {/* Map Top Status Bar */}
          <div className="flex items-center justify-between z-10 bg-slate-800/80 backdrop-blur-md rounded-2xl px-4 py-2 border border-slate-700/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-200">
                Interactive Campus Mobility Grid
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="hidden sm:inline">Paved Step-Free Paths:</span>
              <span className="flex items-center gap-1 text-blue-400 font-medium">
                <span className="w-3 h-1 bg-blue-400 rounded-full inline-block"></span> Main Accessible Corridor
              </span>
              <span className="flex items-center gap-1 text-red-400 font-medium">
                <span className="w-3 h-1 bg-red-400 rounded-full inline-block"></span> Disruption / Closure
              </span>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative my-4 flex-1 flex items-center justify-center select-none">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full max-h-[440px] drop-shadow-2xl"
              aria-label="Interactive visual map of campus buildings and accessibility facilities"
            >
              {/* Campus Grid Background pattern */}
              <defs>
                <pattern id="campus-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5"/>
                </pattern>
                {/* Glow filter for active selections */}
                <filter id="glow-pin" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Campus Greenery Zones */}
              <rect x="0" y="0" width="100" height="100" fill="#0b1329" />
              <rect x="0" y="0" width="100" height="100" fill="url(#campus-grid)" />

              {/* Central Green Quad Lawn */}
              <path 
                d="M 35 30 Q 50 25 65 30 T 65 60 Q 50 65 35 60 Z" 
                fill="#064e3b" 
                opacity="0.35" 
                stroke="#059669"
                strokeWidth="0.4"
                strokeDasharray="1,1"
              />
              <text x="50" y="44" fill="#34d399" fontSize="2.5" textAnchor="middle" opacity="0.6" fontWeight="bold">
                CENTRAL ACCESSIBLE QUAD
              </text>

              {/* Primary Accessible Paved Walkways (Step-Free Paths) */}
              <g stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" fill="none">
                {/* North to South main promenade */}
                <path d="M 50 15 L 50 85" />
                {/* East to West promenade */}
                <path d="M 15 45 L 85 45" />
                {/* Diagonal connection to Science Complex */}
                <path d="M 50 45 L 75 35" />
                {/* Connection to Health Sciences */}
                <path d="M 50 60 L 72 75" />
                {/* Connection to Recreation Center */}
                <path d="M 50 60 L 25 78" />
              </g>

              {/* Disrupted Walkway Segments (Pulsing Red / Amber) */}
              {/* West Amphitheater Ramp closure */}
              <path 
                d="M 20 41 L 28 45" 
                stroke="#ef4444" 
                strokeWidth="2" 
                strokeDasharray="1.5,1.5" 
                fill="none" 
              />
              {/* Science East trenching */}
              <path 
                d="M 70 38 L 76 34" 
                stroke="#f59e0b" 
                strokeWidth="1.8" 
                strokeDasharray="1.5,1.5" 
                fill="none" 
              />

              {/* Campus Buildings Rendered as Architectural Blocks */}
              {buildings.map((b) => {
                const isFocused = activeBuildingId === b.id;
                return (
                  <g 
                    key={b.id} 
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => {
                      setActiveBuildingId(b.id);
                      if (onSelectBuilding) onSelectBuilding(b);
                    }}
                  >
                    {/* Building Footprint Box */}
                    <rect
                      x={b.coordinates.x - 9}
                      y={b.coordinates.y - 7}
                      width="18"
                      height="14"
                      rx="2"
                      fill={isFocused ? '#1e3a8a' : '#1e293b'}
                      stroke={isFocused ? '#60a5fa' : '#334155'}
                      strokeWidth={isFocused ? '1.2' : '0.7'}
                      className="transition-colors duration-200"
                    />

                    {/* Building Code Label */}
                    <text
                      x={b.coordinates.x}
                      y={b.coordinates.y - 1}
                      fill="#ffffff"
                      fontSize="3.2"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {b.code}
                    </text>

                    {/* Building Name Subtitle */}
                    <text
                      x={b.coordinates.x}
                      y={b.coordinates.y + 3.2}
                      fill={isFocused ? '#93c5fd' : '#94a3b8'}
                      fontSize="1.8"
                      textAnchor="middle"
                    >
                      {b.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Render Filtered Facility Pins */}
              {filteredFacilities.map((fac) => {
                const isDisrupted = fac.status === 'disrupted' || disruptedFacilityIds.includes(fac.id);
                const isSelected = selectedFacility?.id === fac.id;

                let pinColor = '#2563eb'; // blue for entrances
                if (fac.type === 'elevator') pinColor = '#9333ea';
                if (fac.type === 'washroom') pinColor = '#0d9488';
                if (isDisrupted) pinColor = '#dc2626';

                return (
                  <g
                    key={fac.id}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFacility(fac);
                      if (onSelectFacility) onSelectFacility(fac);
                    }}
                  >
                    {/* Ping ring for disrupted items */}
                    {isDisrupted && (
                      <circle
                        cx={fac.coordinates.x}
                        cy={fac.coordinates.y}
                        r="3.5"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="0.7"
                        opacity="0.8"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer marker ring */}
                    <circle
                      cx={fac.coordinates.x}
                      cy={fac.coordinates.y}
                      r={isSelected ? '3.8' : '2.8'}
                      fill={pinColor}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '1' : '0.6'}
                      filter={isSelected ? 'url(#glow-pin)' : undefined}
                    />

                    {/* Small inner indicator dot */}
                    <circle
                      cx={fac.coordinates.x}
                      cy={fac.coordinates.y}
                      r="1.1"
                      fill="#ffffff"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Bottom Quick Legend & Floor Selector */}
          <div className="z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block border border-white"></span>
                <span>Entrances</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block border border-white"></span>
                <span>Elevators</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block border border-white"></span>
                <span>Restrooms</span>
              </span>
              <span className="flex items-center gap-1.5 text-red-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block border border-white animate-pulse"></span>
                <span>Disruption Active</span>
              </span>
            </div>

            <div className="text-slate-400 text-[11px]">
              Tap any pin on the map to inspect entrance slopes, elevator capacity & specs.
            </div>
          </div>
        </div>

        {/* Selected Facility / Building Inspector Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {selectedFacility ? (
            <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-200/80 flex flex-col justify-between h-full">
              <div>
                {/* Header status badge & bookmark */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedFacility.status === 'disrupted' 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {selectedFacility.status === 'disrupted' ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        Disrupted / Alternate Recommended
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Fully Operational & Verified
                      </>
                    )}
                  </span>

                  <button
                    onClick={() => toggleBookmark(selectedFacility.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      savedFacilityIds.includes(selectedFacility.id)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-400 hover:text-slate-700'
                    }`}
                    title="Bookmark this facility"
                    aria-label="Bookmark this facility"
                  >
                    <MapPin className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Facility Title & Location */}
                <div className="mt-3">
                  <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
                    {selectedFacility.type === 'entrance' && 'Wheelchair Accessible Entrance'}
                    {selectedFacility.type === 'elevator' && 'High-Capacity Elevator'}
                    {selectedFacility.type === 'washroom' && 'Universal Restroom'}
                    {selectedFacility.type === 'quiet-room' && 'Sensory & Recharge Room'}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {selectedFacility.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedFacility.buildingName}</span> • <span>{selectedFacility.floor}</span>
                  </p>
                </div>

                {/* Key Accessibility Specs Pill Grid */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Accessibility Specifications:
                  </h4>

                  {selectedFacility.slopeGradient && (
                    <div className="flex justify-between items-center text-xs py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Ramp Slope:</span>
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {selectedFacility.slopeGradient}
                      </span>
                    </div>
                  )}

                  {selectedFacility.doorType && (
                    <div className="flex justify-between items-center text-xs py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Door Mechanism:</span>
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {selectedFacility.doorType}
                      </span>
                    </div>
                  )}

                  {selectedFacility.capacity && (
                    <div className="flex justify-between items-center text-xs py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Lift Weight Capacity:</span>
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {selectedFacility.capacity}
                      </span>
                    </div>
                  )}

                  {/* Feature checklist */}
                  <div className="pt-2">
                    <span className="text-xs text-slate-500 block mb-1.5">Confirmed Features:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedFacility.features?.map((f, i) => (
                        <span key={i} className="text-[11px] bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-md border border-blue-100">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notes / Advice */}
                  {selectedFacility.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Student Mobility Tip:</strong> {selectedFacility.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => {
                    if (onSelectFacility) onSelectFacility(selectedFacility);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Full Details</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenRouteWithDestination) onOpenRouteWithDestination(selectedFacility.buildingId);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 font-semibold text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                  title="Plan step-free route to this building"
                >
                  <span>Route Here</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-200/80 text-center flex flex-col items-center justify-center h-full text-slate-400">
              <MapPin className="w-10 h-10 mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600">Select any pin on the map</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Explore wheelchair entrances, elevator working conditions, and accessible restrooms across campus.
              </p>
            </div>
          )}

          {/* Quick Building Overview Card if building focused */}
          {activeBuildingObj && (
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Focused Building</span>
                  <h4 className="font-bold text-sm text-white">{activeBuildingObj.name}</h4>
                </div>
                <button
                  onClick={() => setActiveBuildingId(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕ Clear
                </button>
              </div>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                {activeBuildingObj.description}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-200 font-medium">
                <span>🚪 {activeBuildingObj.accessibleEntrancesCount} Entrances</span>
                <span>🛗 {activeBuildingObj.elevatorsCount} Elevators</span>
                <span>🚻 {activeBuildingObj.restroomsCount} Restrooms</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

