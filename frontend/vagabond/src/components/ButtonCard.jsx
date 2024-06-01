import React from 'react'
import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
//styles
import styles from './ButtonCard.module.css'

export default function ButtonCard({imageLink, title, clickLink}) {
	return (
		<Link to={clickLink} className={styles.cardButton}>
			<Box mt={2} ml={2}>
				<Typography variant='h6' fontWeight='bold'> {title} </Typography>
			</Box>
			<div className={styles.photo}>
				<img src={imageLink} alt="Decorative" />
			</div>
		</Link>
	)
}
