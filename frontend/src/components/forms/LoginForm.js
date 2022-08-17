import { Button, Card, CardContent, Divider, Stack, TextField, Typography } from '@mui/material'
import {LoadingButton} from '@mui/lab'
import * as React from 'react'

export default function LoginForm({loginClicked, registerClicked, loading, error}) {

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    return (
        <Card>
            <CardContent sx={{p: 4}}>
                <Stack>
                    <Typography variant="h4" sx={{mb: 4, textAlign: 'center'}}>
                        Login
                    </Typography>
                    <TextField
                        label="email"
                        type="email"
                        sx={{mb:2}}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="password"
                        sx={{mb: 4}}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Typography
                        color='error'
                        sx={{mb: 2, textAlign: 'center'}}
                    >
                        { error }
                    </Typography>
                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        onClick={() => loginClicked(email, password)}
                    >
                        Login
                    </LoadingButton>
                    <Divider sx={{my: 1.5}}>Or</Divider>
                    <Button
                        variant="outlined"
                        onClick={() => registerClicked()}
                    >
                        Register
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}