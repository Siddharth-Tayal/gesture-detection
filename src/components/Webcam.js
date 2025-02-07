// components/WebcamCapture.js
import React from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ onCapture }) => {
    return (
        <div>
            <Webcam
                audio={false}
                height="auto"
                width="100%"
                screenshotFormat="image/jpeg"
                onUserMedia={onCapture}
            />
        </div>
    );
};

export default WebcamCapture;
