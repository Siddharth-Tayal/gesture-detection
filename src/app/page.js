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
  four: "/images/four-fingers.png", openPalm: "/images/open_palm.jpg",
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
    <Container
      maxWidth="md"
      sx={{
        textAlign: "center",
        p: 3,
        bgcolor: "background.paper",
        borderRadius: "15px",
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" fontWeight={600} color="primary" gutterBottom>
        Hand Gesture Recognition ✋
      </Typography>

      <Box sx={{ position: "relative", display: "inline-block", borderRadius: "10px" }}>
        <Webcam
          ref={webcamRef}
          style={{
            width: 640,
            height: 480,
            borderRadius: "10px",
            border: "3px solid #1976d2",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "10px",
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
              width: "120px",
              top: "20px",
              right: "20px",
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
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              mt: 2,
              p: 2,
              display: "inline-block",
              borderRadius: "10px",
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              {gesture}
            </Typography>
          </Paper>
        </motion.div>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{
          mt: 3,
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: 600,
          px: 3,
          py: 1.5,
          textTransform: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "secondary.main",
            transform: "scale(1.05)",
          },
        }}
      >
        Restart Detection
      </Button>
    </Container>
  );
}
