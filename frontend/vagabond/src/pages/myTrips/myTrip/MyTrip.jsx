import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useLanguageContext } from "../../../context/languageContext";

import { Box, Container, Typography } from "@mui/material";

import Header from "../../../components/Header";
import HeaderTrip from "../../../components/HeaderTrip";
import ButtonCard from "../../../components/ButtonCard";

import { getTrip } from "../../../utils/connections";


export default function MyTrip() {
  let { id } = useParams();
  const [trip, setTrip] = useState(null);

  const auth = useAuth();

  const { t } = useLanguageContext();
  const texts = (data) => t(`myTrip.${data}`);

  useEffect(() => {
    const token = auth.user.accessToken;
    const fetchTrip = async () => {
      const trip = await getTrip(token, id);
      if (!trip) return;
      const tripInfo = trip.travel;
      const startDate = new Date(tripInfo.init_date);
      const endDate = new Date(tripInfo.finish_date);
      const stringInitDate = (tripInfo.init_date =
        startDate.toLocaleDateString("en-GB"));
      const stringFinishDate = (tripInfo.finish_date =
        endDate.toLocaleDateString("en-GB"));
      const formatedTrip = {
        ...tripInfo,
        init_date: stringInitDate,
        finish_date: stringFinishDate,
      };
      //console.log("tripInfo", formatedTrip);
      setTrip(formatedTrip);
    };
    fetchTrip();
  }, [auth,id]);

  return (
    <Container component="section" maxWidth="xs">
      <Header />
      <HeaderTrip
        mainPage={true}
        country={trip?.country ?? " "}
        country_cod={trip?.country_cod ?? " "}
        city={trip?.city ?? " "}
        init_date={trip?.init_date ?? " "}
        finish_date={trip?.finish_date ?? " "}
      />

      <Box mt={4} mb={4}>
        <ButtonCard
          imageLink="/Images/Checklist.jpeg"
          title={texts("mustButton")}
          clickLink="my_checklist"
          trip={trip}
        />

        <hr />

        <ButtonCard
          imageLink="/Images/Food1.jpeg"
          title={texts("foodButton")}
          clickLink="foodandmore"
          trip={trip}
        />

        <hr />

        <Typography variant="h5" textAlign="center" fontWeight="bold">
          {texts("interesting")}
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
          {trip ? (
            trip.suggestions.map((suggestion, index) => {
              return (
                <div key={index} style={{ marginTop: "10px" }}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ margin: "auto" }}
                  >
                    {suggestion.location}
                  </Typography>
                  <Typography variant="body2" sx={{ margin: "auto" }}>
                    {suggestion.description}
                  </Typography>
                </div>
              );
            })
          ) : (
            <p></p>
          )}
        </Box>
      </Box>
    </Container>
  );
}
