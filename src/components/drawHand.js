export const drawHand = (predictions, ctx) => {
    if (!predictions || predictions.length === 0) return;

    const fingerJoints = {
        thumb: [0, 1, 2, 3, 4],
        indexFinger: [0, 5, 6, 7, 8],
        middleFinger: [0, 9, 10, 11, 12],
        ringFinger: [0, 13, 14, 15, 16],
        pinky: [0, 17, 18, 19, 20],
    };

    const fingerIndexes = [4, 8, 12, 16, 20];

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";

    predictions.forEach((prediction) => {
        const landmarks = prediction.landmarks;
        const raisedFingers = [];

        // Determine raised fingers
        for (let i = 0; i < 5; i++) {
            if (landmarks[fingerIndexes[i]][1] < landmarks[fingerIndexes[i] - 2][1]) {
                raisedFingers.push({ index: i + 1, pos: landmarks[fingerIndexes[i]] });
            }
        }

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
        landmarks.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "blue";
            ctx.fill();
        });

        // Draw labels only on raised fingers
        raisedFingers.forEach(({ index, pos }) => {
            const [x, y] = pos;
            ctx.fillText(index, x, y - 15);
        });
    });
};
