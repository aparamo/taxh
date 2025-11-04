'use client';

import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { countries } from '@/game/data/countries';
import * as THREE from 'three';
import { getMechanismById } from '@/game/data/mechanisms';

// Convert lat/lng to 3D coordinates on a sphere
function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

interface CountryMarkerProps {
  country: typeof countries[0];
  position: THREE.Vector3;
  isSelected: boolean;
  onSelect: (countryId: string) => void;
}

function CountryMarker({ country, position, isSelected, onSelect }: CountryMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = React.useRef<THREE.Mesh>(null);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(country.id);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
  };

  const color = isSelected ? '#10b981' : hovered ? '#22c55e' : '#3b82f6';
  // Make marker larger when hovered or selected for easier clicking
  const markerSize = isSelected ? 0.08 : hovered ? 0.07 : 0.05;

  // Get mechanism names for display
  const mechanismNames = country.availableMechanisms
    .map(id => getMechanismById(id))
    .filter(Boolean)
    .map(m => m!.name)
    .slice(0, 3)
    .join(', ');

  return (
    <group position={position}>
      {/* Larger invisible hitbox for easier clicking */}
      <Sphere 
        args={[0.15, 16, 16]} 
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        visible={false}
      />
      
      {/* Visible marker */}
      <Sphere 
        ref={meshRef}
        args={[markerSize, 16, 16]} 
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0.2}
        />
      </Sphere>
      
      {/* Hover ring - always face camera */}
      {hovered && !isSelected && (
        <mesh>
          <ringGeometry args={[markerSize * 1.5, markerSize * 1.8, 32]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.3} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {(hovered || isSelected) && (
        <Html 
          distanceFactor={2.5} 
          position={[0, 0.15, 0]} 
          center
          sprite
          transform={false}
          zIndexRange={[1000, 0]}
          wrapperClass="globe-country-tooltip-wrapper"
          style={{ 
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          <div 
            className="bg-game-background-dark border border-primary-500 rounded px-3 py-2 text-white shadow-lg"
            style={{ 
              pointerEvents: 'none',
              width: '200px',
              maxWidth: '200px',
              fontSize: '12px',
              lineHeight: '1.4',
              transform: 'scale(1)',
            }}
          >
            <div className="font-bold mb-1.5 text-sm leading-tight" style={{ fontSize: '13px' }}>
              {country.flagEmoji} {country.name}
            </div>
            <div className="space-y-1 text-xs text-gray-300" style={{ fontSize: '11px' }}>
              <div className="flex justify-between gap-2">
                <span>Secreto:</span>
                <span className="font-semibold">{country.secrecyScore}/100</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Riesgo:</span>
                <span className="font-semibold">{country.riskLevel}/10</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Opacidad:</span>
                <span className="font-semibold">+{(country.opacityBonus * 100).toFixed(0)}%</span>
              </div>
              <div className="pt-1 mt-1 border-t border-gray-700">
                <div className="text-xs text-gray-400 mb-0.5" style={{ fontSize: '10px' }}>Mecanismos:</div>
                <div className="text-xs leading-tight" style={{ fontSize: '10px' }}>{mechanismNames}</div>
              </div>
              <div className="pt-1 mt-1 border-t border-gray-700 text-xs text-gray-400 italic leading-tight" style={{ fontSize: '10px' }}>
                {country.description}
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Animated Globe Sphere component
function GlobeSphere({ radius }: { radius: number }) {
  return (
    <Sphere args={[radius, 64, 64]}>
      <meshStandardMaterial
        color="#1e293b"
        roughness={0.8}
        metalness={0.2}
        wireframe={false}
      />
    </Sphere>
  );
}

interface HomeGlobeProps {
  selectedCountryId?: string | null;
  onCountrySelect?: (countryId: string | null) => void;
}

export function HomeGlobe({ selectedCountryId, onCountrySelect }: HomeGlobeProps) {
  const [globeRadius] = useState(1.0);
  const [cameraDistance] = useState(3.5);

  // Create country markers
  const markers = useMemo(() => {
    return countries.map(country => {
      const position = latLngToVector3(country.coordinates.lat, country.coordinates.lng, globeRadius);
      const isSelected = selectedCountryId === country.id;
      
      return (
        <CountryMarker
          key={country.id}
          country={country}
          position={position}
          isSelected={isSelected}
          onSelect={(id) => {
            if (onCountrySelect) {
              onCountrySelect(id === selectedCountryId ? null : id);
            }
          }}
        />
      );
    });
  }, [selectedCountryId, globeRadius, onCountrySelect]);

  return (
    <div className="w-full h-full relative min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, cameraDistance], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Earth Globe */}
        <GlobeSphere radius={globeRadius} />

        {/* Country Markers */}
        {markers}

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={cameraDistance - 0.5}
          maxDistance={cameraDistance + 2}
          autoRotate={true}
          autoRotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-game-background-dark/80 px-3 py-2 rounded">
        Haz click en los países para ver información
      </div>
    </div>
  );
}

