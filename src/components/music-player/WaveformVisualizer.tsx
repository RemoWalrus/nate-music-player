
import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const WaveformVisualizer = ({ audioRef }: WaveformVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    const initializeAudioContext = () => {
      if (!audioRef.current) return;
      
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      // Create analyzer node if it doesn't exist
      if (!analyzerRef.current) {
        analyzerRef.current = audioContextRef.current.createAnalyser();
        analyzerRef.current.fftSize = 256;
        
        // Connect audio element to analyzer
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyzerRef.current);
        analyzerRef.current.connect(audioContextRef.current.destination);
      }
    };

    const draw = () => {
      if (!canvasRef.current || !analyzerRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyzerRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyzerRef.current.getByteFrequencyData(dataArray);

      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set line style
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    const handlePlay = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      initializeAudioContext();
      draw();
    };

    const handlePause = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full rounded-2xl pointer-events-none"
      width={320}
      height={320}
    />
  );
};

export default WaveformVisualizer;
