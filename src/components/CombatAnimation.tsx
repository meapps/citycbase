import React, { useEffect } from 'react';
import { CombatResult } from '../types';

interface CombatAnimationProps {
  result: CombatResult;
  onComplete: () => void;
}

const CombatAnimation: React.FC<CombatAnimationProps> = ({ result, onComplete }) => {
  React.useEffect(() => {
    // Trigger animation completion after duration
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const startPos = {
    x: result.attacker.col * 100 + 50,
    y: result.attacker.row * 100 + 50
  };

  const endPos = {
    x: result.target.col * 100 + 50,
    y: result.target.row * 100 + 50
  };

  return (
    <div 
      className="absolute pointer-events-none"
      style={{
        left: startPos.x,
        top: startPos.y,
        transform: `translate(-50%, -50%)`
      }}
    >
      <div 
        className="w-4 h-4 bg-red-500 rounded-full animate-ping"
        style={{
          animation: `projectile 1s forwards`,
        }}
      />
      <style jsx>{`
        @keyframes projectile {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(
              ${endPos.x - startPos.x}px,
              ${endPos.y - startPos.y}px
            );
          }
        }
      `}</style>
    </div>
  );
};

export default CombatAnimation;