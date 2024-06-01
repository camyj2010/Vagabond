import { Container } from '@mui/material';
import React from 'react'
import { useParams } from 'react-router-dom';
import Header from '../../../components/Header';

export default function MyTrip() {
	let { id } = useParams();

	return (
		<Container component='section' maxWidth="xs">
			<Header />
			{ id}
		</Container>
	)
}
