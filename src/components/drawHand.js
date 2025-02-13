export const drawHand = (predictions, ctx) => {
    if (!predictions || predictions.length === 0) return;

    const isFingerUp = (tip, base) => tip[1] < base[1];

    predictions.forEach((prediction) => {
        const landmarks = prediction.landmarks;
        if (!landmarks || landmarks.length < 21) return; // Safety check

        // Thumb detection (x-coordinates for sideways movement)
        const isThumbUp = landmarks[4][0] > landmarks[2][0];

        // Other fingers use y-coordinates
        const fingers = {
            thumb: isThumbUp,
            index: isFingerUp(landmarks[8], landmarks[5]),
            middle: isFingerUp(landmarks[12], landmarks[9]),
            ring: isFingerUp(landmarks[16], landmarks[13]),
            pinky: isFingerUp(landmarks[20], landmarks[17]),
        };

        // Finger connection points
        const fingerJoints = {
            thumb: [0, 1, 2, 3, 4],
            index: [0, 5, 6, 7, 8],
            middle: [0, 9, 10, 11, 12],
            ring: [0, 13, 14, 15, 16],
            pinky: [0, 17, 18, 19, 20],
        };

        // Drawing settings
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";

        // Draw the skeleton (finger connections)
        Object.values(fingerJoints).forEach((points) => {
            ctx.beginPath();
            for (let i = 0; i < points.length - 1; i++) {
                const [x1, y1] = landmarks[points[i]];
                const [x2, y2] = landmarks[points[i + 1]];
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            }
            ctx.stroke();
        });

        // Draw landmarks and raised finger labels
        let raisedFingerIndex = 1;
        landmarks.forEach(([x, y], i) => {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "blue";
            ctx.fill();

            // Label raised fingers
            if (
                (i === 4 && fingers.thumb) ||
                (i === 8 && fingers.index) ||
                (i === 12 && fingers.middle) ||
                (i === 16 && fingers.ring) ||
                (i === 20 && fingers.pinky)
            ) {
                ctx.fillText(raisedFingerIndex++, x, y - 15);
            }
        });
    });
};
