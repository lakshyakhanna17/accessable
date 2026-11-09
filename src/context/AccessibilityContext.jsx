import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DISRUPTIONS, INITIAL_FACILITIES, BUILDINGS, PRESET_ROUTES } from '../data/campusData';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  // Accessibility preferences
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('accessable_high_contrast') === 'true';
  });

  const [dyslexicFont, setDyslexicFont] = useState(() => {
    return localStorage.getItem('accessable_dyslexic') === 'true';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('accessable_fontsize') || 'normal'; // 'normal' | 'large' | 'xlarge'
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('accessable_reduced_motion') === 'true';
  });

  const [mobilityProfile, setMobilityProfile] = useState(() => {
    return localStorage.getItem('accessable_mobility_profile') || 'wheelchair_power';
  });

  // Disruptions list (with localStorage persistence)
  const [disruptions, setDisruptions] = useState(() => {
    const saved = localStorage.getItem('accessable_disruptions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DISRUPTIONS;
  });

  // Facilities
  const [facilities, setFacilities] = useState(INITIAL_FACILITIES);

  // Bookmarks
  const [savedFacilityIds, setSavedFacilityIds] = useState(() => {
    const saved = localStorage.getItem('accessable_saved_facilities');
    return saved ? JSON.parse(saved) : ['fac-1', 'fac-7'];
  });

  // Screen reader polite announcements
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('accessable_high_contrast', highContrast);
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('accessable_dyslexic', dyslexicFont);
    if (dyslexicFont) {
      document.body.classList.add('dyslexic-mode');
    } else {
      document.body.classList.remove('dyslexic-mode');
    }
  }, [dyslexicFont]);

  useEffect(() => {
    localStorage.setItem('accessable_fontsize', fontSize);
    document.documentElement.classList.remove('text-scale-large', 'text-scale-xlarge');
    if (fontSize === 'large') {
      document.documentElement.classList.add('text-scale-large');
    } else if (fontSize === 'xlarge') {
      document.documentElement.classList.add('text-scale-xlarge');
    }
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('accessable_reduced_motion', reducedMotion);
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion-mode');
    } else {
      document.documentElement.classList.remove('reduced-motion-mode');
    }
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('accessable_mobility_profile', mobilityProfile);
  }, [mobilityProfile]);

  useEffect(() => {
    localStorage.setItem('accessable_disruptions', JSON.stringify(disruptions));
  }, [disruptions]);

  useEffect(() => {
    localStorage.setItem('accessable_saved_facilities', JSON.stringify(savedFacilityIds));
  }, [savedFacilityIds]);

  // Announce to screen readers and optional Web Speech synthesis
  const announce = (message, speakOutLoud = false) => {
    setLiveAnnouncement(message);
    if (speakOutLoud && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Add new user-reported disruption
  const addDisruption = (newReport) => {
    const disruptionObj = {
      id: `dis-${Date.now()}`,
      confirmationsCount: 1,
      reportedTime: 'Just now',
      status: 'active',
      hasReroute: true,
      ...newReport
    };

    setDisruptions(prev => [disruptionObj, ...prev]);

    // If it corresponds to a facility, mark facility status as disrupted
    if (newReport.facilityId) {
      setFacilities(prev => prev.map(f => {
        if (f.id === newReport.facilityId) {
          return { ...f, status: 'disrupted' };
        }
        return f;
      }));
    }

    announce(`New accessibility disruption reported: ${disruptionObj.title}`);
  };

  // Confirm an existing disruption (crowdsourced verification)
  const confirmDisruption = (disruptionId) => {
    setDisruptions(prev => prev.map(d => {
      if (d.id === disruptionId) {
        return { ...d, confirmationsCount: d.confirmationsCount + 1 };
      }
      return d;
    }));
    announce("Disruption report verified. Thank you for contributing.");
  };

  // Resolve a disruption
  const resolveDisruption = (disruptionId) => {
    setDisruptions(prev => prev.map(d => {
      if (d.id === disruptionId) {
        return { ...d, status: 'resolved' };
      }
      return d;
    }));
    announce("Disruption marked as resolved.");
  };

  // Toggle bookmark
  const toggleBookmark = (facilityId) => {
    setSavedFacilityIds(prev => {
      const exists = prev.includes(facilityId);
      if (exists) {
        announce("Facility removed from saved items.");
        return prev.filter(id => id !== facilityId);
      } else {
        announce("Facility saved to your accessible favorites.");
        return [...prev, facilityId];
      }
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{
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
        disruptions,
        facilities,
        buildings: BUILDINGS,
        presetRoutes: PRESET_ROUTES,
        savedFacilityIds,
        toggleBookmark,
        addDisruption,
        confirmDisruption,
        resolveDisruption,
        announce,
        liveAnnouncement
      }}
    >
      {/* Aria Live Region for Screen Readers */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {liveAnnouncement}
      </div>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

