import React from 'react';
import { Snowflake, Sun, Power, ChevronUp, ChevronDown } from 'lucide-react';
import { AcMode, AcState } from '../types';

interface ControlPanelProps {
  state: AcState;
  onTogglePower: () => void;
  onSetMode: (mode: AcMode) => void;
  onChangeTemp: (delta: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  state, 
  onTogglePower, 
  onSetMode, 
  onChangeTemp 
}) => {
  
  // Smaller button sizes for better fit
  const btnBase = "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-md transform transition-all duration-150 active:scale-95 hover:scale-105 focus:outline-none border";
  
  return (
    <div className="w-full px-4">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-sm">
        
        {/* Main Controls Group */}
        <div className="flex items-center justify-center gap-4 md:gap-8">
          
          {/* Cool Mode */}
          <button
            onClick={() => onSetMode(AcMode.COOL)}
            className={`${btnBase} ${state.mode === AcMode.COOL ? 'bg-blue-500 border-blue-600 text-white ring-2 ring-blue-200' : 'bg-white border-slate-200 text-blue-400 hover:bg-blue-50'}`}
            aria-label="Cool Mode"
          >
            <Snowflake size={20} />
          </button>

          {/* Power Button - Slightly Larger */}
          <button
            onClick={onTogglePower}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-150 active:scale-95 hover:scale-105 focus:outline-none border-2 ${state.isOn ? 'bg-red-500 border-red-600 text-white shadow-red-200' : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'}`}
            aria-label="Power"
          >
            <Power size={26} strokeWidth={3} />
          </button>

          {/* Heat Mode */}
          <button
            onClick={() => onSetMode(AcMode.HEAT)}
            className={`${btnBase} ${state.mode === AcMode.HEAT ? 'bg-orange-500 border-orange-600 text-white ring-2 ring-orange-200' : 'bg-white border-slate-200 text-orange-400 hover:bg-orange-50'}`}
            aria-label="Heat Mode"
          >
            <Sun size={20} />
          </button>
        </div>

        {/* Temperature Controls - Horizontal layout for compactness */}
        <div className="flex items-center gap-3 bg-slate-100 rounded-full p-1 px-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2">Temp</span>
            <div className="flex gap-1">
                <button
                    onClick={() => onChangeTemp(-1)}
                    disabled={!state.isOn}
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm text-slate-700 transition-colors ${state.isOn ? 'hover:bg-slate-50 active:bg-slate-100' : 'opacity-50 cursor-not-allowed'}`}
                >
                    <ChevronDown size={18} />
                </button>
                
                <button
                    onClick={() => onChangeTemp(1)}
                    disabled={!state.isOn}
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm text-slate-700 transition-colors ${state.isOn ? 'hover:bg-slate-50 active:bg-slate-100' : 'opacity-50 cursor-not-allowed'}`}
                >
                    <ChevronUp size={18} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};