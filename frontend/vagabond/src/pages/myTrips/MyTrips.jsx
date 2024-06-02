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
		// Fetch current trip
		const tripDate = new Date();
		const stringTripDateStart = tripDate.toLocaleDateString('en-GB');
		const stringTripDateEnd = tripDate.toLocaleDateString('en-GB');
		console.log("Trip Date",stringTripDateStart);
		const currentTrip = {
			id: '43A',
			country: 'Germany',
			country_cod: 'de',
			city: 'Berlin',
			init_date: stringTripDateStart,
			finish_date: stringTripDateEnd,
		}
		setCurrentTrip(currentTrip);
		// Fetch user trips
		const fetchTrips = async () => {	
			const trips = await getUserTrips(auth.user.accessToken, auth.user.uid);
			if (!trips) return;
			setTrips(trips.travels);
		}

		fetchTrips();
	}, []);


  const handleLogout = () => {
    auth.logout()
    navigate('/login')
  }

  return (
    <Container component='section' maxWidth="xs">
			<Header />
			<Typography mb={2} textAlign="center" variant="h4" style={{ fontFamily: 'Inter', fontWeight: 600 }}>{texts('currentTrip')}</Typography>
			{currentTrip ? 
			<CountryCard 
				id={currentTrip.id}
				country={currentTrip.country} 
				country_cod={currentTrip.country_cod}
				city={currentTrip.city}
				init_date={currentTrip.init_date}
				finish_date={currentTrip.finish_date}
			/> 
				: " "}
			<Typography mb={2} mt={4} textAlign="center" variant="h4" style={{ fontFamily: 'Inter', fontWeight: 600 }}>{texts('yourTrips')}</Typography>
			<Stack spacing={2} mb={10}>
				{trips.map((trip, index) => {
					const tripDateStart = new Date(trip.init_date);
					const tripDateEnd = new Date(trip.finish_date);
					const stringTripDateStart = tripDateStart.toLocaleDateString('en-GB');
					const stringTripDateEnd = tripDateEnd.toLocaleDateString('en-GB');
					return (<CountryCard key={index}
						id={trip._id}
						country={trip.country}
						country_cod={trip.country_cod}
						city={trip.city}
						init_date={stringTripDateStart}
						finish_date={stringTripDateEnd}
						/>)
					}) ?? "No trips"
				}
			</Stack>
			<Button
				variant="contained"
				color="primary"
				size="large"
				onClick={() => navigate('/new_trip')}
				sx={{
					backgroundColor: '#2D6EFF',
					'& span': {
						fontFamily: 'Inter',
						fontWeight: 500,
					},
					position: 'fixed',
					bottom: 10,
					width: '90%',
					margin: 'auto',
					left: 0,
					right: 0,
				}}
			>
				Create a new trip
			</Button>
    </Container>
  );
};

export default MyTrips;