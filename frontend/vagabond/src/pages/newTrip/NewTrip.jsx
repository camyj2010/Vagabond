import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { Autocomplete, Box, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useLanguageContext } from "../../context/languageContext";
import countries from "../../utils/countries";
import { useAuth } from "../../context/authContext";

import styles from "./NewTrip.module.css";
import { createNewTrip } from "../../utils/connections";

export default function NewTrip() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [countryValue, setCountryValue] = useState(null);
  const [countryInput, setCountryInput] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [startDateValue, setStartDateValue] = useState("");
  const [endDateValue, setEndDateValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);

  const [loading, setLoading] = useState(false);

  const { t, i18n } = useLanguageContext();

  const texts = (data) => t(`newTrip.${data}`);

  const handleNewTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = auth.user.accessToken;
    const startDate = new Date(`${startDateValue}T00:00:00Z`);
		const endDate = new Date(`${endDateValue}T00:00:00Z`);
		startDate.setDate(startDate.getDate() + 1);
		endDate.setDate(endDate.getDate() + 1);

    let language;
    i18n.language === "es"
      ? (language = "espanish")
      : i18n.language === "it"
      ? (language = "italian")
      : i18n.language === "fr"
      ? (language = "french")
      : i18n.language === "de"
      ? (language = "german")
      : i18n.language === "pt"
      ? (language = "portuguese")
      : (language = "english");

    const data = {
      country: countryValue.label,
      country_cod: countryValue.code,
      language: language,
      city: cityValue,
      init_date: startDate,
      finish_date: endDate,
      description: descriptionValue,
      firebase_id: auth.user.uid,
    };
    const response = await createNewTrip(data,token)
    console.log(response)
    setLoading(false);
    navigate('/my_trips')
  };

  const handleStartDate = (e) => {
    if (!endDateValue) {
      setStartDateError(false);
      setStartDateValue(e.target.value);
      return;
    }
    if (e.target.value > endDateValue) {
      setStartDateError(true);
      return;
    }
    setStartDateError(false);
    setStartDateValue(e.target.value);
  };

  const handleEndDate = (e) => {
    if (!startDateValue) {
      setEndDateError(false);
      setEndDateValue(e.target.value);
      return;
    }
    if (e.target.value < startDateValue) {
      console.log("End date", e.target.value, "Start date", startDateValue);
      setEndDateError(true);
      return;
    }
    setEndDateError(false);
    setEndDateValue(e.target.value);
  };

  return (
    <Box textAlign="center" component="section" sx={{ px: 3, pb: 2 }}>
      <Header />
      <Typography
        variant="h3"
        sx={{ fontFamily: "Inter", fontWeight: 600, mt: 3 }}
      >
        {texts("title")}
      </Typography>
      <Stack
        component="form"
        onSubmit={handleNewTrip}
        textAlign="start"
        marginTop={5}
        spacing={4}
      >
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
        <Stack direction="row" spacing={1} width={"60%"}>
          <div className={styles.dateLabels}>
            <Typography
              variant="body1"
              mb={2}
              style={{ fontFamily: "Inter", fontWeight: 600 }}
            >
              {texts("startDate")}
            </Typography>
            <TextField
              id="date"
              type="date"
              error={startDateError}
              value={startDateValue}
              sx={{ width: "100%" }}
              helperText={
                startDateError
                  ? "La fecha de inicio debe de ser anterior a la fecha de finalizacion."
                  : ""
              }
              onChange={(e) => handleStartDate(e)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className={styles.dateLabels}>
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
              error={endDateError}
              value={endDateValue}
              sx={{ width: "100%" }}
              helperText={
                endDateError
                  ? "La fecha de finalizacion debe de ser posterior a la fecha de inicio."
                  : ""
              }
              onChange={(e) => handleEndDate(e)}
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
        <LoadingButton
          loading={loading}
          type="submit"
          variant="contained"
          size="large"
          sx={{ width: "100%", mt: 1 }}
        >
          {texts("button")}
        </LoadingButton>
      </Stack>
    </Box>
  );
}
