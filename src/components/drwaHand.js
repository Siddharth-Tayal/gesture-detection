export const drawHand = (predictions, ctx) => {
    if (!predictions) return;

    predictions.forEach(prediction => {
        const landmarks = prediction.landmarks;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;

        for (let i = 0; i < landmarks.length; i++) {
            const [x, y] = landmarks[i];
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "blue";
            ctx.fill();
        }
    });
};
