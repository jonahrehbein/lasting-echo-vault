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
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Create Your Legacy Message
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take your time to share what matters most. Your words will become a treasured gift.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recording Interface */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="w-5 h-5 text-primary" />
                    <span>Recording Studio</span>
                  </CardTitle>
                  <CardDescription>
                    Position yourself comfortably and speak from the heart
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Video Preview Area */}
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        {isRecording ? "Recording in progress..." : "Camera preview will appear here"}
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
                  <div className="flex justify-center space-x-4">
                    {!isRecording ? (
                      <Button
                        size="lg"
                        variant="legacy"
                        onClick={handleStartRecording}
                        className="min-w-32"
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
                          className="min-w-24"
                        >
                          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                        </Button>
                        
                        <Button
                          size="lg"
                          variant="destructive"
                          onClick={handleStopRecording}
                          className="min-w-24"
                        >
                          <Square className="w-5 h-5" />
                        </Button>
                        
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={handleStopRecording}
                          className="min-w-24"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Selected Prompt Display */}
                  {selectedPrompt !== null && (
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                          {(() => {
                            const IconComponent = recordingPrompts[selectedPrompt].icon;
                            return <IconComponent className="w-4 h-4 text-primary" />;
                          })()}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">
                            {recordingPrompts[selectedPrompt].title}
                          </h4>
                          <p className="text-muted-foreground">
                            {recordingPrompts[selectedPrompt].prompt}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Prompts Sidebar */}
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Guided Prompts</CardTitle>
                  <CardDescription>
                    Choose a prompt to help you get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recordingPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPrompt(index)}
                      className={`w-full p-3 rounded-lg border text-left transition-all duration-200 hover:shadow-card ${
                        selectedPrompt === index
                          ? "bg-primary/5 border-primary/20"
                          : "bg-card border-border hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mt-1 ${
                          selectedPrompt === index
                            ? "bg-primary/10"
                            : "bg-muted"
                        }`}>
                          <prompt.icon className={`w-4 h-4 ${
                            selectedPrompt === index
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">
                            {prompt.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {prompt.prompt}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Tips for Recording</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>• Find a quiet, well-lit space</p>
                  <p>• Speak clearly and at a comfortable pace</p>
                  <p>• Take breaks if you need them</p>
                  <p>• Remember, this is a gift of love</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}