export const detectGesture = (landmarks) => {
    if (!landmarks || landmarks.length < 21) return "No Gesture Detected";

    const isFingerUp = (tip, base) => tip[1] < base[1];

    const fingers = {
        thumb: landmarks[4][0] > landmarks[2][0], // Thumb moves sideways
        index: isFingerUp(landmarks[8], landmarks[5]),
        middle: isFingerUp(landmarks[12], landmarks[9]),
        ring: isFingerUp(landmarks[16], landmarks[13]),
        pinky: isFingerUp(landmarks[20], landmarks[17]),
    };

    const upFingers = Object.values(fingers).filter(Boolean).length;

    // Optimized gesture detection
    const gestures = {
        "10000": "thumbsUp",
        "01000": "one",
        "01100": "two",
        "01110": "three",
        "01111": "four",
        "11111": "openPalm",
        "00000": "fist",
        "01100": "victory",
    };

    const key = Object.values(fingers).map((b) => (b ? "1" : "0")).join("");
    return gestures[key] || "No Gesture Detected";
};
