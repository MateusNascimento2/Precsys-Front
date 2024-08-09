import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ScrollToTopButton = () => {
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTopButton(true);
      } else {
        setShowScrollTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    showScrollTopButton && (
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-20 right-4 lg:bottom-10 size-10 bg-black dark:bg-white dark:text-black text-white rounded-full p-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        title="Voltar ao topo"
      >
        ↑
      </motion.button>
    )
  );
};

export default ScrollToTopButton;