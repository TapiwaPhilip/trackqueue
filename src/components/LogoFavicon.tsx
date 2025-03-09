
import React, { useEffect } from 'react';

// This component generates a favicon dynamically
const LogoFavicon: React.FC = () => {
  useEffect(() => {
    // Create a canvas for the favicon
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw the gradient background
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, '#7E22CE'); // nightPurple
      gradient.addColorStop(0.5, '#3B82F6'); // nightBlue
      gradient.addColorStop(1, '#EC4899'); // nightPink
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw the Q shape
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(32, 32, 18, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw the Q tail
      ctx.beginPath();
      ctx.moveTo(42, 42);
      ctx.lineTo(48, 48);
      ctx.stroke();
      
      // Draw the queue dots
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(22, 32, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(32, 32, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(42, 32, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Convert to data URL and update favicon
      const dataUrl = canvas.toDataURL();
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.head.appendChild(link);
      }
      
      link.href = dataUrl;
    }
  }, []);
  
  return null; // This component doesn't render anything
};

export default LogoFavicon;
