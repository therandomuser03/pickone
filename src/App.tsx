import { useState } from 'react';
import './App.css'

import { Plus, X, Shuffle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [options, setOptions] = useState(['']);
  const [result, setResult] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const pickOne = () => {
    const validOptions = options.filter(option => option.trim() !== '');
    
    if (validOptions.length < 2) {
      alert('Please add at least 2 valid options!');
      return;
    }

    setIsAnimating(true);
    
    // Simulate spinning animation
    let counter = 0;
    const maxCounter = 20;
    const interval = setInterval(() => {
      const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
      setResult(randomOption);
      counter++;
      
      if (counter >= maxCounter) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 100);
  };

  const reset = () => {
    setResult('');
    setOptions(['']);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 pt-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="text-yellow-400" />
            </motion.div>
            PickOne
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.5 }}
            >
              <Sparkles className="text-yellow-400" />
            </motion.div>
          </motion.h1>
          <motion.p 
            className="text-purple-200 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Can't decide? Let us pick for you!
          </motion.p>
        </motion.div>

        {/* Options Input */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-4">Add Your Options</h2>
          
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {options.map((option, index) => (
                <motion.div 
                  key={index} 
                  className="flex gap-3"
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div className="flex-1">
                    <motion.input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  {options.length > 1 && (
                    <motion.button
                      onClick={() => removeOption(index)}
                      className="px-3 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 rounded-lg text-red-300 hover:text-red-200 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={20} />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={addOption}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 rounded-lg text-green-300 hover:text-green-200 transition-all font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Plus size={20} />
            Add Another Option
          </motion.button>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={pickOne}
            disabled={isAnimating}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <Shuffle size={24} />
            {isAnimating ? 'Picking...' : 'Pick One!'}
          </button>
          
          {result && (
            <button
              onClick={reset}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-medium transition-all"
            >
              Reset
            </button>
          )}
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-lg rounded-2xl p-8 border border-yellow-400/30 text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">
              🎉 The winner is...
            </h3>
            <div className={`text-4xl font-bold text-yellow-300 transition-all duration-200 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
              {result}
            </div>
            {!isAnimating && (
              <p className="text-white/80 mt-4">
                There you have it! Sometimes the best decisions come from letting chance decide.
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-white/60">
          <p>Perfect for choosing restaurants, movies, activities, and more!</p>
        </div>
      </div>
    </div>
  );
}

export default App;