import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../../../components/Header";
import HeaderTrip from "../../../components/HeaderTrip";
import { useLanguageContext } from "../../../context/languageContext";

export default function FoodandMore() {
  let { state } = useLocation();
  console.log("State", state);

  const { t } = useLanguageContext();
  const texts = (data) => t(`foodandMore.${data}`);

  return (
    <Container component="section" maxWidth="xs">
      <Header />
      <HeaderTrip
        mainPage={false}
        country={state?.country ?? " "}
        country_cod={state?.country_cod ?? " "}
        city={state?.city ?? " "}
        init_date={state?.init_date ?? " "}
        finish_date={state?.finish_date ?? " "}
      />
      <Typography
        mb={2}
        mt={2}
        textAlign="center"
        variant="h4"
        style={{ fontFamily: "Inter", fontWeight: 600 }}
      >
        {texts("title")}
      </Typography>
      <Box mt={4} mb={4}>
        <Typography variant="h6" fontWeight="bold">
          {texts("discover")}
        </Typography>
        <Box mt={2} pl={4} sx={{ width: "80%" }}>
          {state?.restaurant_recomendations?.map((restaurant) => {
            return <Typography variant="body1">{restaurant}</Typography>;
          })}
        </Box>
      </Box>
    </Container>
  );
}
