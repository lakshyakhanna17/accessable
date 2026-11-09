import React from 'react';
import { 
  BookmarkCheck, 
  MapPin, 
  Building2, 
  DoorClosed, 
  ArrowUpDown, 
  Bath, 
  Eye, 
  ChevronRight,
  Trash2
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const SavedFacilitiesView = ({ onSelectFacility, onRouteToFacility }) => {
  const { facilities, savedFacilityIds, toggleBookmark } = useAccessibility();

  const savedFacilities = facilities.filter(f => savedFacilityIds.includes(f.id));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-soft border border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <BookmarkCheck className="w-5 h-5" />
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            My Saved Accessible Places & Routes
          </h2>
        </div>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Quickly access your preferred entrances, elevators, and study facilities for swift day-to-day navigation across campus.
        </p>
      </div>

      {savedFacilities.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft text-slate-400">
          <BookmarkCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800">No saved facilities yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Tap the bookmark pin on any entrance, elevator, or washroom in the Campus Map or Directory to save it here for instant reference.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedFacilities.map(fac => {
            const isDisrupted = fac.status === 'disrupted';

            return (
              <div
                key={fac.id}
                className="bg-white rounded-3xl p-5 shadow-soft border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isDisrupted 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {fac.type === 'entrance' && <DoorClosed className="w-3.5 h-3.5" />}
                      {fac.type === 'elevator' && <ArrowUpDown className="w-3.5 h-3.5" />}
                      {fac.type === 'washroom' && <Bath className="w-3.5 h-3.5" />}
                      <span>{isDisrupted ? 'Disruption Active' : fac.type.toUpperCase()}</span>
                    </span>

                    <button
                      onClick={() => toggleBookmark(fac.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 mt-3">
                    {fac.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{fac.buildingName} • {fac.floor}</span>
                  </p>

                  {fac.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-600 line-clamp-2">
                      {fac.notes}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
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
                  >
                    <span>Route Here</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

