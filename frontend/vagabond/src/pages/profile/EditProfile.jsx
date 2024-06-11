import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useLanguageContext } from "../../context/languageContext";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, IconButton, Avatar } from "@mui/material";
import { uploadImageToCloudinary } from "../../utils/connections";

const EditProfile = () => {
  const { user, updateProfileData } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoUrl] = useState("");
  const [email, setEmail] = useState("");
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const { t } = useLanguageContext();
  const texts = (data) => t(`editProfile.${data}`);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName ?? "");
      setPhotoUrl(user.photoURL ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfileData({ displayName, photoURL });
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleBackClick = () => {
    navigate('/profile');
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const url = await uploadImageToCloudinary(file);
        setPhotoUrl(url);
        
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleEditPhotoClick = () => {
    fileInputRef.current.click();
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
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"
          >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M15 6l-6 6l6 6" />
          </svg>
        </IconButton>
        <Typography variant="h4" component="h1" align="center" style={{ fontFamily: 'Inter', fontWeight: 600, flex: 1 }}>
          {texts('title')}
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" my={2}>
        <Avatar src={photoURL} alt="Profile Picture" style={{ width: 150, height: 150 }} />
        <Typography
          variant="body1"
          color="primary"
          style={{ cursor: "pointer", marginTop: 8}}
          onClick={handleEditPhotoClick}
          sx={{ fontFamily: 'Inter', fontWeight: 500 }}
        >
          {texts('image')}
        </Typography>
        <input
         data-testid="image-edit-input"
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </Box>
      <Box mt={2} mb={2}>
        <TextField
          fullWidth
          label={texts('name')}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          variant="outlined"
          margin="normal"
          sx={{
            fontFamily: 'Inter',
            fontWeight: 400,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#2D6EFF',
              },
            },
            '& input': {
              fontFamily: 'Inter', 
            },
          }}
        />
        <Typography variant="body1" marginTop="normal" style={{ marginTop: 16 }} sx={{ fontFamily: 'Inter', fontWeight: 500 }}>
          {texts('email')} {email}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" sx={{position: "fixed", bottom: 10, width: "90%", margin: "auto", left: 0, right: 0, borderTop: "1px solid #ccc" }}>
        <Button fullWidth variant="contained" color="primary" onClick={handleUpdateProfile} sx={{ mt: 2, backgroundColor: '#2D6EFF','& span': { fontFamily: 'Inter', fontWeight: 500, }, }}>
          {texts('button')}
        </Button>
      </Box>
    </Container>
  )
};

export default EditProfile;