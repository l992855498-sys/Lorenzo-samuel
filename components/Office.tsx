import React from 'react';
import { RoomId, Animatronic, AnimatronicName } from '../types';

interface OfficeProps {
  animatronics: Animatronic[];
  leftDoorClosed: boolean;
  rightDoorClosed: boolean;
  leftLightOn: boolean;
  rightLightOn: boolean;
  toggleLeftDoor: () => void;
  toggleRightDoor: () => void;
  toggleLeftLight: () => void;
  toggleRightLight: () => void;
  openCameras: () => void;
}

const Office: React.FC<OfficeProps> = ({
  animatronics,
  leftDoorClosed,
  rightDoorClosed,
  leftLightOn,
  rightLightOn,
  toggleLeftDoor,
  toggleRightDoor,
  toggleLeftLight,
  toggleRightLight,
  openCameras
}) => {

  // Check threats at doors
  const threatLeft = animatronics.find(a => 
    (a.name === AnimatronicName.BONNIE && a.currentLocation === RoomId.WEST_HALL_CORNER) ||
    (a.name === AnimatronicName.FOXY && a.currentLocation === RoomId.WEST_HALL_CORNER)
  );

  const threatRight = animatronics.find(a => 
    (a.name === AnimatronicName.CHICA && a.currentLocation === RoomId.EAST_HALL_CORNER) ||
    (a.name === AnimatronicName.FREDDY && a.currentLocation === RoomId.EAST_HALL_CORNER)
  );

  // Background styling based on lights
  // If light is on and threat is there, show scary silhouette
  // Else if light is on, show bright hallway
  // Else dark
  
  const renderHallway = (side: 'left' | 'right', isLightOn: boolean, threat?: Animatronic) => {
    if (!isLightOn) return 'bg-black'; // Dark

    if (threat) {
        // Scary silhouette color
        return 'bg-violet-900/50'; 
    }
    return 'bg-yellow-100/10'; // Empty lit hallway
  };

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden flex">
      
      {/* Left Side */}
      <div className={`relative w-1/6 h-full border-r-8 border-gray-800 flex flex-col items-center justify-center transition-colors duration-100 ${renderHallway('left', leftLightOn, threatLeft)}`}>
        
        {/* Door Visual */}
        <div className={`absolute top-0 w-full bg-gray-400 border-b-4 border-black transition-all duration-300 ease-out z-10 ${leftDoorClosed ? 'h-full' : 'h-0'}`}>
            <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#00000010_10px,#00000010_20px)]"></div>
        </div>

        {/* Threat Visual (Only if light is on and door is open) */}
        {leftLightOn && threatLeft && !leftDoorClosed && (
            <div className="absolute inset-0 flex items-center justify-center z-0">
                 <div className="w-32 h-64 bg-black rounded-full blur-xl opacity-80 animate-pulse transform -translate-x-4"></div>
                 <div className="absolute text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,0,0,1)]">!</div>
            </div>
        )}

        {/* Controls */}
        <div className="z-20 flex flex-col gap-4 bg-gray-800 p-2 rounded border border-gray-600 shadow-2xl">
            <button 
                onClick={toggleLeftDoor}
                className={`w-16 h-16 rounded-full border-4 font-bold text-xs shadow-[0_0_10px_rgba(0,0,0,0.8)] inset-shadow transition-all
                ${leftDoorClosed ? 'bg-red-600 border-red-800 text-white scale-95 shadow-inner' : 'bg-green-600 border-green-800 text-white hover:scale-105'}`}
            >
                DOOR
            </button>
            <button 
                onClick={toggleLeftLight}
                className={`w-16 h-16 rounded-full border-4 font-bold text-xs shadow-[0_0_10px_rgba(0,0,0,0.8)] transition-all
                ${leftLightOn ? 'bg-blue-200 border-blue-400 text-black shadow-[0_0_20px_blue]' : 'bg-gray-700 border-gray-500 text-gray-300'}`}
            >
                LIGHT
            </button>
        </div>
      </div>

      {/* Center Office View */}
      <div className="flex-1 relative bg-[url('https://picsum.photos/seed/office123/1200/800?grayscale&blur=1')] bg-cover bg-center shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]">
         <div className="absolute inset-0 bg-black/40"></div>
         
         {/* Fan (Cosmetic) */}
         <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-32 h-32 opacity-40">
             <div className="w-full h-4 bg-black absolute top-1/2 -translate-y-1/2 animate-[spin_0.2s_linear_infinite]"></div>
             <div className="w-4 h-full bg-black absolute left-1/2 -translate-x-1/2 animate-[spin_0.2s_linear_infinite]"></div>
         </div>

         {/* Monitor Trigger */}
         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1/2 h-12 z-30 group">
             <button 
                onClick={openCameras}
                className="w-full h-full bg-gray-800/80 border-2 border-gray-500 text-gray-300 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center tracking-widest"
             >
                <span className="group-hover:animate-bounce">▲ MONITOR ▲</span>
             </button>
         </div>
      </div>

      {/* Right Side */}
      <div className={`relative w-1/6 h-full border-l-8 border-gray-800 flex flex-col items-center justify-center transition-colors duration-100 ${renderHallway('right', rightLightOn, threatRight)}`}>
        
        {/* Door Visual */}
        <div className={`absolute top-0 w-full bg-gray-400 border-b-4 border-black transition-all duration-300 ease-out z-10 ${rightDoorClosed ? 'h-full' : 'h-0'}`}>
            <div className="w-full h-full bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,#00000010_10px,#00000010_20px)]"></div>
        </div>

        {/* Threat Visual */}
        {rightLightOn && threatRight && !rightDoorClosed && (
            <div className="absolute inset-0 flex items-center justify-center z-0">
                 <div className="w-32 h-64 bg-black rounded-full blur-xl opacity-80 animate-pulse transform translate-x-4"></div>
                 <div className="absolute text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,0,0,1)]">!</div>
            </div>
        )}

        {/* Controls */}
        <div className="z-20 flex flex-col gap-4 bg-gray-800 p-2 rounded border border-gray-600 shadow-2xl">
            <button 
                onClick={toggleRightDoor}
                className={`w-16 h-16 rounded-full border-4 font-bold text-xs shadow-[0_0_10px_rgba(0,0,0,0.8)] inset-shadow transition-all
                ${rightDoorClosed ? 'bg-red-600 border-red-800 text-white scale-95 shadow-inner' : 'bg-green-600 border-green-800 text-white hover:scale-105'}`}
            >
                DOOR
            </button>
            <button 
                onClick={toggleRightLight}
                className={`w-16 h-16 rounded-full border-4 font-bold text-xs shadow-[0_0_10px_rgba(0,0,0,0.8)] transition-all
                ${rightLightOn ? 'bg-blue-200 border-blue-400 text-black shadow-[0_0_20px_blue]' : 'bg-gray-700 border-gray-500 text-gray-300'}`}
            >
                LIGHT
            </button>
        </div>
      </div>

    </div>
  );
};

export default Office;
