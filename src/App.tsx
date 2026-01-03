import { useState } from 'react';
import './App.css'

import { Plus, Shuffle, Sparkles, Trash2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './components/ui/card';
import { cn } from './lib/utils';
import { GridPattern } from './components/ui/grid-pattern';
import confetti from 'canvas-confetti';

function App() {
  const [options, setOptions] = useState(['', '']);
  const [result, setResult] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const pickOne = async () => {
    const validOptions = options.filter(option => option.trim() !== '');

    if (validOptions.length < 2) {
      // Could add toast here
      return;
    }

    setIsAnimating(true);
    setResult('');

    // Simulate complex shuffling animation
    const totalDuration = 2000;
    const intervalTime = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * validOptions.length);
      setResult(validOptions[randomIndex]);
      elapsed += intervalTime;

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        finalizePick(validOptions);
      }
    }, intervalTime);
  };

  const finalizePick = (validOptions: string[]) => {
    let finalIndex = 0;

    // Robust Randomness Logic
    if (window.crypto && window.crypto.getRandomValues) {
      // Application-grade randomness using Crypto API
      const randomBuffer = new Uint32Array(1);
      window.crypto.getRandomValues(randomBuffer);
      const randomNumber = randomBuffer[0] / (0xffffffff + 1);
      finalIndex = Math.floor(randomNumber * validOptions.length);
    } else {
      // Fallback for non-secure contexts
      finalIndex = Math.floor(Math.random() * validOptions.length);
    }

    setResult(validOptions[finalIndex]);
    setIsAnimating(false);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: random(0.3, 0.5) } }); // Left
      confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: random(0.3, 0.5) } }); // Right
    }, 250);
  };

  const reset = () => {
    setResult('');
    setOptions(['', '']);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-background text-foreground overflow-hidden relative font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GridPattern
          width={40}
          height={40}
          className="opacity-[0.03] text-primary"
          strokeDasharray="4 2"
        />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full z-10 space-y-8 relative">
        {/* Header */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 ring-1 ring-primary/20 shadow-lg shadow-primary/10"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight lg:text-6xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent drop-shadow-sm">
            PickOne
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Decisions made simple.
          </p>
        </motion.div>

        {/* Main Card */}
        <Card className="border-primary/10 bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-50 pointer-events-none" />

          <CardHeader>
            <CardTitle>Options</CardTitle>
            <CardDescription>Enter your choices below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout" initial={false}>
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="flex gap-2 group"
                  >
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="bg-background/50 focus:bg-background transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addOption();
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                      className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity",
                        options.length <= 2 && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Button
              variant="outline"
              className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
              onClick={addOption}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Option
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 relative z-10">
            <Button
              size="lg"
              className={cn(
                "w-full text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow",
                isAnimating && "animate-pulse"
              )}
              onClick={pickOne}
              disabled={isAnimating || options.filter(o => o.trim()).length < 2}
            >
              {isAnimating ? (
                <Shuffle className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 mr-2" />
              )}
              {isAnimating ? "Choosing..." : "Pick For Me"}
            </Button>

            {result && !isAnimating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button variant="ghost" size="sm" onClick={reset} className="w-full text-muted-foreground hover:text-foreground">
                  Reset & Start Over
                </Button>
              </motion.div>
            )}
          </CardFooter>
        </Card>

        {/* Result Overlay / Display */}
        <AnimatePresence>
          {result && !isAnimating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
              onClick={() => { }}
            >
              <motion.div
                className="bg-card border border-primary/20 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
                layoutId="result-card"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mb-6 text-white shadow-xl shadow-primary/30"
                >
                  <Award className="w-12 h-12" />
                </motion.div>

                <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">The Winner Is</h2>
                <h3 className="text-5xl font-extrabold text-foreground mb-8 break-words leading-tight">{result}</h3>

                <div className="grid gap-3">
                  <Button size="lg" onClick={pickOne} className="w-full font-bold">
                    <Shuffle className="w-4 h-4 mr-2" /> Pick Again
                  </Button>
                  <Button variant="outline" onClick={() => setResult('')}>
                    Back to Edit
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
export default App;
