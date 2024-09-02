import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import './ConfettiButton.css';

const PartyComponent = () => {
  const [showMessage, setShowMessage] = useState(false);

  const makeItRain = () => {
    setShowMessage(true);
    const button = document.getElementById("makeItRain");
    button.disabled = true;
    const end = Date.now() + 1000; // 1 second

    const colors = ['#bb0000', '#ffffff', 'red', 'yellow', 'green'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 90, // Fire towards the center from the left
        spread: 280, // Wide spread to cover from bottom to top center
        startVelocity: 60,
        scalar: 3, // Larger particles
        origin: { x: 0, y: 1 }, // Start from the bottom-left corner
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 90, // Fire towards the center from the right
        spread: 280, // Wide spread to cover from bottom to top center
        startVelocity: 60,
        scalar: 3, // Larger particles
        origin: { x: 1, y: 1 }, // Start from the bottom-right corner
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        button.disabled = false;
        setTimeout(() => setShowMessage(false), 1000); // Hide "Welcome" message after 1 second
      }
    };

    frame();
  };

  return (
    <div>
      <div className="title">Let's partyyyyyy!</div>
      {showMessage && <div className="welcome-message">Welcome!</div>}
      <div className="button-container">
        <button id="makeItRain" onClick={makeItRain}>Make it rain</button>
      </div>
    </div>
  );
};

export default PartyComponent;
