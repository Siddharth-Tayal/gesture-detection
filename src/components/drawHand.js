export const drawHand = (predictions, ctx) => {
    if (!predictions || predictions.length === 0) return;

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    predictions.forEach(prediction => {
        const landmarks = prediction.landmarks;
        for (let i = 0; i < landmarks.length; i++) {
            const [x, y] = landmarks[i];
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "blue";
            ctx.fill();
        }
    });
};
