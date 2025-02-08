export const detectGesture = (landmarks) => {
    if (!landmarks) return "No Gesture Detected";

    const [thumb, index, middle, ring, pinky] = [
        landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]
    ];

    const isThumbUp = thumb[1] < index[1] && thumb[1] < middle[1] && thumb[1] < ring[1] && thumb[1] < pinky[1];
    const isOpenPalm = index[1] < thumb[1] && middle[1] < thumb[1] && ring[1] < thumb[1] && pinky[1] < thumb[1];
    const isFist = Math.abs(index[1] - thumb[1]) < 20 && Math.abs(middle[1] - thumb[1]) < 20;
    const isVictory = index[1] < thumb[1] && middle[1] < thumb[1] && ring[1] > thumb[1] && pinky[1] > thumb[1];

    if (isThumbUp) return "thumbsUp";
    if (isOpenPalm) return "openPalm";
    if (isFist) return "fist";
    if (isVictory) return "victory";

    return "No Gesture Detected";
};
