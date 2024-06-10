import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Container,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useLanguageContext } from "../../context/languageContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const [photoURL, setPhotoUrl] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [language, setLanguage] = useState("en");

  const navigate = useNavigate();

  const { t, onClickLanguageChange, i18n } = useLanguageContext();
  const texts = (data) => t(`profile.${data}`);
	

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName ?? "");
      setPhotoUrl(user.photoURL ?? "");
      setEmail(user.email ?? "");
    }
		setLanguage(i18n.language);
		// eslint-disable-next-line
  }, [user]);

  const handleBackClick = () => {
    navigate("/my_trips");
  };

  const handleEditClick = () => {
    navigate("edit_profile");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSelectChange = (event) => {
    setLanguage(event.target.value);
		onClickLanguageChange(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" alignItems="center" my={4}>
        <IconButton onClick={handleBackClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 6l-6 6l6 6" />
          </svg>
        </IconButton>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          style={{ fontFamily: "Inter", fontWeight: 600, flex: 1 }}
        >
          {texts("title")}
        </Typography>
        <IconButton onClick={handleEditClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-settings"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
          </svg>
        </IconButton>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" my={2}>
        <Avatar
          src={photoURL}
          alt="Profile Picture"
          style={{ width: 150, height: 150 }}
        />
        <Typography
          variant="body1"
          color="primary"
          style={{ cursor: "pointer", marginTop: 8 }}
          sx={{ fontFamily: "Inter", fontWeight: 500 }}
        ></Typography>
        <input type="file" style={{ display: "none" }} accept="image/*" />
      </Box>
      <Box mx={2} mt={5}>
        <Typography
          variant="body1"
          marginTop="normal"
          style={{ marginTop: 16 }}
          sx={{ fontFamily: "Inter", fontWeight: 500 }}
        >
          <b>{texts("name")}</b> {displayName}
        </Typography>
        <Typography
          variant="body1"
          marginTop="normal"
          style={{ marginTop: 16 }}
          sx={{ fontFamily: "Inter", fontWeight: 500 }}
        >
          <b>{texts("email")}</b> {email}
        </Typography>
        <Stack direction="row" spacing={2} mt={4}>
          <Typography
            variant="body1"
            marginTop="normal"
            style={{ marginTop: 16 }}
            sx={{ fontFamily: "Inter", fontWeight: 500 }}
          >
            <b>{texts("language")}</b>
          </Typography>
          <div>
            <Select
              labelId="simple-select-label"
              id="demo-simple-select"
              value={language}
              label="Age"
              onChange={handleSelectChange}
            >
              <MenuItem value={"en"}>English</MenuItem>
              <MenuItem value={"es"}>Spanish</MenuItem>
              <MenuItem value={"fr"}>French</MenuItem>
            </Select>
          </div>
        </Stack>
      </Box>
      <Box display="flex" justifyContent="center" sx={{position: "fixed", bottom: 10, width: "90%", margin: "auto", left: 0, right: 0, borderTop: "1px solid #ccc" }}>
        <Button fullWidth variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 2, backgroundColor: '#2D6EFF','& span': { fontFamily: 'Inter', fontWeight: 500, }, }}>
          {texts('logout')}
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
