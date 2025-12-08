import backgroundImage from "../assets/background.png";
import fish2Image from "../assets/fish2.png";
import "./IntroPage.css";

export default function IntroPage() {
  return (
    <div className="intro-container">
      {/* 1. Full-Screen Background Image Layer */}
      <div className="intro-bg-layer">
        <img
          src={backgroundImage}
          alt="Intro Background"
          className="intro-bg-img"
        />
      </div>

      {/* 2. Central Image Layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <img
          src={fish2Image}
          alt="Central fish logo"
          className="intro-fish-center"
        />
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <h1 className="intro-title">
          <span className="intro-color-light letter-f">F</span>
          <span className="intro-color-dark letter-i">I</span>{" "}
          <span className="intro-color-dark letter-n">N</span>{" "}
          <span className="intro-color-light letter-s">S</span>
        </h1>
      </div>
    </div>
  );
}
