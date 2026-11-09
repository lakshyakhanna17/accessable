import React, { useState } from 'react';
import { Header } from './components/Header';
import { CampusMapViewer } from './components/CampusMapViewer';
import { DisruptionRadar } from './components/DisruptionRadar';
import { StepFreeNavigator } from './components/StepFreeNavigator';
import { FacilityDirectory } from './components/FacilityDirectory';
import { SavedFacilitiesView } from './components/SavedFacilitiesView';
import { ReportDisruptionModal } from './components/ReportDisruptionModal';
import { EmergencyHelpModal } from './components/EmergencyHelpModal';
import { FacilityDetailModal } from './components/FacilityDetailModal';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { useAccessibility } from './context/AccessibilityContext';
import { Heart, ShieldCheck, Compass, PhoneCall } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'disruptions' | 'navigator' | 'directory' | 'saved'
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isA11yModalOpen, setIsA11yModalOpen] = useState(false);
  const [selectedFacilityForModal, setSelectedFacilityForModal] = useState(null);
  const [routeTargetDestinationId, setRouteTargetDestinationId] = useState(null);

  const { announce } = useAccessibility();

  // Navigate to route planner with building pre-selected
  const handleRouteToBuilding = (buildingId) => {
    setRouteTargetDestinationId(buildingId);
    setActiveTab('navigator');
    announce("Switched to Route Planner with your selected building as destination.");
  };

  // Navigate to route bypass from disruption card
  const handleNavigateWithReroute = (disruption) => {
    setRouteTargetDestinationId(disruption.buildingId);
    setActiveTab('navigator');
    announce(`Planning detour around ${disruption.title}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors duration-200">
      
      {/* Skip to Content for Screen Readers and Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:shadow-xl focus:font-bold"
      >
        Skip directly to main content
      </a>

      {/* Main Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenAccessibilitySettings={() => setIsA11yModalOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'map' && (
          <CampusMapViewer
            onSelectFacility={(fac) => setSelectedFacilityForModal(fac)}
            onOpenRouteWithDestination={handleRouteToBuilding}
          />
        )}

        {activeTab === 'disruptions' && (
          <DisruptionRadar
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onNavigateWithReroute={handleNavigateWithReroute}
          />
        )}

        {activeTab === 'navigator' && (
          <StepFreeNavigator
            initialDestinationId={routeTargetDestinationId}
          />
        )}

        {activeTab === 'directory' && (
          <FacilityDirectory
            onSelectFacility={(fac) => setSelectedFacilityForModal(fac)}
            onRouteToFacility={handleRouteToBuilding}
          />
        )}

        {activeTab === 'saved' && (
          <SavedFacilitiesView
            onSelectFacility={(fac) => setSelectedFacilityForModal(fac)}
            onRouteToFacility={handleRouteToBuilding}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-xs text-slate-500 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 tracking-tight text-sm">AccessAble</span>
            <span>— Inclusive Campus Mobility & Facility Navigator</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Mobility Shuttle (555) 019-RIDE</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsA11yModalOpen(true)}
              className="hover:text-blue-600 transition-colors"
            >
              Accessibility Options
            </button>
            <span>•</span>
            <span>WCAG 2.2 AAA Compliant</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportDisruptionModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <EmergencyHelpModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      <FacilityDetailModal
        facility={selectedFacilityForModal}
        onClose={() => setSelectedFacilityForModal(null)}
        onRouteToFacility={handleRouteToBuilding}
      />

      <AccessibilityToolbar
        isOpen={isA11yModalOpen}
        onClose={() => setIsA11yModalOpen(false)}
      />

    </div>
  );
}

export default App;

