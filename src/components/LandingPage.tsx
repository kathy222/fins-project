import "./LandingPage.css";
import backgroundImage from "../assets/darkoxygen.jpg";
import desktopFish from "../assets/fish.png";
import logoImage from "../assets/logo.png";
import tutorialImage from "../assets/tutorial.png";

interface LandingPageProps {
  onCtaClick: () => void; // Tells TypeScript that this prop is a function returning nothing
}

export default function LandingPage({ onCtaClick }: LandingPageProps) {
  return (
    <div className="fins-container">
      {/* Background Image */}
      <div className="fins-bg-container">
        <img src={backgroundImage} alt="Ocean background" className="" />
      </div>

      {/* Overlay */}
      <div className="fins-overlay bg-ocean-overlay" />

      {/* Content Container */}
      <div className="fins-content">
        {/* Header / Logo */}
        <header className="fins-header">
          <div className="fins-logo-group">
            <div className="fins-logo-text">
              <h1 className="text-white">FINS</h1>
              <p className="text-white">Fish index Search Engine</p>{" "}
            </div>
            <img src={logoImage} alt="Fish logo" className="fins-logo-img" />
          </div>
        </header>

        {/* Main Content */}
        <main className="fins-main">
          <div className="fins-grid">
            {/* Left Column - Text Content */}
            <div className="fins-text-content">
              {/* Main Headline */}
              <h2 className="fins-headline text-ocean-headline">
                Discover the
                <br />
                Ocean's Beauty
              </h2>

              {/* Description */}
              <p className="fins-description text-ocean-text ">
                Explore thousands of fish species with our comprehensive
                database. Search by name, habitat, or characteristics.
              </p>

              {/* CTA Button */}
              <button
                className="fins-cta-button bg-ocean-button shadow-button-inset"
                onClick={onCtaClick}
              >
                <span className="text-ocean-button-text ">Try diving in</span>
              </button>
            </div>

            {/* Right Column - Fish Image (Desktop) */}
            <div className="fins-desktop-fish">
              <img src={desktopFish} alt="Colorful betta fish" className="" />
            </div>
          </div>

          {/* Bottom Preview Image (Desktop) */}
          <div className="fins-bottom-preview">
            <img src={tutorialImage} alt="Fish database preview" className="" />
          </div>
        </main>
      </div>
    </div>
  );
}
