import React from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { Box, Container, Button, Typography } from "@mui/material";

const MyTrips = () => {
  const auth = useAuth();
  console.log(auth.user.email);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout()
    navigate('/login')
  }

  return (
    <Container maxWidth="xs">
      <Box component="form" mt={10} onSubmit={handleLogout}>
        <Typography mb={2} textAlign="center" variant="h4" style={{ fontFamily: 'Inter', fontWeight: 600 }}>Bienvenido: {auth.user.email}</Typography>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{
            mt: 2,
            backgroundColor: '#2D6EFF',
            '&:hover': {
              backgroundColor: 'blue',
            },
            '& span': {
              fontFamily: 'Inter',
              fontWeight: 500,
            },
          }}
        >
          Log Out
        </Button>
      </Box>
			<Button
				variant="contained"
				color="primary"
				fullWidth
				size="large"
				onClick={() => navigate('/new_trip')}
				sx={{
					mt: 2,
					backgroundColor: '#2D6EFF',
					'&:hover': {
						backgroundColor: 'blue',
					},
					'& span': {
						fontFamily: 'Inter',
						fontWeight: 500,
					},
				}}
			>
				Create a new trip
			</Button>
    </Container>
  );
};

export default MyTrips;