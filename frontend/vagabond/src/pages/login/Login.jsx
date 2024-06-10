import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useAuth } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useLanguageContext } from '../../context/languageContext';
import { register } from '../../utils/connections';

export const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { t } = useLanguageContext();
  const texts = (data) => t(`login.${data}`);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.login(email, password);
      navigate('/my_trips');
    } catch (err) {
      setError(texts('errorLogin'));
    }
  }

  const handleGoogle = async (e) => {
    e.preventDefault();
    try {
      const googleUser = await auth.loginWithGoogle();
      //console.log(googleUser.user)
      const data = {
        username: googleUser.user.displayName,
        email: googleUser.user.email,
        firebase_id: googleUser.user.uid
      }
      //console.log("Soy la data con la que se va a crear el usuario", data)
      const registered = await register(data)

      if (registered === 'error') {
        console.log('Error');
        setError(texts('errorGoogle'));
        return;
      } else if (registered === 'duplicate_email') {
        console.log('User already exists, logging in');
        navigate('/my_trips');
      } else {
        console.log('User registered');
        navigate('/my_trips');
      }
    } catch (err) {
      setError(texts('errorGoogle'));
    }
  }

  return (
    <Container maxWidth="xs">
      <Box textAlign="center" mt={15}>
        <Typography variant="h4" style={{ fontFamily: 'Inter', fontWeight: 600 }}>Vagabond</Typography>
      </Box>
      <Box component="form" mt={4} onSubmit={handleLogin}>
        <Typography textAlign="center" variant="h5" mt={17} mb={2} style={{ fontFamily: 'Inter', fontWeight: 600 }}>{texts('title')}</Typography>
        <TextField
          required
          label={texts('email')}
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
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
        <TextField
          required
          label={texts('password')}
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
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
        {error && (
          <Typography style={{ fontFamily: 'Inter', fontWeight: 400 }} color="error" variant="body2" mt={1}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{
            mt: 2,
            backgroundColor: '#2D6EFF',
            '& span': {
              fontFamily: 'Inter',
              fontWeight: 500,
            },
          }}
        >
          {texts('button')}
        </Button>
      </Box>
      <Box component="form" mt={1} onSubmit={handleGoogle}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{
            mt: 2,
            backgroundColor: '#2D6EFF',
            '& span': {
              fontFamily: 'Inter',
              fontWeight: 500,
            },
          }}
        >
          {texts('signInGoogle')}
        </Button>
      </Box>
      <Box textAlign="center" mt={2}>
        <Typography style={{ fontFamily: 'Inter', fontWeight: 400 }} variant="body2">
          {texts('dontHaveAccount')}{' '}
          <Link to="/register" underline="hover">
            {texts('signUp')}
          </Link>
        </Typography>
      </Box>
      <Box textAlign="center" mt={4} mb={2}>
        <Typography style={{ fontFamily: 'Inter', fontWeight: 400 }} variant="caption">
          {texts('clickingHere')} {texts('button')}, {texts('accepts')} <span style={{fontWeight: "bold"}}>{texts('terms')}</span> {texts('and')}  <span style={{fontWeight: "bold"}}>{texts('privacy')}</span>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;