import React from "react";
import { Card, Typography, Box, Button, Grid } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface FishResultCardProps {
  commonName: string;
  scientificName: string;
  typeLabel: string;
  taxonomy: {
    class: string;
    order: string;
    family: string;
  };
  habitatInfo: {
    maxDepth: string;
    environment: string;
  };
  imageUrl?: string;
  statusLabel?: string;
  rarityLabel?: string;
  population?: string;
  region?: string;
  description?: string;
  onClick?: () => void;
}

const FishResultCard: React.FC<FishResultCardProps> = ({
  commonName,
  scientificName,
  imageUrl = "https://placehold.co/400x300/1a568b/ffffff?text=Fish",
  population = "N/A",
  region = "N/A",
  description,
  onClick,
}) => {
  const cardBg = "#1f2937";
  const infoBoxBg = "#2d384b";
  const titleColor = "#ffffff";
  const subtitleColor = "#b4c2d8";

  const viewButtonGradient = "linear-gradient(90deg, #2AB4C3 0%, #10b981 100%)";

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.5)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        bgcolor: cardBg,
        color: titleColor,
        border: "1px solid rgba(42, 180, 195, 0.12)",
        width: "100%",
        maxWidth: "320px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        mx: "auto",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #2AB4C3 0%, #10b981 100%)",
          opacity: 0,
          transition: "opacity 0.3s",
        },
        "&:hover": {
          boxShadow:
            "0 12px 32px rgba(42, 180, 195, 0.25), 0 0 0 1px rgba(42, 180, 195, 0.3)",
          transform: "translateY(-6px)",
          borderColor: "rgba(42, 180, 195, 0.3)",
          "&::before": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "68%",
          overflow: "hidden",
          backgroundColor: "#1a2332",
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt={commonName}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
        />
        {/* Gradient overlay for better text visibility */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background:
              "linear-gradient(to top, rgba(31, 41, 55, 0.8) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          p: 2.25,
          display: "flex",
          flexDirection: "column",
          bgcolor: cardBg,
          flexGrow: 1,
          gap: 1.5,
        }}
      >
        {/* Title Section */}
        <Box sx={{ flexShrink: 0, flexGrow: 0 }}>
          <Typography
            sx={{
              color: titleColor,
              fontWeight: 800,
              fontSize: "1.15rem",
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              mb: 0.75,
              height: "1.44em",
              letterSpacing: "-0.01em",
            }}
          >
            {commonName}
          </Typography>

          <Typography
            sx={{
              color: subtitleColor,
              fontSize: "0.88rem",
              fontStyle: "italic",
              opacity: 0.8,
              mb: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              height: "1.3em",
              fontWeight: 400,
            }}
          >
            {scientificName}
          </Typography>

          <Typography
            sx={{
              color: subtitleColor,
              fontSize: "0.83rem",
              lineHeight: 1.6,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              height: "3.99em",
              opacity: 0.85,
              fontWeight: 400,
              wordBreak: "break-word",
            }}
          >
            {description || "No description available."}
          </Typography>
        </Box>

        {/* Info Boxes */}
        <Box
          sx={{
            mt: "auto",
            flexShrink: 0,
          }}
        >
          <Grid container spacing={1.25}>
            <Grid item xs={6}>
              <Box
                sx={{
                  bgcolor: infoBoxBg,
                  p: 1.5,
                  borderRadius: 2,
                  minHeight: "80px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#323d52",
                    borderColor: "rgba(42, 180, 195, 0.2)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    color: subtitleColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    fontWeight: 700,
                    opacity: 0.7,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  Population
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: titleColor,
                    fontSize: "0.95rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.3,
                    mt: 0.5,
                  }}
                >
                  {population}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box
                sx={{
                  bgcolor: infoBoxBg,
                  p: 1.5,
                  borderRadius: 2,
                  minHeight: "80px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#323d52",
                    borderColor: "rgba(42, 180, 195, 0.2)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    color: subtitleColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    fontWeight: 700,
                    opacity: 0.7,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  Region
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: titleColor,
                    fontSize: "0.95rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.3,
                    mt: 0.5,
                  }}
                >
                  {region}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Action Button */}
        <Box
          sx={{
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          <Button
            onClick={onClick}
            fullWidth
            endIcon={<ArrowForwardIcon sx={{ fontSize: 19 }} />}
            sx={{
              height: 46,
              minHeight: 46,
              borderRadius: 2,
              background: viewButtonGradient,
              color: titleColor,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.98rem",
              boxShadow: "0 4px 12px rgba(42, 180, 195, 0.25)",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "1px solid rgba(42, 180, 195, 0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #10b981 0%, #2AB4C3 100%)",
                boxShadow: "0 6px 20px rgba(42, 180, 195, 0.45)",
                transform: "translateY(-2px)",
                borderColor: "rgba(42, 180, 195, 0.5)",
              },
              "&:active": {
                transform: "translateY(0px)",
              },
            }}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default FishResultCard;
