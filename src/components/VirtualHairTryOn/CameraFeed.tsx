"use client";

import React, { useRef, useEffect } from "react";

interface CameraFeedProps {
  onVideoReady: (videoElement: HTMLVideoElement) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onVideoReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setupCamera() {
      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: false,
        });

        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            onVideoReady(videoRef.current);
          }
        };
      } catch (err) {
        console.error("Error accessing webcam:", err);
        alert("Could not access webcam. Please ensure you have given permission.");
      }
    }

    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onVideoReady]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10">
      <video
        ref={videoRef}
        className="w-full h-full object-cover mirror-mode"
        playsInline
        muted
      />
      <style jsx>{`
        .mirror-mode {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default CameraFeed;
