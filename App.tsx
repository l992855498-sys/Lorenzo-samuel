import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GameState, 
  RoomId, 
  AnimatronicName, 
  INITIAL_POWER, 
  POWER_DRAIN_RATE_MS, 
  HOUR_LENGTH_MS 
} from './types';
import { INITIAL_ANIMATRONICS, ADJACENCY_MAP } from './constants';
import CameraSystem from './components/CameraSystem';
import Office from './components/Office';
import { generatePhoneMessage } from './services/geminiService';

// Sound effect simulation (visual only for this implementation)
const playSound = (type: string) => {
  console.log(`[Audio] ${type}`);
};

const App: React.FC = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    isVictory: false,
    hour: 12,
    power: INITIAL_POWER,
    usage: 1,
    camerasOpen: false,
    currentCamera: RoomId.STAGE,
    leftDoorClosed: false,
    rightDoorClosed: false,
    leftLightOn: false,
    rightLightOn: false,
    animatronics: JSON.parse(JSON.stringify(INITIAL_ANIMATRONICS)), // Deep copy
    jumpscare: null,
    phoneMessage: null
  });

  const [loadingMessage, setLoadingMessage] = useState(false);

  // Refs for interval management to avoid closure staleness
  const stateRef = useRef(gameState);
  useEffect(() => { stateRef.current = gameState; }, [gameState]);

  // Start Game Handler
  const startGame = async () => {
    setLoadingMessage(true);
    const message = await generatePhoneMessage();
    setLoadingMessage(false);

    setGameState({
      isPlaying: true,
      isGameOver: false,
      isVictory: false,
      hour: 12,
      power: INITIAL_POWER,
      usage: 1,
      camerasOpen: false,
      currentCamera: RoomId.STAGE,
      leftDoorClosed: false,
      rightDoorClosed: false,
      leftLightOn: false,
      rightLightOn: false,
      animatronics: JSON.parse(JSON.stringify(INITIAL_ANIMATRONICS)),
      jumpscare: null,
      phoneMessage: message
    });
  };

  // --- GAME LOOP ---
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver || gameState.isVictory) return;

    // 1. Clock Timer
    const clockInterval = setInterval(() => {
      setGameState(prev => {
        const nextHour = prev.hour === 12 ? 1 : prev.hour + 1;
        if (prev.hour === 5) { // 5 -> 6 AM Victory
           return { ...prev, isVictory: true, isPlaying: false };
        }
        return { ...prev, hour: nextHour };
      });
    }, HOUR_LENGTH_MS);

    // 2. Power Drain Timer
    const powerInterval = setInterval(() => {
      setGameState(prev => {
        if (prev.power <= 0) return { ...prev, power: 0 }; // Power outage logic handled in tick
        
        let usage = 1; // Base usage (fan/terminal)
        if (prev.leftDoorClosed) usage++;
        if (prev.rightDoorClosed) usage++;
        if (prev.leftLightOn) usage++;
        if (prev.rightLightOn) usage++;
        if (prev.camerasOpen) usage++;

        const drainAmount = usage * 0.2; // roughly 0.2% to 1% per tick
        const newPower = Math.max(0, prev.power - drainAmount);
        
        return { ...prev, power: newPower, usage };
      });
    }, POWER_DRAIN_RATE_MS / 2); // Update faster for smooth drain feel

    // 3. AI Movement & Logic Tick (Every 4 seconds approx)
    const aiInterval = setInterval(() => {
       handleAiMovement();
    }, 4000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(powerInterval);
      clearInterval(aiInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.isPlaying, gameState.isGameOver, gameState.isVictory]);

  // Handle AI Movement
  const handleAiMovement = () => {
      const current = stateRef.current;
      if (current.power <= 0) {
          // Freddy kills you if power is out (simplified)
          triggerJumpscare(AnimatronicName.FREDDY);
          return;
      }

      const newAnimatronics = current.animatronics.map(animatronic => {
          // Random chance based on aggression
          const roll = Math.floor(Math.random() * 20) + 1;
          if (roll <= animatronic.aggressionLevel) {
              // Move logic
              return moveAnimatronic(animatronic, current);
          }
          return animatronic;
      });

      // Check for jumpscares immediately after movement
      newAnimatronics.forEach(a => {
         if (a.currentLocation === RoomId.OFFICE) {
             // If they are in the office, check doors
             let blocked = false;
             if (a.name === AnimatronicName.BONNIE || a.name === AnimatronicName.FOXY) {
                 if (current.leftDoorClosed) {
                     blocked = true;
                     a.currentLocation = RoomId.DINING; // Reset position
                     playSound("Bang on door");
                 }
             } else {
                 if (current.rightDoorClosed) {
                     blocked = true;
                     a.currentLocation = RoomId.DINING; // Reset position
                     playSound("Bang on door");
                 }
             }

             if (!blocked) {
                 triggerJumpscare(a.name);
             }
         }
      });

      setGameState(prev => ({ ...prev, animatronics: newAnimatronics }));
  };

  const moveAnimatronic = (animatronic: typeof INITIAL_ANIMATRONICS[0], currentState: GameState) => {
      const possibleMoves = ADJACENCY_MAP[animatronic.currentLocation];
      if (!possibleMoves || possibleMoves.length === 0) return animatronic;

      // Simple AI: Prefer moving towards office (higher index in map roughly?)
      // Actually just random for chaos in this simple version, but respect adjacency
      const nextRoom = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      
      return { ...animatronic, currentLocation: nextRoom };
  };

  const triggerJumpscare = (name: AnimatronicName) => {
      setGameState(prev => ({
          ...prev,
          isGameOver: true,
          isPlaying: false,
          jumpscare: name
      }));
      playSound("SCREAM");
  };

  // --- CONTROLS ---

  const toggleLeftDoor = () => {
      if (gameState.power <= 0) return;
      setGameState(prev => ({ ...prev, leftDoorClosed: !prev.leftDoorClosed }));
      playSound("Door toggle");
  };
  const toggleRightDoor = () => {
      if (gameState.power <= 0) return;
      setGameState(prev => ({ ...prev, rightDoorClosed: !prev.rightDoorClosed }));
      playSound("Door toggle");
  };
  const toggleLeftLight = () => {
      if (gameState.power <= 0) return;
      setGameState(prev => ({ ...prev, leftLightOn: !prev.leftLightOn, rightLightOn: false })); // Exclusive lights often used
  };
  const toggleRightLight = () => {
      if (gameState.power <= 0) return;
      setGameState(prev => ({ ...prev, rightLightOn: !prev.rightLightOn, leftLightOn: false }));
  };
  const toggleCameraSystem = () => {
      if (gameState.power <= 0) return;
      setGameState(prev => ({ ...prev, camerasOpen: !prev.camerasOpen, leftLightOn: false, rightLightOn: false }));
  };
  const switchCamera = (id: RoomId) => {
      setGameState(prev => ({ ...prev, currentCamera: id }));
  };

  // --- RENDER ---

  if (loadingMessage) {
      return (
          <div className="w-full h-screen bg-black flex items-center justify-center text-white font-mono">
              <div className="text-center">
                  <h2 className="text-2xl mb-4 animate-pulse">CONNECTING TO SECURE SERVER...</h2>
                  <p className="text-gray-500">Generating Night Protocols...</p>
              </div>
          </div>
      );
  }

  // Main Menu
  if (!gameState.isPlaying && !gameState.isGameOver && !gameState.isVictory) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        {/* Scanlines handled in CSS global */}
        <div className="scanlines"></div>
        <div className="crt-flicker"></div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          FIVE NIGHTS<br/>AT GEMINI'S
        </h1>
        
        <div className="flex flex-col gap-4 z-10">
            <button 
                onClick={startGame}
                className="text-2xl text-white border-2 border-white px-8 py-2 hover:bg-white hover:text-black transition-colors font-mono"
            >
                NEW GAME
            </button>
            <div className="text-gray-500 text-sm max-w-md text-center mt-4">
                WARNING: This game contains flashing lights, loud noises, and jumpscares.
            </div>
        </div>

        {/* Glitchy Freddie placeholder */}
        <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none grayscale">
             <img src="https://picsum.photos/400/600?grayscale" alt="Anamatronic" className="mix-blend-lighten" />
        </div>
      </div>
    );
  }

  // Game Over / Jumpscare
  if (gameState.isGameOver) {
      return (
          <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?grayscale&contrast=2')] bg-cover bg-center animate-pulse scale-110"></div>
              <div className="z-10 text-center">
                  <h1 className="text-red-600 text-9xl font-black animate-bounce drop-shadow-[0_0_30px_rgba(255,0,0,1)]">
                      GAME OVER
                  </h1>
                  <p className="text-white text-2xl mt-4 font-mono uppercase">
                      Killed by {gameState.jumpscare}
                  </p>
                  <button 
                    onClick={() => setGameState(prev => ({ ...prev, isGameOver: false, isPlaying: false }))}
                    className="mt-8 text-white underline hover:text-red-500"
                  >
                      Try Again
                  </button>
              </div>
          </div>
      );
  }

  // Victory
  if (gameState.isVictory) {
      return (
          <div className="w-full h-screen bg-black flex items-center justify-center text-white">
              <div className="text-center animate-fade-in-up">
                  <h1 className="text-6xl font-bold mb-4">6:00 AM</h1>
                  <p className="text-xl text-green-400">You survived the night.</p>
                  <button 
                    onClick={() => setGameState(prev => ({ ...prev, isVictory: false, isPlaying: false }))}
                    className="mt-8 border border-white px-6 py-2 hover:bg-white hover:text-black"
                  >
                      Main Menu
                  </button>
              </div>
          </div>
      );
  }

  // Active Game Interface
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden text-white font-mono select-none">
       <div className="scanlines"></div>
       <div className="crt-flicker"></div>

       {/* HUD: Top Right Clock */}
       <div className="absolute top-4 right-6 z-30 text-right">
           <div className="text-4xl font-bold">{gameState.hour === 0 ? '12' : gameState.hour} AM</div>
           <div className="text-lg text-gray-400">Night 1</div>
       </div>

       {/* HUD: Bottom Left Power */}
       <div className="absolute bottom-4 left-6 z-30">
           <div className="text-xl mb-1">Power left: {Math.floor(gameState.power)}%</div>
           <div className="flex items-center gap-1">
               <span>Usage:</span>
               <div className="flex gap-1">
                   {[1,2,3,4,5].map(i => (
                       <div 
                         key={i} 
                         className={`w-4 h-6 border border-gray-500 ${gameState.usage >= i ? (gameState.usage > 3 ? 'bg-red-500' : 'bg-green-500') : 'bg-transparent'}`}
                       />
                   ))}
               </div>
           </div>
       </div>

       {/* Phone Message Overlay (Temporary) */}
       {gameState.phoneMessage && gameState.hour === 12 && (
           <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/80 border border-green-800 p-4 max-w-lg text-green-500 text-sm leading-tight shadow-[0_0_20px_rgba(0,255,0,0.2)]">
               <div className="font-bold mb-1 uppercase text-xs tracking-widest border-b border-green-900 pb-1">Incoming Message...</div>
               <p>"{gameState.phoneMessage}"</p>
               <button 
                 className="mt-2 text-xs text-gray-500 hover:text-white"
                 onClick={() => setGameState(prev => ({ ...prev, phoneMessage: null }))}
               >
                   [MUTE CALL]
               </button>
           </div>
       )}

       {/* Main View */}
       <Office 
          animatronics={gameState.animatronics}
          leftDoorClosed={gameState.leftDoorClosed}
          rightDoorClosed={gameState.rightDoorClosed}
          leftLightOn={gameState.leftLightOn}
          rightLightOn={gameState.rightLightOn}
          toggleLeftDoor={toggleLeftDoor}
          toggleRightDoor={toggleRightDoor}
          toggleLeftLight={toggleLeftLight}
          toggleRightLight={toggleRightLight}
          openCameras={toggleCameraSystem}
       />

       {/* Camera Overlay */}
       {gameState.camerasOpen && (
           <CameraSystem 
               currentCamera={gameState.currentCamera}
               onSwitchCamera={switchCamera}
               animatronics={gameState.animatronics}
               onClose={toggleCameraSystem}
           />
       )}

       {/* Power Outage Effect Overlay */}
       {gameState.power <= 0 && (
           <div className="absolute inset-0 bg-black/95 z-50 flex items-center justify-center pointer-events-none">
               {/* Just scary eyes in the dark */}
               <div className="animate-pulse">
                   <div className="flex gap-4">
                       <div className="w-2 h-2 bg-blue-300 rounded-full shadow-[0_0_10px_5px_rgba(100,200,255,0.5)]"></div>
                       <div className="w-2 h-2 bg-blue-300 rounded-full shadow-[0_0_10px_5px_rgba(100,200,255,0.5)]"></div>
                   </div>
               </div>
               {/* Audio simulation: Freddy music box would play here */}
           </div>
       )}
    </div>
  );
};

export default App;
