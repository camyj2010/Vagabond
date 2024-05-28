import React, {useState} from 'react'
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { useLanguageContext } from '../../context/languageContext';
import { createUser } from '../../firebase/functions';
import { register } from '../../utils/connections';

const Register = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const { t } = useLanguageContext();
	const texts = (data) => t(`register.${data}`);

	const handleRegister = async(e) => {
		e.preventDefault();
		const userCreated = await createUser(email, password)
		if (userCreated === 'auth/email-already-in-use') {
			console.log('Email already in use')
			return
		}
		const data = {
			username: name,
			email: email,
			firebase_id: userCreated.uid
		}
		const registered = await register(data)
		if (registered === 'error') {
			console.log('Error')
			return
		}else{
			console.log('User registered')
		}
		
	}
	return (
		<Container maxWidth="xs">
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
          {texts('button')}
        </Button>
			</Box>
			<Box textAlign="center" mt={2}>
        <Typography style={{ fontFamily: 'Inter', fontWeight: 400 }} variant="body2">
          {texts('alreadyAccount')}{' '}
          <Link href="/" underline="hover">
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
