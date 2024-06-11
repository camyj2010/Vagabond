import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { Container, Button, Typography, Stack } from "@mui/material";
import Header from "../../components/Header";
import { useLanguageContext } from "../../context/languageContext";
import CountryCard from "../../components/CountryCard";
import { getUserTrips } from "../../utils/connections";

const MyTrips = () => {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [trips, setTrips] = useState([]);

  const auth = useAuth();

  const navigate = useNavigate();

  const { t } = useLanguageContext();
  const texts = (data) => t(`myTrips.${data}`);

  useEffect(() => {
    // Fetch user trips
    const fetchTrips = async () => {
      const trips = await getUserTrips(auth.user.accessToken, auth.user.uid);
      console.log("Trips", trips);
      if (!trips) return;
      setTrips(trips.travels);
			if(trips.currentTravel){
      const currentTripDateStart = new Date(trips.currentTravel.init_date);
      const currentTripDateEnd = new Date(trips.currentTravel.finish_date);
      const stringCTripDateStart = currentTripDateStart.toLocaleDateString("en-GB");
      const stringCTripDateEnd = currentTripDateEnd.toLocaleDateString("en-GB");

      const currentTrip = {
        _id: trips.currentTravel._id,
        country: trips.currentTravel.country,
        country_cod: trips.currentTravel.country_cod,
        city: trips.currentTravel.city,
        init_date: stringCTripDateStart,
        finish_date: stringCTripDateEnd,
      };
      setCurrentTrip(currentTrip);
			}
    };

    fetchTrips();
  }, [auth]);

  return (
    <Container component="section" maxWidth="xs">
      <Header />
      <Typography
        mb={2}
        textAlign="center"
        variant="h4"
        style={{ fontFamily: "Inter", fontWeight: 600 }}
      >
        {texts("currentTrip")}
      </Typography>
      {currentTrip ? (
        <CountryCard
          id={currentTrip?._id}
          country={currentTrip?.country}
          country_cod={currentTrip?.country_cod}
          city={currentTrip?.city}
          init_date={currentTrip?.init_date}
          finish_date={currentTrip?.finish_date}
        />
      ) : <p></p>}
      <Typography
        mb={2}
        mt={4}
        textAlign="center"
        variant="h4"
        style={{ fontFamily: "Inter", fontWeight: 600 }}
      >
        {texts("yourTrips")}
      </Typography>
      <Stack spacing={2} mb={10}>
        {trips.map((trip, index) => {
          const tripDateStart = new Date(trip.init_date);
          const tripDateEnd = new Date(trip.finish_date);
          const stringTripDateStart = tripDateStart.toLocaleDateString("en-GB");
          const stringTripDateEnd = tripDateEnd.toLocaleDateString("en-GB");
          return (
            <CountryCard
              key={index}
              id={trip._id}
              country={trip.country}
              country_cod={trip.country_cod}
              city={trip.city}
              init_date={stringTripDateStart}
              finish_date={stringTripDateEnd}
            />
          );
        }) ?? "No trips"}
      </Stack>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate("/new_trip")}
        sx={{
          backgroundColor: "#2D6EFF",
          "& span": {
            fontFamily: "Inter",
            fontWeight: 500,
          },
          position: "fixed",
          bottom: 10,
          width: "90%",
          margin: "auto",
          left: 0,
          right: 0,
        }}
      >
				{texts("button")}
      </Button>
    </Container>
  );
};

export default MyTrips;
