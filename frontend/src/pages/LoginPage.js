import * as React from 'react'
import {Container} from '@mui/material'
import LoginForm from '../components/forms/LoginForm'

export default function LoginPage() {
    return (
        <Container maxWidth="sm" sx={{py: 12}}>
            <LoginForm />
        </Container>
    )
}