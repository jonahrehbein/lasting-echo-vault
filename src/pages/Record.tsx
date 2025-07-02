import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Play, Pause, Square, RotateCcw, Heart, MessageCircle, Clock } from "lucide-react";

const recordingPrompts = [
  {
    icon: Heart,
    title: "Share Your Love",
    prompt: "Tell them what they mean to you and how they've shaped your life."
  },
  {
    icon: MessageCircle,
    title: "Life Lessons",
    prompt: "What wisdom would you want them to carry forward?"
  },
  {
    icon: Clock,
    title: "Cherished Memories",
    prompt: "Share a favorite memory you have together."
  }
];

export default function Record() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState("00:00");

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime("00:00");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold text-foreground text-center">
            Create Your Message
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Share what matters most
          </p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Video Preview Card */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border mb-4">
              <div className="text-center">
                <Video className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {isRecording ? "Recording in progress..." : "Camera preview"}
                </p>
                {isRecording && (
                  <div className="mt-4">
                    <div className="inline-flex items-center space-x-2 bg-destructive/10 text-destructive px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-destructive rounded-full animate-warm-pulse"></div>
                      <span className="font-mono text-sm">{recordingTime}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center gap-3">
              {!isRecording ? (
                <Button
                  size="lg"
                  variant="legacy"
                  onClick={handleStartRecording}
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
                    onClick={handlePauseRecording}
                    className="flex-1 h-12"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={handleStopRecording}
                    className="flex-1 h-12"
                  >
                    <Square className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleStopRecording}
                    className="flex-1 h-12"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selected Prompt Display */}
        {selectedPrompt !== null && (
          <Card className="bg-primary/5 border-primary/20 shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                  {(() => {
                    const IconComponent = recordingPrompts[selectedPrompt].icon;
                    return <IconComponent className="w-5 h-5 text-primary" />;
                  })()}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-2">
                    {recordingPrompts[selectedPrompt].title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {recordingPrompts[selectedPrompt].prompt}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guided Prompts */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Choose a Prompt</CardTitle>
            <CardDescription>
              Get started with a guided message
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recordingPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setSelectedPrompt(index)}
                className={`w-full p-4 rounded-lg border text-left transition-all duration-200 hover:shadow-card ${
                  selectedPrompt === index
                    ? "bg-primary/5 border-primary/20"
                    : "bg-card border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedPrompt === index
                      ? "bg-primary/10"
                      : "bg-muted"
                  }`}>
                    <prompt.icon className={`w-5 h-5 ${
                      selectedPrompt === index
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">
                      {prompt.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {prompt.prompt}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Recording Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Find a quiet, well-lit space</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Speak clearly and at a comfortable pace</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Take breaks if you need them</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Remember, this is a gift of love</span>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}