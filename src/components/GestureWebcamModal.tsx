// components/GestureWebcamModal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";

interface GestureWebcamModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmitImage: (image: string) => void;
}

const GestureWebcamModal = ({
  isOpen,
  setIsOpen,
  onSubmitImage,
}: GestureWebcamModalProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [detectionEnabled, setDetectionEnabled] = useState(true);

  // Gesture sequence state
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, or 3

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const holdStartTimeRef = useRef<number | null>(null);
  const hasAdvancedRef = useRef(false);
  const currentStepRef = useRef(currentStep);
  const detectionEnabledRef = useRef(detectionEnabled);

  useEffect(() => {
    if (typeof window !== "undefined") {
      loadMediaPipeHands();
    }

    return () => {
      stopWebcam();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && !stream) {
      startWebcam();
    } else if (isOpen && stream && modelLoaded && videoRef.current) {
      startGestureDetection();
    }
  }, [isOpen, modelLoaded, stream]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    detectionEnabledRef.current = detectionEnabled;
  }, [detectionEnabled]);

  const loadMediaPipeHands = async () => {
    try {
      const { Hands } = await import("@mediapipe/hands");

      const hands = new Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onHandsResults);

      handsRef.current = hands;
      setModelLoaded(true);
      console.log("MediaPipe Hands loaded");
    } catch (error) {
      console.error("Error loading MediaPipe:", error);
      setError("Failed to load MediaPipe");
    }
  };

  const onHandsResults = (results: any) => {
    if (
      !results.multiHandLandmarks ||
      results.multiHandLandmarks.length === 0
    ) {
      resetHoldTimer();
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    const handedness = results.multiHandedness?.[0]?.label || "Right";

    const fingerCount = countExtendedFingers(landmarks, handedness);

    // Process gesture sequence
    processGestureSequence(fingerCount);

    // Draw visualization
    const isCorrect = fingerCount === currentStepRef.current;
    drawHandLandmarks(landmarks, isCorrect, currentStepRef.current);
  };

  const processGestureSequence = (fingerCount: number) => {
    // Don't process during photo countdown or after capture
    if (countdown !== null || capturedImage) {
      return;
    }

    const isCorrectGesture = fingerCount === currentStepRef.current;

    console.log("fingerCount", fingerCount);
    console.log("currentStep", currentStepRef);

    if (isCorrectGesture) {
      // Start timer if not started
      if (holdStartTimeRef.current === null) {
        holdStartTimeRef.current = Date.now();
        hasAdvancedRef.current = false;
      }

      // Calculate progress (3 seconds = 1.0)
      const elapsed = (Date.now() - holdStartTimeRef.current) / 1000;
      const progress = Math.min(elapsed / 1.0, 1.0);

      // Check if 3 seconds have passed
      if (progress >= 1.0 && !hasAdvancedRef.current) {
        hasAdvancedRef.current = true;
        console.log(`Step ${currentStep} complete!`);
        advanceToNextStep();
      }
    } else {
      // Wrong gesture - reset timer
      if (holdStartTimeRef.current !== null) {
        console.log(
          `Wrong gesture detected (${fingerCount} instead of ${currentStep}), resetting`
        );
        resetHoldTimer();
      }
    }
  };

  const advanceToNextStep = () => {
    setCurrentStep((prevStep) => {
      let nextStep = prevStep;

      if (prevStep === 3) {
        console.log("All steps complete! Starting photo countdown...");
        resetHoldTimer();
        triggerPhotoCountdown();
      } else {
        nextStep = prevStep + 1;
        console.log(`Advancing from step ${prevStep} to ${nextStep}`);
        resetHoldTimer();
      }

      currentStepRef.current = nextStep; // ✅ keep ref synced immediately
      return nextStep;
    });
  };

  const resetHoldTimer = () => {
    holdStartTimeRef.current = null;
    hasAdvancedRef.current = false;
  };

  const countExtendedFingers = (landmarks: any[], handedness: string) => {
    if (!landmarks) return 0;

    const tips = [4, 8, 12, 16, 20];
    const pips = [3, 6, 10, 14, 18];
    const names = ["Thumb", "Index", "Middle", "Ring", "Pinky"];
    let count = 0;
    let extendedFingers: string[] = [];

    // Thumb
    const thumbTip = landmarks[tips[0]];
    const thumbPip = landmarks[pips[0]];
    const isRightHand = handedness === "Right";
    const thumbExtended = isRightHand
      ? thumbTip.x < thumbPip.x
      : thumbTip.x > thumbPip.x;
    if (thumbExtended) {
      count++;
      extendedFingers.push("Thumb");
    }

    // Other fingers
    for (let i = 1; i < 5; i++) {
      const tip = landmarks[tips[i]];
      const pip = landmarks[pips[i]];
      const extended = tip.y < pip.y;

      if (extended) {
        count++;
        extendedFingers.push(names[i]);
      }
    }

    return count;
  };

  const drawHandLandmarks = (
    landmarks: any[],
    isCorrect: boolean,
    currentStep: number
  ) => {
    if (!detectionCanvasRef.current || !videoRef.current) return;
    if (!detectionEnabledRef.current) return;

    const canvas = detectionCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate bounding box
    let minX = 1,
      minY = 1,
      maxX = 0,
      maxY = 0;
    landmarks.forEach((landmark: any) => {
      minX = Math.min(minX, landmark.x);
      minY = Math.min(minY, landmark.y);
      maxX = Math.max(maxX, landmark.x);
      maxY = Math.max(maxY, landmark.y);
    });

    const padding = 0.05;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(1, maxX + padding);
    maxY = Math.min(1, maxY + padding);

    // 🟩 Draw bounding box
    ctx.strokeStyle = isCorrect ? "#00ff00" : "#ff0000";
    ctx.lineWidth = 4;
    const boxX = minX * canvas.width;
    const boxY = minY * canvas.height;
    const boxWidth = (maxX - minX) * canvas.width;
    const boxHeight = (maxY - minY) * canvas.height;

    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // 🏷️ Draw label above box
    const label = isCorrect ? `Pose ${currentStep}` : "Undetected";
    const labelColor = isCorrect ? "#00ff00" : "#ff0000";

    ctx.font = "bold 20px sans-serif";
    ctx.textBaseline = "top";
    const textWidth = ctx.measureText(label).width;

    const labelPadding = 6;
    const labelX = boxX;
    const labelY = Math.max(0, boxY - 30);
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(
      labelX - labelPadding,
      labelY - labelPadding / 2,
      textWidth + labelPadding * 2,
      28
    );

    ctx.fillStyle = labelColor;
    ctx.fillText(label, labelX + labelPadding, labelY);
  };

  const startWebcam = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            ?.play()
            .then(() => {
              setIsLoading(false);
            })
            .catch((err) => {
              setError("Failed to start video");
              setIsLoading(false);
            });
        };
      }
    } catch (error: any) {
      setError(`Unable to access webcam: ${error.message}`);
      setIsLoading(false);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    resetHoldTimer();
  };

  const startGestureDetection = async () => {
    if (!modelLoaded || !handsRef.current || !videoRef.current) return;

    const detectFrame = async () => {
      if (
        videoRef.current &&
        handsRef.current &&
        stream &&
        videoRef.current.readyState === 4
      ) {
        try {
          await handsRef.current.send({ image: videoRef.current });
        } catch (error) {
          console.error("Detection error:", error);
        }
      }

      if (stream) {
        animationFrameRef.current = requestAnimationFrame(detectFrame);
      }
    };

    detectFrame();
  };

  const triggerPhotoCountdown = () => {
    setDetectionEnabled(false);

    // 🧹 Immediately clear the detection canvas
    if (detectionCanvasRef.current) {
      const ctx = detectionCanvasRef.current.getContext("2d");
      if (ctx)
        ctx.clearRect(
          0,
          0,
          detectionCanvasRef.current.width,
          detectionCanvasRef.current.height
        );
    }

    let current = 3;
    setCountdown(current);

    const countdownInterval = setInterval(() => {
      current -= 1;

      if (current <= 0) {
        clearInterval(countdownInterval);
        setCountdown(null);
        capturePhoto();
      } else {
        setCountdown(current);
      }
    }, 1000);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        console.log("Photo captured!");
      }
    }
  };

  const saveImage = () => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.href = capturedImage;
      link.download = `gesture-capture-${Date.now()}.png`;
      link.click();
    }
  };

  const submitImage = () => {
    if (capturedImage) {
      onSubmitImage(capturedImage);
      setIsOpen(false);
      resetState();
      stopWebcam();
    }
  };

  const retakePhoto = async () => {
    setCapturedImage(null);
    setCountdown(null);
    setCurrentStep(1);
    resetHoldTimer();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStream(stream);
      setDetectionEnabled(true); // re-enable hand detection
    } catch (error) {
      console.error("Error restarting webcam:", error);
    }
  };

  const resetState = () => {
    console.log("resetting state");
    setCapturedImage(null);
    setCountdown(null);
    setCurrentStep(1);
    resetHoldTimer();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          stopWebcam();
          resetState();
        }
      }}
    >
      <DialogContent className="w-[80vw] max-w-3xl!">
        <DialogHeader className="p-6">
          <DialogTitle>Raise Your Hand to Capture</DialogTitle>
          <DialogDescription>
            We'll take the photo once your hand pose is detected
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {stream && !capturedImage && countdown === null && (
            <h2 className="text-center font-bold text-neutral-100">
              Step {currentStep} (Pose {currentStep})
            </h2>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!modelLoaded && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-700 text-sm">
              Loading hand detection model...
            </div>
          )}

          {!capturedImage ? (
            <div className="relative">
              {isLoading && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10"
                  style={{ minHeight: "400px" }}
                >
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Requesting camera access...</p>
                  </div>
                </div>
              )}
              <div
                className="relative bg-black rounded-lg overflow-hidden"
                style={{ minHeight: "400px" }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={detectionCanvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                />
              </div>
              <canvas ref={canvasRef} className="hidden" />

              {/* {stream && !capturedImage && countdown === null && (
                <div className="absolute top-4 left-4 right-4 bg-black/85 text-white px-6 py-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm font-medium mb-2">
                      Step {currentStep} of 3
                    </div>
                    <div className="text-4xl mb-3">
                      {currentStep === 1 && "☝️ Show 1 finger"}
                      {currentStep === 2 && "✌️ Show 2 fingers"}
                      {currentStep === 3 && "🤟 Show 3 fingers"}
                    </div>

                    <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                      <div
                        className="bg-green-400 h-3 rounded-full transition-all duration-100"
                        style={{ width: `${holdProgress * 100}%` }}
                      />
                    </div>

                    <div className="text-xs opacity-80">
                      {detectedFingers === currentStep
                        ? `✓ Hold for 3 seconds... ${Math.round(
                            holdProgress * 100
                          )}%`
                        : `Detected: ${detectedFingers} finger${
                            detectedFingers !== 1 ? "s" : ""
                          }`}
                    </div>
                  </div>
                </div>
              )} */}

              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <div className="flex flex-col">
                    <p className="text-white font-bold text-sm">
                      Capturing photo in
                    </p>
                    <p className="text-white text-9xl font-bold animate-pulse">
                      {countdown}
                    </p>
                  </div>
                </div>
              )}

              {/* {stream && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">
                    Hold each gesture steady for 3 seconds
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Green box = correct gesture | Red box = wrong gesture
                  </p>
                </div>
              )} */}
            </div>
          ) : (
            <div className="space-y-4">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full rounded-lg"
              />

              <div className="flex gap-4 items-center justify-center">
                {/* <button
                  onClick={retakePhoto}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <RotateCcw size={18} />
                  Retake
                </button>
                <button
                  onClick={saveImage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Download size={18} />
                  Save Photo
                </button> */}
                <Button
                  variant={"outline"}
                  className="border-neutral-40 border"
                  onClick={retakePhoto}
                >
                  Retake Photo
                </Button>
                <Button onClick={submitImage}>Submit</Button>
              </div>
            </div>
          )}
        </div>
        {!capturedImage && (
          <>
            <p className="text-xs text-neutral-100">
              To take a picture, follow the hand poses in the order shown below.
              The system will automatically capture the image once the final
              pose is detected.
            </p>
            <div className="flex items-center justify-center">
              <Image
                src="/finger-1.png"
                alt="finger-1"
                width={64}
                height={64}
              />
              <ArrowRightIcon className="w-4 h-4" />
              <Image
                src="/finger-2.png"
                alt="finger-2"
                width={64}
                height={64}
              />
              <ArrowRightIcon className="w-4 h-4" />
              <Image
                src="/finger-3.png"
                alt="finger-3"
                width={64}
                height={64}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GestureWebcamModal;
