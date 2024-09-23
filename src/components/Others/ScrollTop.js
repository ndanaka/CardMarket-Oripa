// src/ScrollToTop.js
import { useEffect, useState } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`z-[100] fixed bottom-10 right-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={scrollToTop}
        className="bg-gradient-radical border-0 text-white text-center rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110"
      >
        <i className='fa fa-arrow-up p-3'></i>
      </div>
    </div>
  );
};

export default ScrollToTop;
