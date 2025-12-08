import InfoPage from "./components/InfoPage";
import { useState, useEffect, useCallback } from "react";
import LandingPage from "./components/LandingPage";
import IntroPage from "./components/IntroPage";
import FishSearch from "./components/FishSearch";
import type { FishData } from "./components/FishSearch";
// import "./App.css";

const INTRO_DURATION_MS = 5000; // 5 seconds

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  // State to hold the data for the detailed view
  const [selectedFish, setSelectedFish] = useState<FishData | null>(null);

  const handleLandingCtaClick = useCallback(() => {
    setCurrentPage("intro");
  }, []);

  useEffect(() => {
    if (currentPage === "intro") {
      const timer = setTimeout(() => {
        setCurrentPage("search");
      }, INTRO_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  /**
   * Called by FishSearch when a search result is selected.
   * Switches the view to the InfoPage.
   */
  const handleFishSelected = (fish: FishData) => {
    setSelectedFish(fish);
    setCurrentPage("info");
  };

  /**
   * 🐠 NEW: Called by InfoPage when the back button is clicked.
   * Clears the selected fish data and switches the view back to the SearchPage.
   */
  const handleGoBack = () => {
    setSelectedFish(null);
    setCurrentPage("search");
  };

  const renderPage = () => {
    if (currentPage === "landing")
      return <LandingPage onCtaClick={handleLandingCtaClick} />;

    if (currentPage === "intro") return <IntroPage />;

    if (currentPage === "search")
      return <FishSearch onFishFound={handleFishSelected} />;

    // Conditional render for InfoPage
    if (currentPage === "info") {
      if (selectedFish) {
        return <InfoPage fish={selectedFish} onGoBack={handleGoBack} />;
      }
      // Fallback
      return <div>Error: Fish data not found.</div>;
    }

    return null;
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;
