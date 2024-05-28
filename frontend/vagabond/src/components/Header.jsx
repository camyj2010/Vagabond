import React from 'react'
import styles from './Header.module.css'

import { Typography } from '@mui/material'

export default function Header() {
	return (
		<div className={styles.headerDiv}>
			<Typography variant='h5' style={{ fontFamily: 'Inter', fontWeight: 600 }}>Vagabond</Typography>
			<div className={styles.userCircle}>
				<img src='https://picsum.photos/200' alt='UserImage'/>
			</div>
		</div>
	)
}
