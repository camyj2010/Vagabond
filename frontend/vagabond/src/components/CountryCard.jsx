import React from 'react'
import { Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
//styles
import styles from './CountryCard.module.css'

export default function CountryCard({id, country, country_cod, city, init_date, finish_date}) {
	return (
		<Link to={id} className={styles.card}>
			<Stack direction='column' spacing={0} justifyContent='space-between'>
				<Typography variant='h6' fontWeight='bold'> {country ?? " "} </Typography>
				<Typography variant='body1' fontWeight='bold'>{city ?? " "}</Typography>
				<Typography variant='body2' fontSize={12}>{init_date ?? " "} - {finish_date ?? " "}</Typography>
			</Stack>
			<div className={styles.flag}>
				<img src={`https://flagcdn.com/${country_cod.toLowerCase()}.svg`} alt={country+' flag'} />
			</div>
		</Link>
	)
}
