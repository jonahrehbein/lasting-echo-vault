import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, RotateCcw, Save, Trash2 } from "lucide-react";

interface VideoRecorderProps {
  onSave: (videoBlob: Blob, prompt?: string) => void;
  onDiscard: () => void;
  selectedPrompt?: string;
}

const handlePlay = (videoRef: React.RefObject<HTMLVideoElement>) => {
  if (videoRef.current?.src) {
    videoRef.current.play().catch(err => {
      console.error('Playback failed:', err);
      alert('Unable to play video.');
    });
  } else {
    alert('No video available to play.');
  }
};

export function VideoRecorder({ onSave, onDiscard, selectedPrompt }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const recorder = new MediaRecorder(mediaStream);
      recordedChunks.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setHasRecording(true);
        
        // Stop camera stream after recording
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
        }
      };

      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsMockMode(true);
      startMockCamera();
    }
  };

  const startMockCamera = () => {
    console.log('Starting mock camera mode');
    if (videoRef.current) {
      // Show a placeholder for mock recording
      videoRef.current.style.background = 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)';
      videoRef.current.style.display = 'flex';
      videoRef.current.style.alignItems = 'center';
      videoRef.current.style.justifyContent = 'center';
    }
  };

  const createMockVideoBlob = () => {
    // Create a simple mock video blob for testing
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a simple gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some text
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Mock Recording', canvas.width / 2, canvas.height / 2);
      ctx.fillText(`Duration: ${formatTime(recordingTime)}`, canvas.width / 2, canvas.height / 2 + 40);
    }
    
    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob());
      }, 'image/png');
    });
  };

  const startRecording = async () => {
    if (!isMockMode && !mediaRecorder) {
      await startCamera();
      return;
    }

    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    setHasRecording(false);
    
    if (!isMockMode && mediaRecorder) {
      mediaRecorder.start();
    }
    
    // 30-second timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) {
          stopRecording();
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const pauseRecording = () => {
    if (!isMockMode && mediaRecorder && isRecording) {
      if (isPaused) {
        mediaRecorder.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => {
            if (prev >= 30) {
              stopRecording();
              return 30;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        mediaRecorder.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = async () => {
    if (!isMockMode && mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
    
    if (isMockMode) {
      // Create mock video blob and set it up
      const mockBlob = await createMockVideoBlob();
      recordedChunks.current = [mockBlob];
      setHasRecording(true);
      
      if (videoRef.current) {
        const url = URL.createObjectURL(mockBlob);
        setVideoUrl(url);
        videoRef.current.style.background = 'none';
      }
    }
    
    setIsRecording(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setHasRecording(false);
    setVideoUrl(null);
    recordedChunks.current = [];
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (isMockMode) {
      startMockCamera();
    } else {
      startCamera(); // Restart camera
    }
  };

  const handleSave = () => {
    let videoBlob = null;
    
    if (recordedChunks.current.length > 0) {
      if (isMockMode) {
        videoBlob = new Blob(['mock video data for testing'], { type: 'video/webm' });
      } else {
        videoBlob = new Blob(recordedChunks.current, { type: 'video/webm' });
      }
    }
    
    if (!videoBlob) {
      alert('No video recorded to save.');
      return;
    }
    
    onSave(videoBlob, selectedPrompt);
  };

  const discardRecording = () => {
    setHasRecording(false);
    setVideoUrl(null);
    recordedChunks.current = [];
    onDiscard();
    if (isMockMode) {
      startMockCamera();
    } else {
      startCamera(); // Restart camera for new recording
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* Video Preview */}
      <div className="aspect-video bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border relative">
        {isMockMode && !hasRecording ? (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-lg font-semibold mb-2">Mock Camera Mode</div>
              <div className="text-sm opacity-80">Camera not available - using mock recording</div>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted={!hasRecording}
            playsInline
            controls={hasRecording}
          />
        )}
        
        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4">
            <div className="inline-flex items-center space-x-2 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-warm-pulse"></div>
              <span className="font-mono text-sm">{formatTime(recordingTime)}/00:30</span>
            </div>
          </div>
        )}

        {/* Time Limit Warning */}
        {recordingTime >= 25 && isRecording && (
          <div className="absolute top-4 right-4">
            <div className="bg-yellow-500/90 text-yellow-50 px-3 py-1 rounded-full text-sm font-medium">
              {30 - recordingTime}s left
            </div>
          </div>
        )}

        {/* Prompt Overlay during recording */}
        {(isRecording || isPaused) && selectedPrompt && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/80 text-white p-3 rounded-lg text-sm backdrop-blur-sm">
              <p className="leading-relaxed">{selectedPrompt}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {!hasRecording ? (
          // Recording Controls
          !isRecording ? (
            <Button
              size="lg"
              variant="legacy"
              onClick={startRecording}
              className="w-[90%] mx-auto h-12"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Recording
            </Button>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="lg"
                variant="warm"
                onClick={pauseRecording}
                className="h-12"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </Button>
              
              <Button
                size="lg"
                variant="destructive"
                onClick={stopRecording}
                className="h-12"
              >
                <Square className="w-5 h-5" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={resetRecording}
                className="h-12"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          )
        ) : (
          // Post-Recording Controls
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="lg"
              variant="legacy"
              onClick={handleSave}
              className="h-12"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => handlePlay(videoRef)}
              className="h-12"
            >
              <Play className="w-4 h-4 mr-2" />
              Play
            </Button>
            
            <Button
              size="lg"
              variant="destructive"
              onClick={discardRecording}
              className="h-12"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Discard
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={resetRecording}
              className="h-12"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>
        )}
      </div>

      {hasRecording && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Recording complete ({formatTime(recordingTime)})
          </p>
        </div>
      )}
    </div>
  );
}