import React, { useState } from "react";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import Header from "../../../components/Header";
import HeaderTrip from "../../../components/HeaderTrip";
import { useLanguageContext } from "../../../context/languageContext";
import { LoadingButton } from "@mui/lab";

export default function FoodandMore() {
  let { state } = useLocation();
  console.log("State", state);

	const [food, setFood] = useState('');
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);

  const { t } = useLanguageContext();
  const texts = (data) => t(`foodandMore.${data}`);

	const handleFood = (e) => {
		e.preventDefault();
		console.log("Food", food);
	}

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
				<hr />
				<Typography variant="h6" fontWeight="bold">
					{texts('foodPedia')}
				</Typography>

				<Box component="form" mt={2} onSubmit={handleFood} sx={{display:"flex", gap:1}}>
					<TextField
          required
          label={texts('textField')}
          variant="outlined"
          fullWidth
          value={food}
          onChange={(e) => setFood(e.target.value)}
          sx={{
						height: 55,
            fontFamily: 'Inter',
            fontWeight: 400,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#2D6EFF', // Color del borde al estar seleccionado
              },
            },
            '& input': {
              fontFamily: 'Inter', 
            },
          }}
        />
				<LoadingButton loading={loading} type="submit" variant="contained" size="small" sx={{ width: "40%", height:55 }}>
          {texts("button")}
        </LoadingButton>
				</Box>
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
						minHeight: 100
          }}
        >
					<Typography
						variant="body1"
						fontWeight="bold"
						sx={{ margin: "auto" }}
					>
						{food}
					</Typography>
					<Typography variant="body2" sx={{ margin: "auto" }}>
						{description}
					</Typography>
				</Box>
				
      </Box>
    </Container>
  );
}
