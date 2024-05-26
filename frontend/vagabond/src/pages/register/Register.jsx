import React, {useState} from 'react'
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Register = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleRegister = (e) => {
		alert('Register', e)
	}
	return (
		<Container maxWidth="xs">
			<Box textAlign="center" mt={15}>
				<Typography variant="h4" style={{ fontFamily: 'Inter', fontWeight: 600 }}>Vagabond</Typography>
			</Box>
			<Box component="form" mt={4} onSubmit={handleRegister}>
				<Typography textAlign="center" variant="h5" mt={17} mb={2} style={{ fontFamily: 'Inter', fontWeight: 600 }}>Create an account</Typography>

				<TextField
					required
          label="Full Name"
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
          label="Email"
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
          label="Password"
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
          Sign up
        </Button>
			</Box>
			<Box textAlign="center" mt={2}>
        <Typography style={{ fontFamily: 'Inter', fontWeight: 400 }} variant="body2">
          Do you already have an account?{' '}
          <Link href="/" underline="hover">
            Sign in
          </Link>
        </Typography>
      </Box>
      <Box textAlign="center" mt={4} mb={2}>
        <Typography style={{ fontFamily: 'Inter', fontWeight: 400 }} variant="caption">
          By clicking Sign up, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </Box>
		</Container>
	)
}

export default Register;
