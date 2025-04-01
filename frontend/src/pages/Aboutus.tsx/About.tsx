// About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Assuming React Router is used for navigation

// Image URLs (Unsplash sources provided previously, simplified here)
const brainWaveImg = '/public/image.png'; // Replace with your local or hosted image path
const frequencyImg = '/public/image2.jpg';
const moodImg = '/public/image3.png';

const About: React.FC = () => {
  // Wave animation variants
  const waveVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Frequency Note Animation
  const noteVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative bg-gray-900 min-h-screen overflow-hidden text-white">
      {/* Wavy Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute w-full h-64 bg-indigo-900 opacity-20"
          variants={waveVariants}
          animate="animate"
          style={{ borderRadius: '50% 50% 0 0', transform: 'scaleX(2)' }}
        />
        <motion.div
          className="absolute w-full h-64 bg-purple-900 opacity-20 top-20"
          variants={waveVariants}
          animate="animate"
          style={{ borderRadius: '50% 50% 0 0', transform: 'scaleX(1.8)' }}
        />
      </div>

      {/* Back Arrow Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link to="/" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
          <svg
            className="w-8 h-8 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-lg">Back</span>
        </Link>
      </motion.div>

      {/* Floating Frequency Note */}
      <motion.div
        className="absolute top-10 right-10 w-16 h-16 text-indigo-400 z-20"
        variants={noteVariants}
        animate="animate"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.05-7.44 7-7.93V17.93zm2-13.86c3.95.49 7 3.85 7 7.93s-3.05 7.44-7 7.93V4.07z" />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
        >
          About Sonic Vibes
        </motion.h1>

        {/* Section 1: What is Sonic Vibes? */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold text-center mb-6">What is Sonic Vibes?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">
                Sonic Vibes is a web-based platform that uses sound frequencies to transform your mood and enhance well-being. Inspired by brainwave entrainment and ancient sound healing, we bring you a modern tool to tune your mind like an instrument.
              </p>
              <p className="text-lg leading-relaxed">
                Whether you’re seeking calm, focus, or deep sleep, our carefully crafted audio vibrations sync with your brain to deliver the state you need—anytime, anywhere.
              </p>
            </div>
            <div>
              <img
                src={brainWaveImg}
                alt="Brain Waves Visualization"
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-sm text-gray-400 italic mt-2">
                Brain wave patterns influenced by sound frequencies.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 2: How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold text-center mb-6">How Does It Work?</h2>
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg border border-purple-500/20">
            <ul className="space-y-6">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                <div>
                  <strong className="text-indigo-400">Brainwave Entrainment:</strong> Rhythmic sounds guide your brainwaves—Delta (0.5-4 Hz) for sleep, Theta (4-8 Hz) for relaxation, Alpha (8-12 Hz) for calm focus, or Beta (12-30 Hz) for alertness.
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                <div>
                  <strong className="text-purple-400">Binaural Beats:</strong> Two slightly different tones (e.g., 300 Hz and 310 Hz) create a perceived 10 Hz beat, aligning your brain to that frequency via headphones.
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                <div>
                  <strong className="text-indigo-400">Resonance Effect:</strong> Specific frequencies (e.g., 432 Hz for calm, 528 Hz for healing) resonate with your body’s natural vibrations, promoting harmony.
                </div>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Section 3: The Science Behind It */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold text-center mb-6">The Science Behind Sonic Vibes</h2>
          <div className="space-y-8">
            <div>
              <p className="text-lg leading-relaxed text-center mb-6">
                Sound vibrations interact with your body and mind, influencing everything from brain activity to stress levels. Here’s the science that powers Sonic Vibes:
              </p>
              <img
                src={frequencyImg}
                alt="Frequency Wave Patterns"
                className=" rounded-lg shadow-lg  border border-purple-500/20"
              />
              <p className="text-sm text-gray-400 italic text-center mt-2">
                Sound wave patterns used in frequency therapy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg">
                <h3 className="text-xl font-semibold text-indigo-400 mb-2">Physics of Sound</h3>
                <p className="text-lg">
                  Sound travels as waves measured in Hertz (Hz). The Frequency Following Response (FFR) shows that your brain syncs with these rhythms, mimicking states like sleep or focus.
                </p>
              </div>
              <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-400 mb-2">Biological Effects</h3>
                <p className="text-lg">
                  Frequencies can lower cortisol, regulate heart rate, and boost dopamine. Low tones calm the nervous system, while higher ones enhance alertness.
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg">
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">Historical Roots</h3>
              <p className="text-lg">
                From Tibetan singing bowls to Gregorian chants, ancient cultures used sound to heal. Sonic Vibes modernizes this wisdom with precise, science-backed frequencies.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 4: Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-semibold text-center mb-6">Benefits of Sonic Vibes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg">
              <h3 className="font-semibold text-indigo-400">Stress Relief</h3>
              <p className="text-sm mt-2">Theta waves (4-8 Hz) reduce stress and promote calm.</p>
            </div>
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg">
              <h3 className="font-semibold text-purple-400">Enhanced Creativity</h3>
              <p className="text-sm mt-2">Alpha waves (8-12 Hz) spark inspiration and flow.</p>
            </div>
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg">
              <h3 className="font-semibold text-indigo-400">Deep Sleep</h3>
              <p className="text-sm mt-2">Delta waves (0.5-4 Hz) guide you into restful sleep.</p>
            </div>
          </div>
          <img
            src={moodImg}
            alt="Mood Transformation"
            className="w-full  rounded-lg shadow-lg border border-indigo-500/20"
          />
          <p className="text-sm text-gray-400 italic text-center mt-2">
            Mood transformation through sound frequencies.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;