"use client";

import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import { Button, Container, Typography, Box, CircularProgress, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { drawHand } from "@/components/drawHand";
import { detectGesture } from "@/components/detectGesture";

const overlayImages = {
  thumbsUp: "/images/thumbs_up.jpg",
  one: "/images/one-finger.jpg",
  two: "/images/two-fingers.jpg",
  three: "/images/three-fingers.jpg",
  four: "/images/four-fingers.png",
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
  const [facingMode, setFacingMode] = useState("user");
  const [palmPosition, setPalmPosition] = useState({ x: 0, y: 0 });

  const loadHandpose = async () => {
    try {
      setModelLoaded(null);
      const net = await handpose.load();
      setModelLoaded(net);
      requestAnimationFrame(() => detect(net));
    } catch (error) {
      console.error("Error loading model:", error);
    }
  };

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

        // Extract palm base position (landmark index 0 or 9)
        const palmLandmark = hand[0].landmarks[0]; // or use 9 for more accuracy
        setPalmPosition({
          x: palmLandmark[0],
          y: palmLandmark[1],
        });
      } else {
        setGesture("No Gesture Detected");
        setOverlay(null);
      }
      requestAnimationFrame(() => detect(net));
    } catch (error) {
      console.error("Error detecting hand:", error);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    loadHandpose();
  };

  useEffect(() => {
    loadHandpose();
  }, []);

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Typography variant="h4" fontWeight={600} color="primary" className="text-center" gutterBottom>
        Hand Gesture Recognition ✋
      </Typography>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        <Webcam
          ref={webcamRef}
          videoConstraints={{ facingMode: facingMode }}
          style={{ width: "640px", height: "480px", borderRadius: "10px" }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        {overlay && (
          <motion.img
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={overlay}
            alt="Gesture Overlay"
            style={{
              position: "absolute",
              width: "100px",
              left: `${palmPosition.x}px`,
              top: `${palmPosition.y + 50}px`, transform: "translate(-50%, -50%)",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              backgroundColor: "white",
              padding: "8px",
            }}
          />
        )}
      </Box>

      {!modelLoaded ? (
        <Box mt={3} display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="primary" />
          <Typography variant="h6" color="textSecondary">
            Loading Model...
          </Typography>
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            mt: 2,
            textAlign: "center",
            p: 1,
            bgcolor: "primary.main",
            color: "white",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" fontWeight={500} className="capitalize w-[250px]">
            {gesture}
          </Typography>
        </Paper>
      )}

      <Box mt={3} display="flex" gap={2}>
        <Button variant="contained" color="primary" className="capitalize w-[250px]" onClick={toggleCamera}>
          Switch Camera
        </Button>
      </Box>
    </Container>
  );
}
