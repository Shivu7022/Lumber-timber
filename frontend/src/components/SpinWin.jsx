import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Trophy } from 'lucide-react';

const PRIZES = [
  { id: 1, label: '5% OFF', color: '#f59e0b', value: 'LUMBER5' },
  { id: 2, label: 'FREE TOY', color: '#10b981', value: 'FREEBIE' },
  { id: 3, label: '10% OFF', color: '#3b82f6', value: 'LUMBER10' },
  { id: 4, label: 'TRY AGAIN', color: '#ef4444', value: null },
  { id: 5, label: '500 PTS', color: '#8b5cf6', value: 'POINTS500' },
  { id: 6, label: 'FREE SHIP', color: '#ec4899', value: 'FREESHIP' },
];

const SpinWin = ({ isOpen, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    
    // Random spin: 5-10 full rotations + random offset
    const newRotation = rotation + 1800 + Math.floor(Math.random() * 360);
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      
      // Calculate which slice it landed on
      // The needle is at the top (0 degrees).
      // Each slice is 60 degrees.
      const normalizedRotation = (newRotation % 360);
      // Rotation is clockwise, so if rotation is 30, it moved 30 degrees.
      // Needle is at 0. Slice 1 is 0-60, etc? 
      // Actually, if it rotates 60 degrees, the needle points to the end of slice 1?
      // Let's just pick a random index for simplicity of visual alignment
      const landedIndex = Math.floor(((360 - (normalizedRotation % 360)) / 60) % 6) ;
      setResult(PRIZES[landedIndex]);
      setShowResult(true);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-primary w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-borderColor relative p-8 text-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-textMain/50 hover:text-textMain hover:bg-secondary p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h2 className="text-3xl font-black text-textMain flex items-center justify-center gap-2 mb-2">
                <Sparkles className="text-yellow-500" /> Spin & Win <Sparkles className="text-yellow-500" />
              </h2>
              <p className="text-textMain/70 italic">Try your luck and win amazing discounts!</p>
            </div>

            {/* The Wheel */}
            <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
              {/* Needle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 text-accent filter drop-shadow-md">
                <div className="w-4 h-8 bg-accent rounded-full border-2 border-white"></div>
              </div>

              {/* Wheel Body */}
              <motion.div
                animate={{ rotate: rotation }}
                transition={{ duration: 3, ease: [0.12, 0, 0.39, 0] }}
                className="w-full h-full rounded-full border-[8px] border-secondary shadow-xl relative overflow-hidden"
                style={{ 
                  background: `conic-gradient(${PRIZES.map((p, i) => `${p.color} ${i * 60}deg ${(i + 1) * 60}deg`).join(', ')})` 
                }}
              >
                {PRIZES.map((prize, index) => (
                  <div
                    key={index}
                    className="absolute w-full h-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ 
                      transform: `rotate(${index * 60 + 30}deg)`,
                      paddingLeft: '50%'
                    }}
                  >
                    <span className="-rotate-90 origin-center whitespace-nowrap block w-1/2 text-right pr-4">
                      {prize.label}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Center Cap */}
              <div className="absolute inset-0 m-auto w-12 h-12 bg-primary rounded-full border-4 border-secondary shadow-md z-10 flex items-center justify-center">
                <Gift size={20} className="text-accent" />
              </div>
            </div>

            {/* Result Message */}
            <div className="h-20 flex flex-col items-center justify-center mb-6">
              {showResult && result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-2"
                >
                  {result.value ? (
                    <>
                      <div className="text-2xl font-black text-accent flex items-center gap-2">
                        <Trophy size={28} /> Congratulations!
                      </div>
                      <div className="text-lg text-textMain font-medium">
                        You won: <span className="font-bold">{result.label}</span>
                      </div>
                      <div className="bg-secondary p-2 rounded-lg border-2 border-dashed border-accent text-accent font-mono font-bold tracking-widest text-lg">
                        {result.value}
                      </div>
                      <p className="text-[10px] text-textMain/50 uppercase font-bold">Use code at checkout</p>
                    </>
                  ) : (
                    <div className="text-xl font-bold text-textMain/50 italic">
                      Oops! Better luck next time!
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Spin Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || showResult}
              className={`w-full py-4 rounded-2xl font-black text-xl transition-all shadow-lg flex items-center justify-center gap-3 ${
                isSpinning || showResult
                  ? 'bg-secondary text-textMain/30 cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-accent/90 active:scale-95'
              }`}
            >
              {isSpinning ? (
                <>Spinning...</>
              ) : showResult ? (
                <>Good Luck!</>
              ) : (
                <>SPIN TO WIN! <Gift size={24} /></>
              )}
            </button>

            {showResult && (
              <button 
                onClick={onClose}
                className="mt-4 text-textMain/60 hover:text-accent font-bold text-sm underline transition-colors"
              >
                Continue Shopping
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SpinWin;
