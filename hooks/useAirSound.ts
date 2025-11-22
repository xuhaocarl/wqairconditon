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
    const ctx = audioContextRef.current;

    const startSound = async () => {
      // Create AudioContext only when needed (on first play)
      if (!audioContextRef.current) {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContextClass) {
            console.warn("AudioContext not supported");
            return;
          }
          audioContextRef.current = new AudioContextClass();
        } catch (e) {
          console.warn("AudioContext creation failed", e);
          return;
        }
      }

      const context = audioContextRef.current;

      // Resume context if suspended (required for mobile browsers)
      if (context.state === 'suspended') {
        try {
          await context.resume();
          console.log('AudioContext resumed');
        } catch (e) {
          console.warn("Audio resume failed", e);
          return;
        }
      }

      // Stop any existing sound first
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
          sourceRef.current.disconnect();
        } catch (e) {
          // ignore
        }
      }

      // Create and start new sound
      try {
        const buffer = createBrownNoise(context);
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const gainNode = context.createGain();
        // Fade in
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 1);

        const lowPass = context.createBiquadFilter();
        lowPass.type = 'lowpass';
        lowPass.frequency.value = 400; // Muffled sound

        // Connect graph
        source.connect(lowPass);
        lowPass.connect(gainNode);
        gainNode.connect(context.destination);

        source.start();

        sourceRef.current = source;
        gainNodeRef.current = gainNode;
        lowPassRef.current = lowPass;

        console.log('Sound started successfully');
      } catch (e) {
        console.error("Error starting sound:", e);
      }
    };

    const stopSound = () => {
      if (gainNodeRef.current && sourceRef.current && ctx) {
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
              console.log('Sound stopped');
            } catch (e) {
              // ignore already stopped
            }
          }, 500);
        } catch (e) {
          console.warn("Error stopping sound", e);
        }
      }
    };

    if (isOn) {
      startSound();
    } else {
      stopSound();
    }

    // Cleanup on unmount
    return () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
          sourceRef.current.disconnect();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isOn]);

  // Cleanup AudioContext on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);
};