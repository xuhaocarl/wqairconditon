import React, { useState, useCallback } from 'react';
import { Scene } from './components/Scene';
import { ControlPanel } from './components/ControlPanel';
import { useAirSound } from './hooks/useAirSound';
import { AcMode, AcState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AcState>({
    isOn: false,
    temp: 26,
    mode: AcMode.COOL
  });

  // Initialize audio hook
  useAirSound(state.isOn);

  const togglePower = useCallback(() => {
    setState(prev => ({ ...prev, isOn: !prev.isOn }));
  }, []);

  const setMode = useCallback((mode: AcMode) => {
    // If off, turning on via mode button feels natural, or just switch mode if on
    setState(prev => ({ ...prev, mode, isOn: true }));
  }, []);

  const changeTemp = useCallback((delta: number) => {
    setState(prev => {
      const newTemp = prev.temp + delta;
      if (newTemp < 16 || newTemp > 31) return prev; // Standard AC limits
      return { ...prev, temp: newTemp };
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-50 flex flex-col overflow-hidden font-sans selection:bg-none">

      <header className="pt-4 pb-2 shrink-0 text-center z-10 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1 tracking-tight">
          无穷大小空调 3D
        </h1>
        <p className="text-slate-500 text-xs md:text-sm">
          天冷别冻着，冬天也要照顾好自己哟
        </p>
      </header>

      {/* 3D Scene Area - Takes all available space */}
      <main className="flex-1 relative w-full min-h-0">
        <Scene acState={state} />
      </main>

      {/* UI Controls - Static position below canvas */}
      <div className="shrink-0 w-full pb-6 pt-4 bg-slate-50 z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <ControlPanel
          state={state}
          onTogglePower={togglePower}
          onSetMode={setMode}
          onChangeTemp={changeTemp}
        />
      </div>

    </div>
  );
};

export default App;