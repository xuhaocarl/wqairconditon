import { useEffect, useRef } from 'react';

// Generates Brown Noise which sounds like a low rumble/fan
const createBrownNoise = (audioContext: AudioContext) => {
  const bufferSize = audioContext.sampleRate * 2; // 2 seconds buffer
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5; // Compensate for gain
  }
  return buffer;
};

export const useAirSound = (isOn: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const lowPassRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass();
          }
        } catch (e) {
          console.warn("AudioContext not supported or blocked", e);
        }
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
            audioContextRef.current.close();
        } catch(e) {
            // ignore
        }
      }
    };
  }, []);

  useEffect(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (isOn) {
      // Resume context if suspended (browser policy)
      if (ctx.state === 'suspended') {
        ctx.resume().catch(e => console.warn("Audio resume failed", e));
      }

      // Create nodes
      try {
        const buffer = createBrownNoise(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const gainNode = ctx.createGain();
        // Fade in
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1);

        const lowPass = ctx.createBiquadFilter();
        lowPass.type = 'lowpass';
        lowPass.frequency.value = 400; // Muffled sound

        // Connect graph
        source.connect(lowPass);
        lowPass.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        source.start();

        sourceRef.current = source;
        gainNodeRef.current = gainNode;
        lowPassRef.current = lowPass;
      } catch (e) {
        console.error("Error starting sound:", e);
      }

    } else {
      // Stop sound with fade out
      if (gainNodeRef.current && sourceRef.current) {
        try {
            const gain = gainNodeRef.current;
            const source = sourceRef.current;
            
            gain.gain.cancelScheduledValues(ctx.currentTime);
            gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
            
            setTimeout(() => {
                try {
                    source.stop();
                    source.disconnect();
                } catch (e) {
                    // ignore already stopped
                }
            }, 500);
        } catch(e) {
             console.warn("Error stopping sound", e);
        }
      }
    }
  }, [isOn]);
};