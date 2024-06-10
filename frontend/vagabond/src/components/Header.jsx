import React, { useEffect, useState } from 'react'
import styles from './Header.module.css'

import { Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext';

export default function Header() {
	const { user } = useAuth();

	const [photoURL, setPhotoUrl] = useState("");

	const navigate = useNavigate()
	const handleClick = () => {
		navigate('/my_trips')
	}

	useEffect(() => {
    if (user) {
      setPhotoUrl(user.photoURL ?? "");
    }
  }, [user]);

	return (
		<div className={styles.headerDiv}>
			<Typography 
			variant='h5'
			onClick={handleClick}
			style={{ fontFamily: 'Inter', fontWeight: 600 }}>Vagabond</Typography>
			<Link to="/profile" className={styles.userCircle}>
				<img src={photoURL} alt='UserImage'/>
			</Link>
		</div>
	)
}
