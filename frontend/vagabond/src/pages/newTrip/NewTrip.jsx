import React, { useState } from "react";
import Header from "../../components/Header";
import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useLanguageContext } from "../../context/languageContext";
import countries from "../../utils/countries";

import styles from "./NewTrip.module.css";

export default function NewTrip() {
  const [countryValue, setCountryValue] = useState(null);
  const [countryInput, setCountryInput] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [startDateValue, setStartDateValue] = useState("");
	const [endDateValue, setEndDateValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");

  const { t } = useLanguageContext();

  const texts = (data) => t(`newTrip.${data}`);

	const handleNewTrip = async(e) => {
		e.preventDefault();
		console.log("Country value", countryValue);
		console.log("City value", cityValue);
		console.log("Start date value", startDateValue);
		console.log("End date value", endDateValue);
    console.log("Description value", descriptionValue);
	}
  return (
    <Box textAlign="center" component="section" sx={{ px: 3, pb: 2 }}>
      <Header />
      <Typography
        variant="h3"
        sx={{ fontFamily: "Inter", fontWeight: 600, mt: 3 }}
      >
        {texts("title")}
      </Typography>
      <Stack component="form" onSubmit={handleNewTrip} textAlign="start" marginTop={5} spacing={4}>
        <div className={styles.labels}>
          <Typography
            variant="body1"
            mb={2}
            style={{ fontFamily: "Inter", fontWeight: 600 }}
          >
            {texts("country")}
          </Typography>
          <Autocomplete
            id="country-select-demo"
            fullWidth
            value={countryValue}
            onChange={(event, newValue) => {
              setCountryValue(newValue);
            }}
            options={countries}
            autoHighlight
            onInputChange={(event, newInputValue) => {
              setCountryInput(newInputValue);
            }}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                <img
                  loading="lazy"
                  width="20"
                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  alt=""
                />
                {option.label} ({option.code})
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={texts("countryLabel")}
                value={countryInput}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
              />
            )}
          />
        </div>
        <div className={styles.labels}>
          <Typography
            variant="body1"
            mb={2}
            style={{ fontFamily: "Inter", fontWeight: 600 }}
          >
            {texts("city")}
          </Typography>
          <TextField
            fullWidth
            id="outlined-city"
            label={texts("cityLabel")}
            variant="outlined"
						value={cityValue}
            onChange={(e) => {
              setCityValue(e.target.value);
            }}
          />
        </div>
        <Stack direction="row" spacing={2}>
          <div className={styles.labels}>
            <Typography
              variant="body1"
              mb={2}
              style={{ fontFamily: "Inter", fontWeight: 600 }}
            >
              {texts("strartDate")}
            </Typography>
            <TextField
              id="date"
              type="date"
              value={startDateValue}
							onChange={(e) => setStartDateValue(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className={styles.labels}>
            <Typography
              variant="body1"
              mb={2}
              style={{ fontFamily: "Inter", fontWeight: 600 }}
            >
              {texts("endDate")}
            </Typography>
            <TextField
              id="date"
              type="date"
              value={endDateValue}
							onChange={(e) => setEndDateValue(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </Stack>
        <div className={styles.labels}>
          <Typography
            variant="body1"
            mb={2}
            style={{ fontFamily: "Inter", fontWeight: 600 }}
          >
            {texts("describeTrip")}
          </Typography>
          <TextField
            fullWidth
            id="outlined-description"
            label={texts("describeTrip")}
            variant="outlined"
            multiline
            rows={6}
            value={descriptionValue}
            onChange={(e) => setDescriptionValue(e.target.value)}
          />
        </div>
        <Button type="submit" variant="contained" size="large" sx={{ width: "100%", mt: 1 }}>
          {texts("button")}
        </Button>
      </Stack>
    </Box>
  );
}
