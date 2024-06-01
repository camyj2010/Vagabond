import React from "react";
import { useParams } from "react-router-dom";

import { Box, Container, Typography } from "@mui/material";

import Header from "../../../components/Header";
import HeaderTrip from "../../../components/HeaderTrip";
import ButtonCard from "../../../components/ButtonCard";

export default function MyTrip() {
  let { id } = useParams();

  return (
    <Container component="section" maxWidth="xs">
      <Header />
      <HeaderTrip mainPage={true} />

      <Box mt={4}>
        <ButtonCard
          imageLink="/Images/Checklist.jpeg"
          title="Must-bring checklist"
          clickLink="/Edit"
        />

        <hr />

        <ButtonCard
          imageLink="/Images/Food1.jpeg"
          title="Food and More"
          clickLink="/Edit"
        />

        <hr />

        <Typography variant="h5" textAlign="center" fontWeight="bold">
          Interesting Places
        </Typography>
        <Box
          mt={2}
          sx={{
            width: "90%",
            padding: 2,
            marginInline: "auto",
            borderStyle: "solid",
            borderColor: "#e0e0e0",
            borderWidth: "1px",
            borderRadius: "10px",
            color: "#000",
          }}
        >
          <Typography variant="body1" fontWeight="bold" sx={{ margin: "auto" }}>
            {" "}
            Barcelona{" "}
          </Typography>
          <Typography variant="body2" sx={{ margin: "auto" }}>
            {" "}
            The Berlin Zoo, also known as Zoologischer Garten Berlin, is one of
            the oldest and most renowned zoos in the world. Established in 1844,
            it is located in the heart of Berlin, Germany. The zoo is home to a
            vast array of species, boasting one of the most diverse animal
            collections globally, including rare and endangered species. The
            Berlin Zoo is famous for its historical architecture, extensive
            conservation efforts, and educational programs,{" "}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
