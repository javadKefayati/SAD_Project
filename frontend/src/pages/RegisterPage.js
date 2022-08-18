import { Button, Card, CardContent, Container, Grid, Stack, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import urls from '../data/urls'

export default function RegisterPage() {

    const [email, setEmail] = React.useState('')
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [password, setPassword] = React.useState('')

    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const navigate = useNavigate()

    const registerClicked = () => {
        setError('')
        if (!email || !password) {
            setError('Email and Password are required')
            return
        }
        setLoading(true)
        axios.post(urls.register, {
            username: email,
            password: password,
            first_name: firstName,
            last_name: lastName
        }).then(res => {
            setLoading(false)
            navigate('/login')
        }).catch(err => {
            setError('User with this email exists')
            setLoading(false)
            return
        })

    }

    const backClicked = () => {
        navigate('/login')
    }
    return (
        <Container maxWidth="sm">
            <Card>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={4} sx={{ textAlign: 'center' }}>
                        <Typography variant="h4">
                            Register
                        </Typography>
                        <Typography color='error'>
                            {error}
                        </Typography>
                        <Grid container justifyContent={'space-between'}>
                            <Grid item xs={12} sx={{ p: 1 }}>
                                <TextField
                                    fullWidth
                                    label="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ p: 1 }}>
                                <TextField
                                    fullWidth
                                    label="first name"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ p: 1 }}>
                                <TextField
                                    fullWidth
                                    label="last name"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ p: 1 }}>
                                <TextField
                                    fullWidth
                                    label="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ p: 1 }}>
                                <Button
                                    fullWidth
                                    variant="text"
                                    onClick={backClicked}
                                >
                                    Back
                                </Button>
                            </Grid>
                            <Grid item xs={4} sx={{ p: 1 }}>
                                <LoadingButton
                                    loading={loading}
                                    fullWidth
                                    variant="contained"
                                    onClick={registerClicked}
                                >
                                    Register
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    )
}