# Hand Gesture Recognition

## Overview

This is a **real-time hand gesture recognition** project using **Next.js, TensorFlow.js, and HandPose**. The application detects hand keypoints and recognizes gestures, overlaying images based on the detected gestures.

## Features

- **Hand keypoint detection** using TensorFlow.js HandPose model
- **Real-time gesture recognition** (Thumbs Up, Open Palm, Fist, Victory, Counting Fingers)
- **Dynamic overlays** based on recognized gestures
- **Optimized with Next.js** for performance
- **Uses TensorFlow.js for in-browser machine learning**

## Technologies Used

- **Next.js** (React framework for optimized rendering)
- **TensorFlow.js** (Machine learning in the browser)
- **HandPose Model** (Pre-trained model for hand keypoint detection)
- **Material UI** (Modern UI components)
- **React Webcam** (Access live webcam feed)

## Installation & Setup

### **1. Clone the Repository**

```bash
git clone https://github.com/Siddharth-Tayal/gesture-detection.git
cd gesture-detection
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Start the Development Server**

```bash
npm run dev
```

## Usage

1. Open the app in your browser (default: `http://localhost:3000`).
2. Allow webcam access when prompted.
3. Perform gestures in front of the camera:
   - **Thumbs Up** 🖒 → Displays a thumbs-up image
   - **Open Palm** ✋ → Displays an open palm image
   - **Fist** ✊ → Displays a fist image
   - **Victory Sign** ✌️ → Displays a victory image
   - **Counting Fingers** (1 to 5) → Detects and displays the corresponding number
4. Watch real-time detection and overlay appear.

## Project Structure

```
📂 gesture-detection
|
├── 📂 public/images  # Gesture overlay images
├── 📂 src
├───── 📂 components
│      ├── drawHand.js  # Function to draw hand keypoints
│      ├── detectGesture.js  # Function to classify gestures
├───── 📂 app
│      ├── page.jsx  # Main application file
├── 📜 README.md  # Project documentation
└── 📜 package.json  # Dependencies & scripts
```

## Demo

Live Demo: [gesture-detection.vercel.app](https://gesture-detection.vercel.app)

## Troubleshooting

- If the model is not loading, check the console for errors.
- Ensure TensorFlow.js dependencies are installed properly.
- Webcam not working? Ensure you have granted camera access.
- Gesture not recognized? Try different hand positions and adjust lighting conditions.

## Future Improvements

- Add more gestures (e.g., Rock, Paper, Scissors, Swipe motions)
- Improve gesture classification accuracy using additional data
- Develop an Android version with React Native & TensorFlow Lite
- Implement gesture-based navigation for accessibility

## Contributing

Feel free to fork the repository, submit issues, or make pull requests.

## License

This project is licensed under the MIT License.

## Contact

**Developer:** Siddharth Tayal  
**Email:** stayal12345@gmail.com  
**GitHub:** [Siddharth-Tayal](https://github.com/Siddharth-Tayal)
