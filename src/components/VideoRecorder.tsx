import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, RotateCcw, Save, Trash2 } from "lucide-react";

interface VideoRecorderProps {
  onSave: (videoBlob: Blob) => void;
  onDiscard: () => void;
}

export function VideoRecorder({ onSave, onDiscard }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
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
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const startRecording = async () => {
    if (!mediaRecorder) {
      await startCamera();
      return;
    }

    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    setHasRecording(false);
    
    mediaRecorder.start();
    
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
    if (mediaRecorder && isRecording) {
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

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
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
    
    startCamera(); // Restart camera
  };

  const saveRecording = () => {
    if (recordedChunks.current.length > 0) {
      const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
      onSave(blob);
    }
  };

  const discardRecording = () => {
    setHasRecording(false);
    setVideoUrl(null);
    recordedChunks.current = [];
    onDiscard();
    startCamera(); // Restart camera for new recording
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Video Preview */}
      <div className="aspect-video bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted={!hasRecording}
          playsInline
        />
        
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
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!hasRecording ? (
          // Recording Controls
          !isRecording ? (
            <Button
              size="lg"
              variant="legacy"
              onClick={startRecording}
              className="flex-1 max-w-48 h-12"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Recording
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                variant="warm"
                onClick={pauseRecording}
                className="flex-1 h-12"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </Button>
              
              <Button
                size="lg"
                variant="destructive"
                onClick={stopRecording}
                className="flex-1 h-12"
              >
                <Square className="w-5 h-5" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={resetRecording}
                className="flex-1 h-12"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </>
          )
        ) : (
          // Post-Recording Controls
          <>
            <Button
              size="lg"
              variant="legacy"
              onClick={saveRecording}
              className="flex-1 h-12"
            >
              <Save className="w-5 h-5 mr-2" />
              Save
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                if (videoRef.current) {
                  if (videoRef.current.paused) {
                    videoRef.current.play();
                  } else {
                    videoRef.current.pause();
                  }
                }
              }}
              className="flex-1 h-12"
            >
              <Play className="w-5 h-5" />
              Play
            </Button>
            
            <Button
              size="lg"
              variant="destructive"
              onClick={discardRecording}
              className="flex-1 h-12"
            >
              <Trash2 className="w-5 h-5" />
              Discard
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={resetRecording}
              className="flex-1 h-12"
            >
              <RotateCcw className="w-5 h-5" />
              New
            </Button>
          </>
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