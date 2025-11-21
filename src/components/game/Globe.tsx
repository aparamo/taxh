'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as React from 'react';
import { useMemo, useState, useEffect, useRef } from 'react';
import { countries } from '@/game/data/countries';
import { useGameStore } from '@/game/store';
import { setSelectedCountry } from './CountrySelector';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

// Convert lat/lng to 3D coordinates on a sphere
function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Component for animated money flow arc
function MoneyFlowArc({
  from,
  to,
  progress,
  globeRadius,
  isMobile = false,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  progress: number;
  globeRadius: number;
  isMobile?: boolean;
}) {
  const curve = useMemo(() => {
    // Create a curved path between two points
    const midPoint = new THREE.Vector3()
      .addVectors(from, to)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(globeRadius * 1.2); // Slightly above globe surface

    return new THREE.QuadraticBezierCurve3(from, midPoint, to);
  }, [from, to, globeRadius]);

  // Particle position along the curve
  const particlePosition = useMemo(() => {
    return curve.getPoint(Math.min(progress, 1));
  }, [curve, progress]);

  if (progress <= 0 || progress >= 1) return null;

  // Mobile: simpler particles for performance
  const particleSize = isMobile ? 0.03 : 0.04;
  const particleSegments = isMobile ? 6 : 8;

  return (
    <group>
      {/* Particle moving along the flow */}
      <mesh position={particlePosition}>
        <sphereGeometry args={[particleSize, particleSegments, particleSegments]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={1}
        />
      </mesh>
      {/* Trail effect - only on desktop for performance */}
      {!isMobile && progress > 0.1 && (
        <mesh position={curve.getPoint(Math.max(0, progress - 0.15))}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
}

interface CountryMarkerProps {
  country: typeof countries[0];
  position: THREE.Vector3;
  isActive: boolean;
  isSelected: boolean;
}

function CountryMarker({ country, position, isActive, isSelected }: CountryMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check if any dialog is open - improved detection for country/mechanism selection dialogs
  useEffect(() => {
    const checkDialogState = () => {
      // Multiple ways to detect if a dialog is open
      // Check for Radix UI dialog overlay (data-state="open")
      const dialogOverlay = document.querySelector('[data-radix-dialog-overlay][data-state="open"]');
      const dialogContent = document.querySelector('[data-radix-dialog-content][data-state="open"]');
      
      // Also check for any element with role="dialog" that's not hidden
      const dialogElements = document.querySelectorAll('[role="dialog"]');
      const visibleDialog = Array.from(dialogElements).find(
        (el) => el.getAttribute('aria-hidden') !== 'true' && 
                el.getAttribute('data-state') !== 'closed' &&
                window.getComputedStyle(el).display !== 'none'
      );
      
      // Check for z-index indicating dialog (z-[100] or z-[101])
      const highZIndexElements = document.querySelectorAll('[class*="z-[100]"], [class*="z-[101]"]');
      const hasVisibleHighZIndex = Array.from(highZIndexElements).some(
        (el) => window.getComputedStyle(el).display !== 'none' &&
                window.getComputedStyle(el).visibility !== 'hidden' &&
                window.getComputedStyle(el).opacity !== '0'
      );
      
      // Check if CaseProgressTracker menu is expanded
      // Use data attribute for reliable detection
      const caseProgressTracker = document.querySelector('[data-case-progress-tracker="true"]');
      let isCaseProgressExpanded = false;
      
      if (caseProgressTracker) {
        // Check if it's expanded using the data attribute
        const isExpanded = caseProgressTracker.getAttribute('data-expanded') === 'true';
        
        if (isExpanded) {
          // Verify it's actually visible
          const trackerStyle = window.getComputedStyle(caseProgressTracker);
          const trackerRect = caseProgressTracker.getBoundingClientRect();
          isCaseProgressExpanded = trackerStyle.display !== 'none' &&
                                   trackerStyle.visibility !== 'hidden' &&
                                   trackerStyle.opacity !== '0' &&
                                   trackerRect.width > 0 &&
                                   trackerRect.height > 0;
        }
      }
      
      // Check if any dialog is open or CaseProgressTracker is expanded
      const isDialogOpening = !!(dialogOverlay || dialogContent || visibleDialog || hasVisibleHighZIndex || isCaseProgressExpanded);
      
      setIsDialogOpen(isDialogOpening);
      
      // If dialog just opened, reset hover state to hide tooltip immediately
      if (isDialogOpening) {
        setHovered(false);
      }
    };

    // Check immediately
    checkDialogState();

    // Watch for dialog state changes using MutationObserver
    const observer = new MutationObserver(() => {
      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(checkDialogState);
    });
    
    // Observe the document body for attribute changes
    // Include 'data-expanded' to catch CaseProgressTracker expansion/collapse
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-state', 'data-expanded', 'style', 'class', 'aria-hidden', 'aria-modal'],
      subtree: true,
      childList: true,
    });

    // Listen for click events on dialog triggers to detect when dialogs are being opened
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if clicked element or its parent is a dialog trigger button
      if (target.closest('button[aria-haspopup="dialog"]') || 
          target.closest('[data-dialog-trigger]') ||
          target.closest('[data-radix-dialog-trigger]')) {
        // Check immediately and then again after a short delay
        checkDialogState();
        setTimeout(checkDialogState, 10);
        setTimeout(checkDialogState, 50);
      }
      
      // Also check if CaseProgressTracker expand/collapse button was clicked
      if (target.closest('[data-case-progress-tracker]') || 
          target.closest('button[aria-label*="menú"]')) {
        // Check immediately and then again after a short delay
        checkDialogState();
        setTimeout(checkDialogState, 10);
        setTimeout(checkDialogState, 50);
      }
    };

    // Also check periodically as a fallback for edge cases
    // PERFORMANCE: Reduced from 10ms to 100ms to prevent performance issues
    // MutationObserver handles most cases, this is just a safety net
    const interval = setInterval(checkDialogState, 100);

    document.addEventListener('click', handleClick, true);
    // Also listen for focus events which might indicate dialog opening
    document.addEventListener('focusin', checkDialogState, true);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('focusin', checkDialogState, true);
    };
  }, []);

  const handleClick = () => {
    setSelectedCountry(country.id);
  };

  const color = isSelected ? '#10b981' : isActive ? '#22c55e' : '#3b82f6';

  // Mobile: larger hit area for easier touch interaction
  const markerSize = 0.05;
  const markerSegments = 12; // Reduced from 16 for performance
  
  return (
    <group position={position}>
      <Sphere 
        args={[markerSize, markerSegments, markerSegments]} 
        onClick={handleClick} 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.5 : isActive ? 0.3 : hovered ? 0.2 : 0}
        />
      </Sphere>
      
      {(hovered || isSelected) && (
        <Html 
          distanceFactor={10} 
          position={[0, 0.1, 0]} 
          center 
          style={{ 
            display: isDialogOpen ? 'none' : 'block',
            visibility: isDialogOpen ? 'hidden' : 'visible',
            opacity: isDialogOpen ? 0 : 1,
            pointerEvents: 'none',
            zIndex: -1,
          }}
          className="globe-country-tooltip"
        >
          <div 
            className="bg-game-background-dark border border-primary-500 rounded px-1.5 py-0.5 text-white text-base pointer-events-none whitespace-nowrap"
            style={{ 
              display: isDialogOpen ? 'none' : 'block',
              visibility: isDialogOpen ? 'hidden' : 'visible',
              opacity: isDialogOpen ? 0 : 1,
              zIndex: -1 
            }}
          >
            {country.flagEmoji} {country.name}
          </div>
        </Html>
      )}
    </group>
  );
}

// Component to track and animate money flows
function MoneyFlows({ globeRadius, isMobile = false }: { globeRadius: number; isMobile?: boolean }) {
  const transactions = useGameStore((state) => state.transactions);
  const [activeFlows, setActiveFlows] = useState<
    Array<{
      id: string;
      fromCountryId: string;
      toCountryId: string;
      amount: number;
      startTime: number;
      duration: number;
    }>
  >([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  // Track new transactions
  useEffect(() => {
    const recentTransactions = transactions
      .filter((t) => t.status === 'completed')
      .slice(-5);

    recentTransactions.forEach((tx) => {
      if (!activeFlows.find((f) => f.id === tx.id)) {
        const flow = {
          id: tx.id,
          fromCountryId: tx.sourceCountry === 'origin' ? 'bvi' : tx.sourceCountry, // Default origin
          toCountryId: tx.destinationCountry,
          amount: tx.amount,
          startTime: Date.now(),
          duration: 3000,
        };
        
        setActiveFlows((prev) => [...prev, flow]);
        setProgressMap((prev) => ({ ...prev, [tx.id]: 0 }));

        // Remove flow after animation completes
        setTimeout(() => {
          setActiveFlows((prev) => prev.filter((f) => f.id !== tx.id));
          setProgressMap((prev) => {
            const next = { ...prev };
            delete next[tx.id];
            return next;
          });
        }, 3000);
      }
    });
  }, [transactions, activeFlows]);

  // Animate progress
  useFrame(() => {
    setProgressMap((prev) => {
      const next = { ...prev };
      activeFlows.forEach((flow) => {
        const elapsed = Date.now() - flow.startTime;
        next[flow.id] = Math.min(elapsed / flow.duration, 1);
      });
      return next;
    });
  });

  const flows = useMemo(() => {
    return activeFlows.map((flow) => {
      const fromCountry = countries.find((c) => c.id === flow.fromCountryId);
      const toCountry = countries.find((c) => c.id === flow.toCountryId);

      if (!fromCountry || !toCountry) return null;

      const from = latLngToVector3(
        fromCountry.coordinates.lat,
        fromCountry.coordinates.lng,
        globeRadius
      );
      const to = latLngToVector3(
        toCountry.coordinates.lat,
        toCountry.coordinates.lng,
        globeRadius
      );

      const progress = progressMap[flow.id] || 0;

      return (
        <MoneyFlowArc
          key={flow.id}
          from={from}
          to={to}
          progress={progress}
          globeRadius={globeRadius}
          isMobile={isMobile}
        />
      );
    });
  }, [activeFlows, progressMap, globeRadius, isMobile]);

  return <>{flows.filter(Boolean)}</>;
}

// Animated Globe Sphere component
function GlobeSphere({ radius }: { radius: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = useRef(radius / 1.5);
  const currentScale = useRef(radius / 1.5);

  // Update target scale when radius changes
  useEffect(() => {
    targetScale.current = radius / 1.5;
  }, [radius]);

  // Animate scale smoothly
  useFrame(() => {
    if (meshRef.current) {
      const diff = targetScale.current - currentScale.current;
      currentScale.current += diff * 0.1; // Smooth interpolation
      meshRef.current.scale.setScalar(currentScale.current);
    }
  });

  // Mobile: lower geometry detail for performance
  const segments = 32; // Reduced from 64 for better mobile performance
  
  return (
    <Sphere ref={meshRef} args={[1.5, segments, segments]}>
      <meshStandardMaterial
        color="#1e293b"
        roughness={0.8}
        metalness={0.2}
        wireframe={false}
      />
    </Sphere>
  );
}

export function Globe() {
  const activeCountries = useGameStore((state) => state.activeCountries);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  
  // Detect mobile device
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Mobile: smaller initial size, Desktop: medium size
  const [globeRadius, setGlobeRadius] = useState(0.7);
  const [cameraDistance, setCameraDistance] = useState(3.0);
  
  // Update radius/distance when mobile state changes
  useEffect(() => {
    const initialRadius = isMobile ? 0.5 : 0.7;
    const initialDistance = isMobile ? 2.5 : 3.0;
    setGlobeRadius(initialRadius);
    setCameraDistance(initialDistance);
    setZoomLevel(0);
  }, [isMobile]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);

  // Zoom levels: Mobile has smaller range, Desktop has full range
  const zoomLevels = isMobile
    ? [
        { radius: 0.5, distance: 2.5 }, // Small (mobile default)
        { radius: 0.7, distance: 3.0 }, // Medium
        { radius: 0.9, distance: 3.5 }, // Large
      ]
    : [
        { radius: 0.7, distance: 3.0 }, // Small (desktop default)
        { radius: 1.0, distance: 3.5 }, // Medium
        { radius: 1.3, distance: 4.0 }, // Large
      ];
  const [zoomLevel, setZoomLevel] = useState(0); // Start at smallest

  // Update selected country when it changes
  useEffect(() => {
    const checkCountry = () => {
      // Get selected country from CountrySelector module
      const selected = (window as { __selectedCountry?: string | null }).__selectedCountry;
      if (selected !== selectedCountryId) {
        setSelectedCountryId(selected || null);
      }
    };
    
    // PERFORMANCE: Poll for changes with requestAnimationFrame for better performance
    // This syncs with the browser's repaint cycle instead of arbitrary intervals
    let rafId: number;
    const pollWithRaf = () => {
      checkCountry();
      rafId = requestAnimationFrame(pollWithRaf);
    };
    rafId = requestAnimationFrame(pollWithRaf);
    
    return () => cancelAnimationFrame(rafId);
  }, [selectedCountryId]);

  // Handle zoom changes
  const handleZoomIn = () => {
    if (zoomLevel < zoomLevels.length - 1) {
      const newLevel = zoomLevel + 1;
      setZoomLevel(newLevel);
      setGlobeRadius(zoomLevels[newLevel].radius);
      setCameraDistance(zoomLevels[newLevel].distance);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0) {
      const newLevel = zoomLevel - 1;
      setZoomLevel(newLevel);
      setGlobeRadius(zoomLevels[newLevel].radius);
      setCameraDistance(zoomLevels[newLevel].distance);
    }
  };

  // Create country markers
  const markers = useMemo(() => {
    return countries.map(country => {
      const position = latLngToVector3(country.coordinates.lat, country.coordinates.lng, globeRadius);
      const isActive = activeCountries.includes(country.id);
      const isSelected = selectedCountryId === country.id;
      
      return (
        <CountryMarker
          key={country.id}
          country={country}
          position={position}
          isActive={isActive}
          isSelected={isSelected}
        />
      );
    });
  }, [activeCountries, selectedCountryId, globeRadius]);

  // Handle WebGL context loss
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setWebglError('WebGL context lost. Please refresh the page.');
      console.error('WebGL context lost');
    };

    const handleContextRestored = () => {
      setWebglError(null);
      console.log('WebGL context restored');
    };

    window.addEventListener('webglcontextlost', handleContextLost);
    window.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost);
      window.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  if (webglError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-game-background-dark rounded-lg">
        <div className="text-center p-4">
          <p className="text-red-400 mb-2">{webglError}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            Recargar Página
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, cameraDistance], fov: isMobile ? 60 : 50 }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: !isMobile, // Disable antialiasing on mobile for performance
          alpha: true,
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]} // Lower DPR on mobile
        onCreated={({ gl, camera }) => {
          cameraRef.current = camera as THREE.PerspectiveCamera;
          
          // Handle WebGL context loss on canvas
          const canvas = gl.domElement;
          const handleContextLost = (event: Event) => {
            event.preventDefault();
            setWebglError('WebGL context lost. Please refresh the page.');
          };
          
          const handleContextRestored = () => {
            setWebglError(null);
          };
          
          canvas.addEventListener('webglcontextlost', handleContextLost);
          canvas.addEventListener('webglcontextrestored', handleContextRestored);

          // Set up error handling
          gl.setClearColor('#000000', 0);
          
          // Return cleanup function
          return () => {
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener('webglcontextrestored', handleContextRestored);
          };
        }}
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-game-background-dark rounded-lg">
            <div className="text-center p-4">
              <p className="text-gray-400">WebGL no está disponible en este navegador</p>
            </div>
          </div>
        }
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Earth Globe - Animated size based on zoom */}
        <GlobeSphere radius={globeRadius} />

        {/* Country Markers */}
        {markers}

        {/* Money Flow Animations */}
        <MoneyFlows globeRadius={globeRadius} isMobile={isMobile} />

        {/* Controls - Adjusted for zoom level and mobile */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={cameraDistance - 0.5}
          maxDistance={cameraDistance + 2}
          autoRotate={!isMobile} // Disable auto-rotate on mobile for better touch control
          autoRotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
          touches={{
            ONE: isMobile ? THREE.TOUCH.ROTATE : THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />
      </Canvas>
      
      {/* Zoom Controls - Larger on mobile for touch */}
      <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} flex flex-col gap-2 z-10`}>
        <Button
          onClick={handleZoomIn}
          disabled={zoomLevel >= zoomLevels.length - 1}
          size={isMobile ? 'default' : 'sm'}
          className={`bg-game-background-dark/90 border border-gray-700 hover:bg-game-background-dark text-white ${isMobile ? 'min-w-[44px] min-h-[44px]' : ''}`}
          aria-label="Acercar"
        >
          <ZoomIn className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
        </Button>
        <Button
          onClick={handleZoomOut}
          disabled={zoomLevel <= 0}
          size={isMobile ? 'default' : 'sm'}
          className={`bg-game-background-dark/90 border border-gray-700 hover:bg-game-background-dark text-white ${isMobile ? 'min-w-[44px] min-h-[44px]' : ''}`}
          aria-label="Alejar"
        >
          <ZoomOut className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
        </Button>
      </div>
      
      {/* Instructions - Hidden on mobile to save space */}
      {!isMobile && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-game-background-dark/80 px-3 py-2 rounded">
          Haz click en los países para seleccionarlos
        </div>
      )}
    </div>
  );
}
