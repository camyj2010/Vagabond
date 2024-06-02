import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../../../context/authContext";
import { useLanguageContext } from "../../../context/languageContext";
import { deleteTrip, getTrip, updateTrip } from "../../../utils/connections";
import { LoadingButton } from "@mui/lab";

import styles from "./EditTrip.module.css";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTrip() {
  const auth = useAuth();
  let { id } = useParams();
  const navigate = useNavigate();

  const [country, setCountry] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [startDateValue, setStartDateValue] = useState("");
  const [endDateValue, setEndDateValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
	const [originalStartDate, setOriginalStartDate] = useState("");
	const [originalEndDate, setOriginalEndDate] = useState("");
	const [originalDescription, setOriginalDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useLanguageContext();

  const texts = (data) => t(`editTrip.${data}`);

  useEffect(() => {
    const token = auth.user.accessToken;
    const fetchTrip = async () => {
      const trip = await getTrip(token, id);
      if (!trip) return;
      const tripInfo = trip.travels[0];
      const startDate = new Date(tripInfo.init_date);
      const endDate = new Date(tripInfo.finish_date);
      const stringInitDate = startDate.toISOString().split("T")[0];
      const stringEndDate = endDate.toISOString().split("T")[0];
      const formatedTrip = {
        ...tripInfo,
        init_date: stringInitDate,
        finish_date: stringEndDate,
      };
      //console.log("tripInfo", formatedTrip);
      setCountry(formatedTrip.country);
      setCityValue(formatedTrip.city);
      setStartDateValue(formatedTrip.init_date);
      setEndDateValue(formatedTrip.finish_date);
      setDescriptionValue(formatedTrip.description);

			setOriginalStartDate(formatedTrip.init_date);
			setOriginalEndDate(formatedTrip.finish_date);
			setOriginalDescription(formatedTrip.description);
    };
    fetchTrip();
  }, [auth, id]);

  const handleEditTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = auth.user.accessToken;
    if (
      originalStartDate === startDateValue &&
      originalEndDate === endDateValue &&
      originalDescription === descriptionValue
    ) {
      setLoading(false);
      return;
    }
    let data = {};
    if (originalStartDate !== startDateValue) {
      const startDate = new Date(startDateValue);
      data = {
        ...data,
        init_date: startDate,
      };
    }
    if (originalEndDate !== endDateValue) {
      const endDate = new Date(endDateValue);
      data = {
        ...data,
        finish_date: endDate,
      };
    }
    if (originalDescription !== descriptionValue) {
      data = {
        ...data,
        description: descriptionValue,
      };
    }
    const response = await updateTrip(data, token, id);
    setLoading(false);
    if (response) navigate(-1);
  };

	const handleDeleteTrip = async (e) => {
		e.preventDefault();
		setLoading(true);
		const token = auth.user.accessToken;
		const response = await deleteTrip(token, id);
		setLoading(false);
		if (response) navigate("/my_trips");
	}

  return (
    <div>
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
          onSubmit={handleEditTrip}
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
            <Typography variant="body1" mb={2} style={{ fontFamily: "Inter" }}>
              {country}
            </Typography>
          </div>
          <div className={styles.labels}>
            <Typography
              variant="body1"
              mb={2}
              style={{ fontFamily: "Inter", fontWeight: 600 }}
            >
              {texts("city")}
            </Typography>
            <Typography variant="body1" mb={2} style={{ fontFamily: "Inter" }}>
              {cityValue}
            </Typography>
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
                value={startDateValue}
                sx={{ width: "100%" }}
                onChange={(e) => setStartDateValue(e.target.value)}
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
                value={endDateValue}
                sx={{ width: "100%" }}
                onChange={(e) => {setEndDateValue(e.target.value)}}
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
              onChange={(e) => {
                setDescriptionValue(e.target.value);
              }}
            />
          </div>
          <div className={styles.buttons}>
            <LoadingButton
              loading={loading}
							onClick={(e)=>handleDeleteTrip(e)}
              variant="contained"
              size="large"
              sx={{ width: "60%", fontSize: 12, backgroundColor: "#FF0000" }}
            >
              {texts("buttonDelete")}
            </LoadingButton>
            <LoadingButton
              loading={loading}
              type="submit"
              variant="contained"
              size="large"
              sx={{ width: "100%", fontSize: 12 }}
            >
              {texts("buttonSubmit")}
            </LoadingButton>
          </div>
        </Stack>
      </Box>
    </div>
  );
}
