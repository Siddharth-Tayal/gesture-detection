"use client";

import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import { Button, Container, Typography, Box, CircularProgress, Paper } from "@mui/material";
import { drawHand } from "@/components/drwaHand";

const fingerNames = ["Thumb", "Index Finger", "Middle Finger", "Ring Finger", "Pinky Finger"];

export default function HandGestureApp() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [gesture, setGesture] = useState("No Gesture Detected");
  const [fingerPositions, setFingerPositions] = useState([]);

  useEffect(() => {
    const loadHandpose = async () => {
      const net = await handpose.load();
      setModelLoaded(true);
      requestAnimationFrame(() => detect(net));
    };
    loadHandpose();
  }, []);

  const detect = async (net) => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, videoWidth, videoHeight);

      if (hand.length > 0) {
        drawHand(hand, ctx);
        setGesture("Hand Detected");

        const positions = hand[0].landmarks.map((pos, index) => ({
          finger: fingerNames[Math.floor(index / 4)],
          position: `X: ${pos[0].toFixed(2)}, Y: ${pos[1].toFixed(2)}`
        }));
        setFingerPositions(positions);
      } else {
        setGesture("No Gesture Detected");
        setFingerPositions([]);
      }
      requestAnimationFrame(() => detect(net));
    }
  };

  return (
    <Container style={{ textAlign: "center", marginTop: "20px", position: "relative" }}>
      <Typography variant="h4" gutterBottom>Hand Gesture Recognition</Typography>
      <Box position="relative" display="inline-block">
        <Webcam ref={webcamRef} style={{ width: 640, height: 480, borderRadius: "10px" }} />
        <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
      </Box>
      {!modelLoaded ? (
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="primary" />
          <Typography variant="h6" color="textSecondary">Loading Model...</Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h6" color="primary" style={{ marginTop: "10px" }}>{gesture}</Typography>
          {fingerPositions.length > 0 && (
            <Paper elevation={3} style={{ padding: "10px", marginTop: "10px", backgroundColor: "#f5f5f5" }}>
              <Typography variant="h6">Finger Positions:</Typography>
              {fingerPositions.map((fp, index) => (
                <Typography key={index} variant="body1">{fp.finger}: {fp.position}</Typography>
              ))}
            </Paper>
          )}
        </>
      )}
    </Container>
  );
}