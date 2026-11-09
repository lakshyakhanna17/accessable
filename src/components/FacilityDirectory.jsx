import React, { useState, useMemo } from 'react';
import { 
  Search, 
  DoorClosed, 
  ArrowUpDown, 
  Bath, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  SlidersHorizontal, 
  Star, 
  Info, 
  Eye, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const FacilityDirectory = ({ onSelectFacility, onRouteToFacility }) => {
  const { facilities, buildings, savedFacilityIds, toggleBookmark } = useAccessibility();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'entrance' | 'elevator' | 'washroom'
  const [selectedBuildingId, setSelectedBuildingId] = useState('all');
  const [featureFilter, setFeatureFilter] = useState('all'); // 'all' | 'automatic' | 'braille' | 'single'

  const filtered = useMemo(() => {
    return facilities.filter(item => {
      // Type
      if (selectedType !== 'all' && item.type !== selectedType) return false;

      // Building
      if (selectedBuildingId !== 'all' && item.buildingId !== selectedBuildingId) return false;

      // Feature specific filter
      if (featureFilter === 'automatic') {
        const isAuto = item.doorType?.toLowerCase().includes('auto') || 
                       item.features?.some(f => f.toLowerCase().includes('auto'));
        if (!isAuto) return false;
      }
      if (featureFilter === 'braille') {
        const hasBraille = item.features?.some(f => f.toLowerCase().includes('braille'));
        if (!hasBraille) return false;
      }
      if (featureFilter === 'single') {
        const isSingle = item.features?.some(f => f.toLowerCase().includes('single'));
        if (!isSingle) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesBuilding = item.buildingName.toLowerCase().includes(q);
        const matchesRoom = item.roomNumber?.toLowerCase().includes(q);
        const matchesFeature = item.features?.some(f => f.toLowerCase().includes(q));
        if (!matchesTitle && !matchesBuilding && !matchesRoom && !matchesFeature) return false;
      }

      return true;
    });
  }, [facilities, selectedType, selectedBuildingId, featureFilter, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Directory Filter & Search Header */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-soft border border-slate-200/80 space-y-4">
        
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Campus Accessible Facilities Directory
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Browse verified wheelchair entrances with slope ratings, auditory/braille elevators, and universal single-stall washrooms.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by facility name, room number, or accessibility feature (e.g., 'power slider', 'changing bench')..."
            className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-blue-600 transition-all text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          
          {/* Facility Type Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Facility Type:
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-800"
            >
              <option value="all">All Facility Types ({facilities.length})</option>
              <option value="entrance">🚪 Accessible Entrances</option>
              <option value="elevator">🛗 High-Capacity Elevators</option>
              <option value="washroom">🚻 Universal Restrooms</option>
            </select>
          </div>

          {/* Building Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Building:
            </label>
            <select
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-800"
            >
              <option value="all">All Buildings</option>
              {buildings.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>

          {/* Specific Feature Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Specialized Feature:
            </label>
            <select
              value={featureFilter}
              onChange={(e) => setFeatureFilter(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-800"
            >
              <option value="all">Any Features</option>
              <option value="automatic">⚡ Automated Power Openers</option>
              <option value="braille">⠿ Braille & Audio Assist</option>
              <option value="single">🔒 Single-Occupancy / Universal</option>
            </select>
          </div>

        </div>

      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft text-slate-400">
            <Filter className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-700">No facilities match your active filters</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing some filter criteria or searching for different keywords.</p>
          </div>
        ) : (
          filtered.map(fac => {
            const isBookmarked = savedFacilityIds.includes(fac.id);
            const isDisrupted = fac.status === 'disrupted';

            return (
              <div
                key={fac.id}
                className="bg-white rounded-3xl p-5 shadow-soft border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Card Header: Type badge & bookmark */}
                  <div className="flex items-start justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isDisrupted 
                        ? 'bg-red-100 text-red-800' 
                        : fac.type === 'entrance' 
                          ? 'bg-blue-100 text-blue-800' 
                          : fac.type === 'elevator' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-teal-100 text-teal-800'
                    }`}>
                      {fac.type === 'entrance' && <DoorClosed className="w-3.5 h-3.5" />}
                      {fac.type === 'elevator' && <ArrowUpDown className="w-3.5 h-3.5" />}
                      {fac.type === 'washroom' && <Bath className="w-3.5 h-3.5" />}
                      <span>
                        {isDisrupted ? 'Disruption Active' : fac.type.toUpperCase()}
                      </span>
                    </span>

                    <button
                      onClick={() => toggleBookmark(fac.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isBookmarked 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-slate-100 text-slate-400 hover:text-slate-700'
                      }`}
                      title={isBookmarked ? 'Remove from saved' : 'Save to favorites'}
                    >
                      <MapPin className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Title & Building */}
                  <h3 className="font-extrabold text-base text-slate-900 mt-3 group-hover:text-blue-600 transition-colors">
                    {fac.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{fac.buildingName} • {fac.floor}</span>
                  </p>

                  {/* Room / Location */}
                  {fac.roomNumber && (
                    <div className="mt-1 text-[11px] font-semibold text-slate-600">
                      Location: <span className="bg-slate-100 px-1.5 py-0.5 rounded">{fac.roomNumber}</span>
                    </div>
                  )}

                  {/* Slope or door info */}
                  {fac.slopeGradient && (
                    <div className="mt-2 text-xs text-slate-600">
                      <strong className="text-slate-700">Slope:</strong> {fac.slopeGradient}
                    </div>
                  )}

                  {fac.doorType && (
                    <div className="mt-1 text-xs text-slate-600">
                      <strong className="text-slate-700">Door:</strong> {fac.doorType}
                    </div>
                  )}

                  {/* Feature Pills */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {fac.features?.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        ✓ {f}
                      </span>
                    ))}
                    {fac.features?.length > 3 && (
                      <span className="text-[10px] font-bold text-slate-400 self-center">
                        +{fac.features.length - 3} more
                      </span>
                    )}
                  </div>

                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectFacility(fac)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Specs</span>
                  </button>

                  <button
                    onClick={() => onRouteToFacility(fac.buildingId)}
                    className="py-2 px-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold text-xs flex items-center justify-center gap-1 transition-colors shadow-xs"
                    title="Plan route to this facility"
                  >
                    <span>Route</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

