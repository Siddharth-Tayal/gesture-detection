export const drawHand = (predictions, ctx) => {
    if (!predictions || predictions.length === 0) return;

    // Define the connections between landmarks to form the hand skeleton
    const fingerJoints = {
        thumb: [0, 1, 2, 3, 4],
        indexFinger: [0, 5, 6, 7, 8],
        middleFinger: [0, 9, 10, 11, 12],
        ringFinger: [0, 13, 14, 15, 16],
        pinky: [0, 17, 18, 19, 20],
    };

    // Set line properties
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    // Loop through each prediction
    predictions.forEach((prediction) => {
        const landmarks = prediction.landmarks;

        // Draw the skeleton
        for (let finger in fingerJoints) {
            const points = fingerJoints[finger];
            ctx.beginPath();
            for (let i = 0; i < points.length - 1; i++) {
                const start = landmarks[points[i]];
                const end = landmarks[points[i + 1]];
                ctx.moveTo(start[0], start[1]);
                ctx.lineTo(end[0], end[1]);
            }
            ctx.stroke();
        }

        // Draw the landmarks
        landmarks.forEach((landmark) => {
            const [x, y] = landmark;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "blue";
            ctx.fill();
        });
    });
};
