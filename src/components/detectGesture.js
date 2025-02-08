export const detectGesture = (landmarks) => {
    if (!landmarks || landmarks.length < 21) return "No Gesture Detected";

    const isFingerUp = (tip, base) => tip[1] < base[1];

    // Thumb detection: Compare x-coordinates because the thumb moves sideways
    const isThumbUp = landmarks[4][0] > landmarks[2][0];

    // Other fingers use y-coordinates
    const fingers = {
        thumb: isThumbUp,
        index: isFingerUp(landmarks[8], landmarks[5]),
        middle: isFingerUp(landmarks[12], landmarks[9]),
        ring: isFingerUp(landmarks[16], landmarks[13]),
        pinky: isFingerUp(landmarks[20], landmarks[17]),
    };

    const upFingers = Object.values(fingers).filter((up) => up).length;

    // **Gesture Classification**
    if (fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
        return "thumbsUp";
    }
    if (!fingers.thumb && fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
        return "one";
    }
    if (!fingers.thumb && fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
        return "two";
    }
    if (!fingers.thumb && fingers.index && fingers.middle && fingers.ring && !fingers.pinky) {
        return "three";
    }
    if (!fingers.thumb && fingers.index && fingers.middle && fingers.ring && fingers.pinky) {
        return "four";
    }
    if (fingers.thumb && fingers.index && fingers.middle && fingers.ring && fingers.pinky) {
        return "openPalm";
    }
    if (!fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
        return "fist";
    }
    if (!fingers.thumb && fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
        return "victory";
    }

    return "No Gesture Detected";
};
