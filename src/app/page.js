"use client";

import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import { Button, Container, Typography, Box, CircularProgress, Paper } from "@mui/material";
import { drawHand } from "@/components/drawHand";
import { detectGesture } from "@/components/detectGesture";

const overlayImages = {
  thumbsUp: "/images/thumbs_up.jpg",
  openPalm: "/images/open_palm.jpg",
  fist: "/images/fist.jpg",
  victory: "/images/victory.jpg",
};

export default function HandGestureApp() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [gesture, setGesture] = useState("No Gesture Detected");
  const [overlay, setOverlay] = useState(null);

  useEffect(() => {
    const loadHandpose = async () => {
      try {
        console.log("Loading HandPose model...");
        const net = await handpose.load();
        console.log("Model Loaded");
        setModelLoaded(true);
        requestAnimationFrame(() => detect(net));
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };
    loadHandpose();
  }, []);

  const detect = async (net) => {
    if (!webcamRef.current || !webcamRef.current.video) return;

    const video = webcamRef.current.video;
    if (video.readyState !== 4) return;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    try {
      const hand = await net.estimateHands(video);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, videoWidth, videoHeight);

      if (hand.length > 0) {
        drawHand(hand, ctx);
        console.log("Detected hand:", hand);
        const detectedGesture = detectGesture(hand[0].landmarks);
        console.log("Detected Gesture:", detectedGesture);
        setGesture(detectedGesture);
        setOverlay(overlayImages[detectedGesture] || null);
      } else {
        setGesture("No Gesture Detected");
        setOverlay(null);
      }
      requestAnimationFrame(() => detect(net));
    } catch (error) {
      console.error("Error detecting hand:", error);
    }
  };

  return (
    <Container style={{ textAlign: "center", marginTop: "20px", position: "relative" }}>
      <Typography variant="h4" gutterBottom>Hand Gesture Recognition</Typography>
      <Box position="relative" display="inline-block">
        <Webcam ref={webcamRef} style={{ width: 640, height: 480, borderRadius: "10px" }} />
        <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
        {overlay && (
          <img
            src={overlay}
            alt="Gesture Overlay"
            style={{
              position: "absolute",
              width: "150px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </Box>
      {!modelLoaded ? (
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="primary" />
          <Typography variant="h6" color="textSecondary">Loading Model...</Typography>
        </Box>
      ) : (
        <Typography variant="h6" color="primary" style={{ marginTop: "10px" }}>{gesture}</Typography>
      )}
    </Container>
  );
}
