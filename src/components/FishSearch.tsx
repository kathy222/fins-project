import React, { useState, useEffect } from "react";
import "./FishSearch.css";

// --- INTERFACES ---
export interface FishData {
  // Core Identity
  id: number;
  species_code: number;
  scientific_name: string;
  common_name: string;
  vernacular_name: string;

  // Taxonomy
  scientific_author: string;
  genus: string;
  genus_code: number;
  family: string;
  family_code: number;
  subfamily: string;

  // Classification Status
  taxonomic_issue: string;
  taxonomic_remarks: string;
  source: string;

  // Environment
  saltwater: boolean;
  freshwater: boolean;
  brackish: boolean;
  preferred_environment: string;

  // Physical Characteristics
  body_shape: string;
  dangerous_species: string;

  // Biological Features
  electrogenic: string;
  air_breathing: string;
  migration_type: string;

  // Size & Age Dimensions
  size_of_fish: string;
  min_depth: string;
  max_depth: string;
  common_shallow: string;
  common_deep: string;
  max_weight: string;
  max_age: string;

  // Conservation & Vulnerability
  fishing_vulnerability: string;
  fishing_vulnerability_value: number;
  vulnerability_climate_index: string;
  vulnerability_climate_value: number;
  phylogenetic_diversity: number;
  emblematic_species: boolean;

  // Commercial Data
  fisheries_importance: string;
  importance_remarks: string;
  used_as_bait: string;
  aquaculture_status: string;
  game_fish: boolean;

  // Market & Trade
  catching_methods: string; // main_method_using_fao_name
  other_catching_methods: string[]; // other_methods
  landings_statistics: string;
  landings_areas: string;
  price_category: string;
  price_reliability: string;

  // Aquarium
  aquarium_demand: string;
  aquarium_details: string;

  // Description
  description: string;
  comments: string;

  // --- EXTENDED TAXONOMIC DATA ---
  genus_details: any;
  family_details: any;
  order_details: any;
  class_details: any;
  common_names_list: any[];
}

// Interface for the temporary list to display names
interface SpeciesSummary {
  id: number;
  scientific_name: string;
  common_name: string;
}

// --- NEW INTERFACE FOR RANDOM FISH DATA (Includes full details for card display) ---
interface RandomFishSummary {
  id: number;
  scientific_name: string;
  common_name: string;
  photo_url: string;

  // Taxonomy for display
  class: string;
  order: string;
  family: string;

  // Habitat for display
  max_depth: string;
  environment: string;
}

export default function FishSearch({
  onFishFound,
}: {
  onFishFound?: (fish: FishData) => void;
}) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- NEW STATE FOR FEATURED FISH ---
  const [randomFishList, setRandomFishList] = useState<RandomFishSummary[]>([]);
  const [isRandomLoading, setIsRandomLoading] = useState(true);

  const [searchResultsList, setSearchResultsList] = useState<SpeciesSummary[]>(
    []
  );

  // *** HELPER: Capitalizes the first letter (CRUCIAL for Name/Genus matching) ***
  const capitalizeFirstLetter = (string: string): string => {
    if (!string) return "";
    const parts = string.trim().split(" ");
    if (parts.length > 1) {
      return (
        parts[0].charAt(0).toUpperCase() +
        parts[0].slice(1).toLowerCase() +
        " " +
        parts.slice(1).join(" ").toLowerCase()
      );
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Helper to extract dimensional data (UNCHANGED)
  const getDimensionValue = (dimensions: any[], type: string): string => {
    const dim = dimensions.find((d: any) => d.type === type);
    if (dim && dim.value) {
      const unit = dim.unit || "";
      if (type === "max weight" && dim.value > 1000 && unit === "kilograms") {
        return `${(dim.value / 1000).toFixed(1)} kg`;
      }
      return `${dim.value} ${unit}`;
    }
    return "N/A";
  };

  // Helper function to safely fetch and return JSON data (UNCHANGED)
  const fetchAndParse = async (url: string | null): Promise<any> => {
    if (url === null) {
      return {};
    }
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      // Return empty object on non-200 status for helper functions
      return {};
    } catch (e) {
      console.error(`Error fetching data from ${url}:`, e);
    }
    return {};
  };

  // Fetches the comprehensive data once the speciesCode is known (UNCHANGED)
  const fetchSpeciesDetails = async (
    speciesCode: number,
    commonName: string = "N/A"
  ) => {
    // 1. PRIMARY FETCH: Species details (Sequential to get genus/family codes)
    const detailsResponse = await fetch(
      `/api/resources/species/${speciesCode}`
    );
    if (!detailsResponse.ok) {
      // Throw a specific error if the main detail fetch fails (e.g., ID is invalid)
      throw new Error(
        `Αποτυχία λήψης στοιχείων είδους για ID ${speciesCode}. Status: ${detailsResponse.status}`
      );
    }
    const data = await detailsResponse.json();
    const dims = data.dimensions || [];

    // Extract codes needed for subsequent taxonomic calls
    const genusCode = data.genus?.genus_code;
    const familyCode = data.family?.family_code;

    // 2. PARALLEL FETCHES: Genus, Family, and Common Names List
    const [genusData, familyData, commonNamesData] = await Promise.all([
      fetchAndParse(genusCode ? `/api/resources/genus/${genusCode}` : null),
      fetchAndParse(familyCode ? `/api/resources/family/${familyCode}` : null),
      fetchAndParse(`/api/resources/common_name/${speciesCode}`),
    ]);

    const orderCode = familyData.order?.order_code;
    const classCode = familyData.class?.class_code;

    // 3. PARALLEL FETCHES: Order and Class Data
    const [orderData, classData] = await Promise.all([
      fetchAndParse(orderCode ? `/api/resources/order/${orderCode}` : null),
      fetchAndParse(classCode ? `/api/resources/class/${classCode}` : null),
    ]);

    // 4. Build comprehensive fish data object with ALL available fields
    const fishInfo: FishData = {
      id: data.id || speciesCode,
      species_code: speciesCode,
      scientific_name: data.scientific_name || "N/A",
      common_name:
        data.vernacular_name || data.common_name || commonName || "N/A",
      vernacular_name:
        data.vernacular_name || data.common_name || commonName || "N/A",

      scientific_author: data.scientific_name_assignment
        ? `${data.scientific_name_assignment.assigned_by} (${data.scientific_name_assignment.at_year})`
        : "N/A",
      genus: data.genus?.genus_name || "N/A",
      genus_code: data.genus?.genus_code || 0,
      family: data.family?.family_name || "N/A",
      family_code: data.family?.family_code || 0,
      subfamily: data.subfamily || "N/A",

      taxonomic_issue: data.taxonomic_issue?.issue || "None",
      taxonomic_remarks: data.taxonomic_issue?.remarks || "N/A",
      source: data.source || "N/A",

      saltwater: data.salt_water_environment || false,
      freshwater: data.freshwater_environment || false,
      brackish: data.brackish_water_environment || false,
      preferred_environment: data.preferred_environment || "N/A",

      body_shape: data.body_shape || "N/A",
      dangerous_species: data.dangerous_species_indicator || "N/A",
      electrogenic: data.electrogenic || "N/A",
      air_breathing: data.air_breathing_status || "N/A",
      migration_type: data.migration_type || "N/A",

      size_of_fish: getDimensionValue(dims, "max length"),
      min_depth: getDimensionValue(dims, "most shallow waters"),
      max_depth: getDimensionValue(dims, "most deep waters"),
      common_shallow: getDimensionValue(dims, "common shallow waters"),
      common_deep: getDimensionValue(dims, "common deep waters"),
      max_weight: getDimensionValue(dims, "max weight"),
      max_age: getDimensionValue(dims, "longevity wild"),

      fishing_vulnerability: data.vulnerability_fishing?.index || "N/A",
      fishing_vulnerability_value: data.vulnerability_fishing?.value || 0,
      vulnerability_climate_index: data.vulnerability_climate?.index || "N/A",
      vulnerability_climate_value: data.vulnerability_climate?.value || 0,
      phylogenetic_diversity: data.phylogenetic_diversity_index || 0,
      emblematic_species: data.emblematic_species || false,

      fisheries_importance: data.importance?.importance || "N/A",
      importance_remarks: data.importance?.remarks || "N/A",
      used_as_bait: data.used_as_bait || "N/A",
      aquaculture_status: data.used_for_aquaculture || "N/A",
      game_fish: data.world_record_game_fishes || false,

      // *** ΔΙΟΡΘΩΣΗ: Χρήση του σωστού κλειδιού 'catching_method' ***
      catching_methods:
        data.catching_method?.main_method_using_fao_name || "N/A",
      other_catching_methods: data.catching_method?.other_methods || [],
      landings_statistics: data.landings?.statistics || "N/A",
      landings_areas: data.landings?.areas || "N/A",
      price_category: data.price_category?.value || "N/A",
      price_reliability: data.price_category?.price_reliability || "N/A",

      aquarium_demand: data.aquarium_demand?.value || "N/A",
      aquarium_details: data.aquarium_demand?.details || "N/A",

      description: data.comments || "No description available.",
      comments: data.comments || "No description available.",

      genus_details: genusData,
      family_details: familyData,
      order_details: orderData,
      class_details: classData,
      common_names_list: commonNamesData.results || [],
    };

    console.log("Complete Fish Data:", fishInfo);
    if (onFishFound) onFishFound(fishInfo);
  };

  const searchDatabase = async (searchQuery: string) => {
    // Clear random fish list display when a search starts
    setRandomFishList([]);
    setIsLoading(true);
    setError(null);
    setSearchResultsList([]);

    const query = searchQuery.trim();
    const numericId = parseInt(query);
    const isIdSearch = !isNaN(numericId) && numericId > 0;

    try {
      let speciesCodeToFetch = 0;
      let resultsArray: number[] = []; // Array to collect IDs

      // 1. --- ID SEARCH ---
      if (isIdSearch) {
        speciesCodeToFetch = numericId;
      }
      // 2. --- NAME/GENUS SEARCH ---
      else {
        const capitalizedQuery = capitalizeFirstLetter(query);
        let searchData = null;

        // Attempt A: Search by Scientific Name
        let searchUrl = `/api/resources/search_species?scientific_name=${encodeURIComponent(
          capitalizedQuery
        )}`;
        let searchResponse = await fetch(searchUrl);
        searchData = searchResponse.ok ? await searchResponse.json() : null;

        if (searchData && searchData.results && searchData.results.length > 0) {
          resultsArray = searchData.results;
        }

        // Attempt B: Search by Genus (if scientific name failed or returned nothing)
        if (resultsArray.length === 0) {
          searchUrl = `/api/resources/search_species?genus=${encodeURIComponent(
            capitalizedQuery
          )}`;
          searchResponse = await fetch(searchUrl);
          searchData = searchResponse.ok ? await searchResponse.json() : null;

          if (
            searchData &&
            searchData.results &&
            searchData.results.length > 0
          ) {
            resultsArray = searchData.results;
          }
        }

        // Handle single result from name/genus search
        if (resultsArray.length === 1) {
          speciesCodeToFetch = resultsArray[0];
        }
      }
      // --- END SEARCH PHASE ---

      // 3. --- MULTI-RESULT HANDLING (List of Names) ---
      if (resultsArray.length > 1) {
        // Step A: Fetch names for all IDs in parallel
        const nameFetchPromises = resultsArray.map((id: number) =>
          fetch(`/api/resources/species/${id}`)
            .then((res) => {
              if (!res.ok) {
                // IMPORTANT: If the details are not found (404), throw to be caught below
                throw new Error(
                  `Invalid ID returned by search: ${id}. Status: ${res.status}`
                );
              }
              return res.json();
            })
            .then((data) => ({
              id: id,
              scientific_name: data.scientific_name || "N/A",
              common_name: data.common_name || data.vernacular_name || "N/A",
            }))
            // Catch errors for specific IDs, return null so they are filtered out.
            .catch((e) => {
              console.error(
                `Error processing ID ${id}. Skipping from list:`,
                e.message
              );
              return null;
            })
        );

        // Step B: Wait for all name fetches, filter out nulls (broken IDs), and set the list
        const rawResults: (SpeciesSummary | null)[] = await Promise.all(
          nameFetchPromises
        );
        const validResults: SpeciesSummary[] = rawResults.filter(
          (r) => r !== null
        ) as SpeciesSummary[];

        if (validResults.length === 0) {
          setError(
            `Η αναζήτηση βρέθηκε ακατάλληλα δεδομένα (IDs), δοκιμάστε πιο συγκεκριμένη αναζήτηση.`
          );
          setIsLoading(false);
          return;
        }

        setSearchResultsList(validResults);
        setIsLoading(false);
        return; // EXIT: Display list for user selection
      }

      if (speciesCodeToFetch > 0) {
        await fetchSpeciesDetails(
          speciesCodeToFetch,
          isIdSearch ? "N/A" : query
        );
      } else {
        // This handles cases where 0 results are found OR an invalid ID search
        setError(
          `Δεν βρέθηκε είδος με το ID ή την ονομασία/γένος: "${query}".`
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Προέκυψε άγνωστο σφάλμα κατά την αναζήτηση.";
      console.error("Search error:", err);
      setError(`Η αναζήτηση απέτυχε. Λεπτομέρειες: ${errorMessage}`);
    }

    setIsLoading(false);
  };

  const handleSearch = () => {
    if (query.trim()) {
      searchDatabase(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      handleSearch();
    }
  };

  // --- NEW FUNCTION: Fetch featured fish data (with corrected IDs) ---
  const fetchRandomFishData = async () => {
    setIsRandomLoading(true);

    // ✅ CORRECTED MAPPING: ID 1269 replaced with 137 to ensure 6 working API calls.
    const featuredFishMapping = [
      { id: 1051, placeholder: "Clownfish" },
      { id: 143, placeholder: "Tuna" },
      { id: 4082, placeholder: "Shark" },
      { id: 137, placeholder: "Reef Fish" }, // Replaced invalid 1269
      { id: 5849, placeholder: "Grouper" },
      { id: 137, placeholder: "Mackerel" },
    ];

    const fetchPromises = featuredFishMapping.map(async (item) => {
      try {
        // 1. Fetch main species data
        const detailResponse = await fetch(`/api/resources/species/${item.id}`);
        if (!detailResponse.ok) throw new Error("Species fetch failed");
        const data = await detailResponse.json();
        const dims = data.dimensions || [];

        // 2. Fetch family/class/order details
        const familyData = await fetchAndParse(
          data.family?.family_code
            ? `/api/resources/family/${data.family.family_code}`
            : null
        );
        const classData = await fetchAndParse(
          familyData.class?.class_code
            ? `/api/resources/class/${familyData.class.class_code}`
            : null
        );
        const orderData = await fetchAndParse(
          familyData.order?.order_code
            ? `/api/resources/order/${familyData.order.order_code}`
            : null
        );

        // 3. Image URL (Using descriptive placeholder as final fallback for reliability)
        const commonName =
          data.common_name || data.vernacular_name || item.placeholder;
        const photoUrl = `https://placehold.co/150x120/1a568b/ffffff?text=${item.placeholder.replace(
          / /g,
          "+"
        )}`;

        return {
          id: item.id,
          scientific_name: data.scientific_name || "N/A",
          common_name: commonName,
          photo_url: photoUrl,

          class: classData.name || "N/A",
          order: orderData.name || "N/A",
          family: data.family?.family_name || "N/A",

          max_depth: getDimensionValue(dims, "most deep waters"),
          environment: data.preferred_environment || "N/A",
        };
      } catch (e) {
        console.error(
          `Failed to fetch full featured fish details for ID ${item.id}:`,
          e
        );
        return null;
      }
    });

    const results = (await Promise.all(fetchPromises)).filter(
      (r): r is RandomFishSummary => r !== null
    ) as RandomFishSummary[];
    setRandomFishList(results);
    setIsRandomLoading(false);
  };

  // --- EFFECT HOOK: Load random fish on mount ---
  useEffect(() => {
    fetchRandomFishData();
  }, []);

  // --- MODIFIED INLINE COMPONENT: Clickable Card (Now uses real data fields) ---
  const FeaturedFishCard = ({ fish }: { fish: RandomFishSummary }) => (
    <div
      className="featured-list-card"
      onClick={() => fetchSpeciesDetails(fish.id, fish.common_name)}
    >
      <div className="card-photo-wrapper">
        <img
          src={fish.photo_url}
          alt={fish.scientific_name}
          className="featured-list-img"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Fallback to a simple ID placeholder if the descriptive placeholder fails
            target.src = `https://placehold.co/150x120/1f2937/ffffff?text=ID+${fish.id}`;
            target.onerror = null;
          }}
        />
      </div>

      <div className="card-info-main">
        <h3 className="card-common-name">{fish.common_name}</h3>
        <p className="card-scientific-name">{fish.scientific_name}</p>

        <div className="card-details-grid">
          <div className="card-taxonomy">
            <h4>Taxonomy:</h4>
            <p>
              Class: <span>{fish.class}</span>
            </p>
            <p>
              Order: <span>{fish.order}</span>
            </p>
            <p>
              Family: <span>{fish.family}</span>
            </p>
          </div>

          <div className="card-habitat">
            <h4>Habitat Info:</h4>
            <p>
              Max Depth: <span>{fish.max_depth}</span>
            </p>
            <p>
              Env: <span>{fish.environment}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ocean-bg">
      {/* ================================
        === CSS-STYLED HEADER WITH SEARCH BAR === 
        ================================
      */}
      <header className="fins-header">
        <div className="fins-logo-group">
          <div className="fins-title-container">
            <h1 className="fins-title">FINS</h1>
            <p className="fins-subtitle">Fish index Search Engine</p>
          </div>

          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/0926101c9de7b3c1c18e2604ce8f7ffd2ef493e7?width=222"
            alt="FINS Logo"
            className="fins-logo-img"
          />
        </div>

        <div className="header-search-container header-search-container-large">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search ID, Scientific Name or Genus"
            className="search-input header-search-input header-search-input-large"
            disabled={isLoading}
          />
          <button
            onClick={handleSearch}
            className="search-button header-search-button header-search-button-large"
            disabled={isLoading}
          >
            {isLoading ? "..." : "🔎"}
          </button>
        </div>

        <a href="/" className="fins-home-btn-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            stroke="white"
            strokeWidth="0"
            className="fins-home-btn-img"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z" />
          </svg>
        </a>
      </header>

      <div
        className="main-content-area"
        style={{
          width: "100%",
          maxWidth: "1100px",
          margin: "50px auto",
          padding: "0 20px",
          color: "var(--light-text-color)",
        }}
      >
        {searchResultsList.length === 0 && !error && !isLoading && (
          <div className="featured-section-wrapper">
            <h2 className="featured-title">✨ Featured Species List</h2>
            {isRandomLoading ? (
              <p style={{ textAlign: "center", color: "#60a5fa" }}>
                Loading featured fish...
              </p>
            ) : (
              <div className="featured-list-container">
                {randomFishList.map(
                  (
                    fish,
                    index // <-- ADDED INDEX HERE
                  ) => (
                    <FeaturedFishCard
                      key={`${fish.id}-${index}`} // <-- FIXED DUPLICATE KEY
                      fish={fish}
                    />
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. Display List of Multiple Search Results - NEW STYLES APPLIED */}
        {searchResultsList.length > 0 && (
          <div className="search-results-wrapper">
            <h3 className="search-results-title">
              Πολλαπλά Αποτελέσματα Βρέθηκαν:
            </h3>
            <p className="search-results-instruction">
              Παρακαλώ επιλέξτε το είδος που θέτελετε να δείτε αναλυτικά:
            </p>
            <ul className="search-results-list">
              {searchResultsList.map((result) => (
                <li
                  key={result.id}
                  onClick={() => {
                    // Trigger the full search using the selected ID
                    setQuery(result.id.toString());
                    searchDatabase(result.id.toString());
                  }}
                  className="search-result-item"
                >
                  <strong className="search-result-scientific">
                    {result.scientific_name || "N/A"}
                  </strong>{" "}
                  (
                  <span className="search-result-common">
                    {result.common_name || "N/A"}
                  </span>
                  )
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. Status/Error Display - RETAINED AND STYLED */}
        <div style={{ minHeight: "150px", marginTop: "24px" }}>
          {isLoading && (
            <p style={{ color: "#60a5fa", textAlign: "center" }}>
              🌊 Λήψη πλήρων δεδομένων από το FishBase...
            </p>
          )}

          {error && (
            <p
              style={{
                color: "#f87171",
                padding: "16px",
                border: "1px solid #ef4444",
                borderRadius: "8px",
                background: "rgba(31, 41, 55, 0.5)",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
