"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import MediaPipe Hands
const loadHands = async () => {
    if (typeof window !== "undefined") {
        const { Hands } = await import("@mediapipe/hands");
        return Hands;
    }
    return null;
};

const HandDetection = ({ onHandDetected }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        let handsInstance = null;
        const setupHandTracking = async () => {
            const Hands = await loadHands();
            if (!Hands) return;

            handsInstance = new Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
            });

            handsInstance.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            handsInstance.onResults((results) => {
                if (results.multiHandLandmarks.length > 0) {
                    onHandDetected(results.multiHandLandmarks[0]); // Send keypoints to parent
                }

                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                results.multiHandLandmarks.forEach((landmarks) => {
                    landmarks.forEach((point) => {
                        ctx.beginPath();
                        ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, 2 * Math.PI);
                        ctx.fillStyle = "red";
                        ctx.fill();
                    });
                });
            });

            if (videoRef.current) {
                const { Camera } = await import("@mediapipe/camera_utils");
                const camera = new Camera(videoRef.current, {
                    onFrame: async () => {
                        await handsInstance.send({ image: videoRef.current });
                    },
                    width: 640,
                    height: 480,
                });
                camera.start();
            }
        };

        setupHandTracking();
    }, []);

    return (
        <div>
            <video ref={videoRef} className="hidden"></video>
            <canvas ref={canvasRef} width="640" height="480" className="absolute top-0 left-0"></canvas>
        </div>
    );
};

export default dynamic(() => Promise.resolve(HandDetection), { ssr: false });
