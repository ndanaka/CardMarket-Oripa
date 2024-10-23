import { useEffect, useState } from "react";
import api from "../../utils/api";

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
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    getThemeData();
  }, [bgColor]);

  const getThemeData = async () => {
    if (!localStorage.getItem("bgColor")) {
      const res = await api.get("/admin/getThemeData");
      if (res.data.status === 1 && res.data.theme) {
        if (res.data.theme.bgColor) {
          setBgColor(res.data.theme.bgColor);
          localStorage.setItem("bgColor", res.data.theme.bgColor);
        }
      } else {
        setBgColor("#e50e0e");
      }
    } else {
      setBgColor(localStorage.getItem("bgColor"));
    }
  };

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
