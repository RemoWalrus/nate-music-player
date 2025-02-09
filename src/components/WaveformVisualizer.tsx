
import { useEffect, useRef } from "react";

interface WaveformVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  color?: string;
}

const WaveformVisualizer = ({ audioRef, color = "#333333" }: WaveformVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    // Initialize Audio Context and Analyzer
    const initializeAudioContext = () => {
      if (!audioRef.current) return;
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
      
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceNodeRef.current.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContextRef.current.destination);
    };

    const draw = () => {
      if (!canvasRef.current || !analyzerRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const bufferLength = analyzerRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyzerRef.current.getByteTimeDomainData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Style for the waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
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

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // Initialize audio context when audio starts playing
    const handlePlay = () => {
      if (!audioContextRef.current) {
        initializeAudioContext();
      }
      draw();
    };

    audioRef.current.addEventListener("play", handlePlay);

    // Handle canvas resize
    const resizeCanvas = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      if (audioRef.current) {
        audioRef.current.removeEventListener("play", handlePlay);
      }
      // Cleanup audio context and connections
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
      }
      if (analyzerRef.current) {
        analyzerRef.current.disconnect();
      }
    };
  }, [audioRef, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
};

export default WaveformVisualizer;
