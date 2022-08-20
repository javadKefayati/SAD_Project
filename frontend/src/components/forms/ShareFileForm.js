import { LoadingButton } from '@mui/lab'
import { Grid, Stack, TextField } from '@mui/material'
import * as React from 'react'
import { useRecoilValue } from 'recoil'
import atoms from '../../Atoms'
import urls from '../../data/urls'
import authorizedAxios from '../authorizedAxios'

export default function ShareFilForm({ id, name }) {
    const [sharedWith, setSharedWith] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [username, setUsername] = React.useState('')
    const [error, setError] = React.useState('')

    const auth = useRecoilValue(atoms.AuthAtom)

    React.useEffect(() => {
        const url = urls.shareFile.replace("<pk>", id)
        authorizedAxios(auth).get(url).then(res => {
            setSharedWith(res.data)
        })
    }, [])

    const addClicked = () => {
        setLoading(true)
        const url = urls.shareFile.replace("<pk>", id)
        authorizedAxios(auth).post(url, {
            username: username,
            access_type: 'r'
        }).then(res => {
            setSharedWith([...sharedWith, res.data.user])
            setLoading(false)
        }).catch(err => {
            setError(err.response.data.message)
            setLoading(false)
        })
    }
    return (
        <Stack spacing={4}>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <TextField
                        fullWidth
                        error={error !== ''}
                        helperText={error}
                        placeholder='user@example.com'
                        value={username}
                        onChange={(e) => {setUsername(e.target.value); setError('')}}
                    />
                </Grid>
                <Grid item xs={2}>
                    <LoadingButton
                        fullWidth
                        loading={loading}
                        sx={{height: '56px'}}
                        variant='contained'
                        onClick={addClicked}
                    >
                        Add
                    </LoadingButton>
                </Grid>
            </Grid>
            {sharedWith.map(item => <p>{item.username}</p>)}
        </Stack>
    )
}