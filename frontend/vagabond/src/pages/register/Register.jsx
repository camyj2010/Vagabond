import React, {useState} from 'react'
import { Box, Container, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import { useLanguageContext } from '../../context/languageContext';
import { createUser } from '../../firebase/functions';
import { register } from '../../utils/connections';
import { LoadingButton } from '@mui/lab';
import Alerts from '../../components/Alerts';

export const Register = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [openAlert, setOpenAlert] = useState(false)
	const [alertData, setAlertData] = useState({alertMessage: '', alertSeverity: ''})

	const navigate = useNavigate();

	const { t } = useLanguageContext();
	const texts = (data) => t(`register.${data}`);

	const handleRegister = async(e) => {
		e.preventDefault();
		setLoading(true);
		const userCreated = await createUser(email, password)
		if (userCreated === 'auth/email-already-in-use') {
			setAlertData({alertMessage: 'Email already in use', alertSeverity: 'error'})
			console.log('Email already in use')
			setLoading(false)
			setOpenAlert(true)
			return
		}
		const data = {
			username: name,
			email: email,
			firebase_id: userCreated.uid
		}
		const registered = await register(data)
		if (registered === 'error' || registered === 'duplicate_email' ) {
			setAlertData({alertMessage: 'Error registering the user', alertSeverity: 'error'})
			console.log('Error')
			setLoading(false)
			setOpenAlert(true)
			return
		}else{
			setAlertData({alertMessage: 'User registered', alertSeverity: 'success'})
			setLoading(false)
			setOpenAlert(true)
			setTimeout(() => {
				navigate('/login')
			}, 2000);
			clearTimeout();
		}
		
	}
	return (
		<Container maxWidth="xs">
			<Alerts openAlert={openAlert} setOpenAlert={setOpenAlert} alertData={alertData} />
			<Box textAlign="center" mt={15}>
				<Typography variant="h4" style={{ fontFamily: 'Inter', fontWeight: 600 }}>Vagabond</Typography>
			</Box>
			<Box component="form" mt={4} onSubmit={handleRegister}>
				<Typography textAlign="center" variant="h5" mt={17} mb={2} style={{ fontFamily: 'Inter', fontWeight: 600 }}>{texts('title')}</Typography>

				<TextField
					required
          label={texts('fullName')}
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        {/* {error && (
          <Typography style={{ fontFamily: 'Inter', fontWeight: 400 }} color="error" variant="body2" mt={1}>
            {error}
          </Typography>
        )} */}
        <LoadingButton
					loading={loading}
          type="submit"
          variant="contained"
          fullWidth
          size="large"
					color='primary'
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
        </LoadingButton>
			</Box>
			<Box textAlign="center" mt={2}>
        <Typography style={{ fontFamily: 'Inter', fontWeight: 400 }} variant="body2">
          {texts('alreadyAccount')}{' '}
          <Link to="/login" underline="hover">
            {texts('signIn')}
          </Link>
        </Typography>
      </Box>
      <Box textAlign="center" mt={4} mb={2}>
        <Typography style={{ fontFamily: 'Inter', fontWeight: 400 }} variant="caption">
          {texts('clickingHere')} {texts('button')}, {texts('accepts')} <span style={{fontWeight: "bold"}}>{texts('terms')}</span> {texts('and')}  <span style={{fontWeight: "bold"}}>{texts('privacy')}</span>
        </Typography>
      </Box>
		</Container>
	)
}

export default Register;
