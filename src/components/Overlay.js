const Overlay = ({ gesture }) => {
    const gestureImages = {
        "Thumbs Up": "/thumbs-up.png",
        "Open Palm": "/stop-sign.png",
        "Fist": "/fist.png",
    };

    return (
        <div className="absolute top-10 left-10">
            {gesture && <img src={gestureImages[gesture]} alt={gesture} className="w-20 h-20" />}
        </div>
    );
};

export default Overlay;
