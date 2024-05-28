import React from 'react'
import styles from './Header.module.css'

import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Header() {
	const navigate = useNavigate()
	const handleClick = () => {
		navigate('/my_trips')
	}
	return (
		<div className={styles.headerDiv}>
			<Typography 
			variant='h5'
			onClick={handleClick}
			style={{ fontFamily: 'Inter', fontWeight: 600 }}>Vagabond</Typography>
			<div className={styles.userCircle}>
				<img src='https://picsum.photos/200' alt='UserImage'/>
			</div>
		</div>
	)
}
