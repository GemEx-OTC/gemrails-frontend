"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

// Dynamic import for Leaflet to avoid SSR issues
const InteractiveMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Dynamically import Leaflet and React-Leaflet
    const loadMap = async () => {
      if (typeof window !== 'undefined') {
        // Import Leaflet CSS
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        // Wait for CSS to load
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const L = (await import('leaflet')).default
        const { MapContainer, TileLayer, Marker, Popup, Circle } = await import('react-leaflet')

        // Fix for default marker icon
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })

        setMapLoaded(true)
      }
    }

    loadMap()
  }, [])

  const locations = [
    { 
      name: "Ibadan, Nigeria", 
      position: [7.3775, 3.9470] as [number, number], 
      active: true,
      description: "Our headquarters and primary operations center"
    },
    { 
      name: "Accra, Ghana", 
      position: [5.6037, -0.1870] as [number, number], 
      active: false,
      description: "Expanding soon"
    },
    { 
      name: "Nairobi, Kenya", 
      position: [-1.2864, 36.8172] as [number, number], 
      active: false,
      description: "Coming 2026"
    },
    { 
      name: "Cape Town, South Africa", 
      position: [-33.9249, 18.4241] as [number, number], 
      active: false,
      description: "Future expansion"
    },
    { 
      name: "Cairo, Egypt", 
      position: [30.0444, 31.2357] as [number, number], 
      active: false,
      description: "Planned location"
    }
  ]

  if (!mapLoaded) {
    return (
      <div className="relative w-full h-[500px] bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // Dynamically import components after map is loaded
  const MapComponent = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) return null

    // Use dynamic import
    const { MapContainer, TileLayer, Marker, Popup, Circle } = require('react-leaflet')
    const L = require('leaflet')

    // Custom icon for active location
    const activeIcon = new L.Icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#10b981" stroke="white" stroke-width="2"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      `),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    })

    // Custom icon for inactive location
    const inactiveIcon = new L.Icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#374151" stroke="white" stroke-width="2"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      `),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    })

    return (
      <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-gray-800">
        <MapContainer
          center={[7.3775, 3.9470]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {locations.map((location, idx) => (
            <div key={idx}>
              <Marker 
                position={location.position}
                icon={location.active ? activeIcon : inactiveIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-1">{location.name}</h3>
                    <p className="text-sm text-gray-600">{location.description}</p>
                    {location.active && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Active Now
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
              
              {location.active && (
                <Circle
                  center={location.position}
                  radius={200000}
                  pathOptions={{
                    color: '#10b981',
                    fillColor: '#10b981',
                    fillOpacity: 0.1,
                    weight: 2
                  }}
                />
              )}
            </div>
          ))}
        </MapContainer>

        {/* Overlay Stats */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/90 backdrop-blur-sm border border-emerald-500/30 rounded-xl px-4 py-2 pointer-events-auto"
          >
            <div className="text-emerald-400 text-xs font-semibold">ACTIVE NOW</div>
            <div className="text-white text-lg font-bold">Ibadan, Nigeria</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-2 pointer-events-auto"
          >
            <div className="text-gray-400 text-xs font-semibold">EXPANDING TO</div>
            <div className="text-white text-lg font-bold">4 Countries</div>
          </motion.div>
        </div>

        {/* Legend */}
        <div className="absolute top-6 right-6 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl p-4 z-10">
          <div className="text-white text-sm font-semibold mb-3">Legend</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-gray-300">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-600"></div>
              <span className="text-xs text-gray-300">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <MapComponent />
}

export default InteractiveMap
