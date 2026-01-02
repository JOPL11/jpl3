// components/FooterEngine.jsx
'use client';

import { useState, useEffect } from 'react';
import EnergyFlowLine from './EnergyFlowLine';
export default function FooterEngine() {
  const [pulsesReceived, setPulsesReceived] = useState(0);
  const [engineVisible, setEngineVisible] = useState(false);
  
  // When pulses hit the footer
  const handlePulseComplete = () => {
    setPulsesReceived(prev => {
      const newCount = prev + 1;
      if (newCount >= 3 && !engineVisible) {
        // After 3 pulses, reveal the engine
        setTimeout(() => setEngineVisible(true), 500);
      }
      return newCount;
    });
  };
  
  // Reset pulses after some time
  useEffect(() => {
    const timer = setInterval(() => {
      if (pulsesReceived > 0) {
        setPulsesReceived(prev => Math.max(0, prev - 1));
      }
    }, 10000); // Decay pulses every 10 seconds
    
    return () => clearInterval(timer);
  }, [pulsesReceived]);

  return (
    <>
      {/* Energy lines flowing into footer */}
      <EnergyFlowLine
        startSelector="#hero"
        endSelector="footer"
        speed={3}
        onPulseComplete={handlePulseComplete}
      />
      
      <EnergyFlowLine
        startSelector="#projects"
        endSelector="footer"
        speed={3.5}
        delay={1}
        onPulseComplete={handlePulseComplete}
      />
      
      <EnergyFlowLine
        startSelector="#contact"
        endSelector="footer"
        speed={4}
        delay={2}
        onPulseComplete={handlePulseComplete}
      />
      
      {/* Footer with hidden engine */}
      <footer className="relative bg-black/20 border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="text-white/40 text-sm">
            © {new Date().getFullYear()} Your Name
          </div>
          
          {/* Hidden engine - revealed by pulses */}
          <div className={`mt-8 transition-all duration-1000 ${
            engineVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10 pointer-events-none'
          }`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div 
                    key={i}
                    className="w-1 h-4 bg-blue-400/30 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="text-blue-300/60 text-sm font-mono">
                System active • {pulsesReceived} connections
              </span>
            </div>
            
            {/* More engine details could appear here */}
            {engineVisible && (
              <div className="mt-4 text-white/30 text-xs font-mono">
                <div className="flex gap-6">
                  <div>◉ Core v1.0.3</div>
                  <div>◉ 128-bit encryption</div>
                  <div>◉ Zero latency</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Subtle hint when engine is hidden */}
          {!engineVisible && pulsesReceived > 0 && (
            <div className="mt-4 text-white/20 text-xs">
              {pulsesReceived} of 3 pulses received...
            </div>
          )}
        </div>
        
        {/* Visual engine representation */}
        {engineVisible && (
          <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse" />
          </div>
        )}
      </footer>
    </>
  );
}