import React from 'react';
import { RoomId, Animatronic } from '../types';
import { CAM_NAMES } from '../constants';

interface CameraSystemProps {
  currentCamera: RoomId;
  onSwitchCamera: (id: RoomId) => void;
  animatronics: Animatronic[];
  onClose: () => void;
}

const CameraSystem: React.FC<CameraSystemProps> = ({ 
  currentCamera, 
  onSwitchCamera, 
  animatronics,
  onClose 
}) => {

  // Get animatronics in current room
  const animatronicsInRoom = animatronics.filter(a => a.currentLocation === currentCamera);

  // Generate a distinct visual seed for the room based on ID to pick a consistent placeholder
  const roomSeed = currentCamera.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Visual effects
  const isStatic = Math.random() > 0.95; // Random heavy static flicker
  
  return (
    <div className="absolute inset-0 bg-black z-40 flex flex-col font-mono text-white select-none">
      
      {/* Camera Feed */}
      <div className="relative flex-1 bg-gray-900 overflow-hidden border-4 border-gray-800 m-2 rounded-sm">
        
        {/* The "Feed" Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-200"
          style={{
            backgroundImage: `url('https://picsum.photos/seed/${roomSeed}/800/600?grayscale&blur=2')`,
            opacity: isStatic ? 0.3 : 0.6,
            filter: 'contrast(1.5) brightness(0.6) sepia(0.5)'
          }}
        />

        {/* Static Overlay (Animated CSS in index.html, but enhanced here) */}
        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-10 mix-blend-overlay pointer-events-none bg-repeat"></div>

        {/* Animatronic Silhouettes (Simplistic representation) */}
        {animatronicsInRoom.map((a) => (
          <div 
            key={a.name}
            className="absolute transition-all duration-1000"
            style={{
              top: `${30 + (a.name.length * 5)}%`,
              left: `${20 + (a.name.length * 8)}%`,
              opacity: 0.8
            }}
          >
             {currentCamera !== RoomId.KITCHEN ? (
                 <div className="flex flex-col items-center animate-pulse">
                    {/* Glowing Eyes Effect */}
                    <div className="flex gap-2 mb-1">
                        <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_5px_2px_rgba(255,255,255,0.8)]"></div>
                        <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_5px_2px_rgba(255,255,255,0.8)]"></div>
                    </div>
                    <div className="text-4xl text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.5)] font-bold">
                        ?
                    </div>
                 </div>
             ) : (
                <div className="text-gray-400 text-sm italic font-bold">
                    (AUDIO ONLY) <br/> Clanging sounds...
                </div>
             )}
          </div>
        ))}

        {/* HUD Elements */}
        <div className="absolute top-4 left-6 text-2xl tracking-widest animate-pulse border-l-4 border-red-600 pl-2">
            • REC
        </div>
        <div className="absolute top-4 right-6 text-xl">
            {currentCamera}
        </div>
      </div>

      {/* Map Overlay & Controls */}
      <div className="absolute bottom-4 right-4 w-64 h-64 border-2 border-gray-700 bg-black/80 p-2 grid grid-cols-3 grid-rows-4 gap-1">
          {CAM_NAMES.map((cam) => (
             <button
                key={cam.id}
                onClick={() => onSwitchCamera(cam.id)}
                className={`
                    ${cam.gridPos}
                    text-[10px] leading-tight font-bold border
                    hover:bg-green-900/50 hover:border-green-500
                    transition-colors duration-75
                    flex items-center justify-center text-center p-1
                    ${currentCamera === cam.id ? 'bg-green-700 border-green-400 text-white' : 'bg-gray-900 border-gray-600 text-gray-500'}
                `}
             >
                 {cam.id}
             </button>
          ))}
          <div className="col-start-2 row-start-5 mt-2 flex justify-center">
             <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
             <span className="text-xs ml-2 text-gray-400">YOU</span>
          </div>
      </div>

       {/* Close Button */}
       <button 
         onClick={onClose}
         className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 max-w-lg h-12 bg-gray-800 border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white flex items-center justify-center group"
       >
          <span className="group-hover:scale-110 transition-transform">
             ▼ LOWER MONITOR ▼
          </span>
       </button>
    </div>
  );
};

export default CameraSystem;
