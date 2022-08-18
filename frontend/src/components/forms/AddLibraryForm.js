import { Box, Stack, TextField, ToggleButton, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DescriptionIcon from '@mui/icons-material/Description';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import authorizedAxios from '../authorizedAxios'
import urls from '../../data/urls';
import atoms from '../../Atoms'
import { useRecoilValue } from 'recoil';
import * as React from 'react'

export default function AddLibraryForm({close, libraryAdded}) {
    const [name, setName] = React.useState('')
    const [type, setType] = React.useState('image')
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const auth = useRecoilValue(atoms.AuthAtom)

    const typeSelected = (e, n) => {
        setType(n)
    }

    const submitClicked = () => {
        if (!name) {
            setError('This item is required')
            return
        }
        setLoading(true)
        authorizedAxios(auth).post(urls.createLibrary, {
            name: name,
            data_type: type
        }).then(res => {
            setLoading(false)
            libraryAdded(res.data.library)
            close()
        }).catch(err => {
            setError(err.response.data.message)
            setLoading(false)
        })
    }

    const nameChanged = (e) => {
        setError('')
        setName(e.target.value)
    }

    return (
        <Stack spacing={4}>
            <Box>
                <Typography variant='subtitle1' sx={{mb: 1}}>Library name</Typography>
                <TextField
                    fullWidth
                    error={error !== ''}
                    helperText={error}
                    value={name}
                    onChange={nameChanged}
                    placeholder='Example: My Library'
                />
            </Box>
            <Box>
                <Typography variant='subtitle1' sx={{ mb: 1 }}>Library type</Typography>
                <Stack direction={'row'} sx={{ width: '100%' }} spacing={1}>
                    <ToggleButton
                        value="image"
                        selected={type === 'image'}
                        color="primary"
                        onChange={typeSelected}
                        sx={{ flexGrow: 1, aspectRatio: '1' }}
                    >
                        <ImageIcon />
                    </ToggleButton>
                    <ToggleButton
                        value="video"
                        color="primary"
                        selected={type === 'video'}
                        onChange={typeSelected}
                        sx={{ flexGrow: 1, aspectRatio: '1' }}
                    >
                        <VideoLibraryIcon />
                    </ToggleButton>
                    <ToggleButton
                        value="document"
                        color="primary"
                        selected={type === 'document'}
                        onChange={typeSelected}
                        sx={{ flexGrow: 1, aspectRatio: '1' }}
                    >
                        <DescriptionIcon />
                    </ToggleButton>
                    <ToggleButton
                        value="audio"
                        color="primary"
                        selected={type === 'audio'}
                        onChange={typeSelected}
                        sx={{ flexGrow: 1, aspectRatio: '1' }}
                    >
                        <AudioFileIcon />
                    </ToggleButton>
                </Stack>
            </Box>
            <LoadingButton
                variant='contained'
                onClick={submitClicked}
                loading={loading}
            >
                Submit
            </LoadingButton>
        </Stack>
    )
}