import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [bgColor, setBgColor] = useState("");

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    localStorage.getItem("bgColor")
      ? setBgColor(localStorage.getItem("bgColor"))
      : setBgColor("#e50e0e");
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`z-[100] cursor-pointer fixed bottom-10 right-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={scrollToTop}
        className="border-0 text-white text-center rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110"
        style={{ backgroundColor: bgColor }}
      >
        <i className="fa fa-arrow-up p-3"></i>
      </div>
    </div>
  );
};

export default ScrollToTop;
