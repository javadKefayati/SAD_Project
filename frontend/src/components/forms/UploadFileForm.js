import { MenuItem, Stack, TextField, Select, Box, Typography, Grid } from '@mui/material'
import * as React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import atoms from '../../Atoms'
import authorizedAxios from '../authorizedAxios'
import urls from '../../data/urls'

export default function UploadFileForm({ library, description = '' }) {

    const [libraryState, setLibraryState] = React.useState(library)
    const [libraries, setLibraries] = useRecoilState(atoms.LibraryAtom)
    const [descriptionState, setDescriptionState] = React.useState(description)
    const [fileState, setFileState] = React.useState()
    const auth = useRecoilValue(atoms.AuthAtom)

    React.useEffect(() => {
        if (libraries.length === 0) {
            authorizedAxios(auth).get(urls.listLibraries).then(res => {
                setLibraries(res.data.libraries)
            })
        }
    })

    return (
        <Stack spacing={4}>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <Typography variant='subtitle1' sx={{ mb: 1 }}>File</Typography>
                    <TextField
                        type="file"
                        fullWidth
                        onChange={(e) => setFileState(e.target.files[0])}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant='subtitle1' sx={{ mb: 1 }}>Library</Typography>
                    <Select
                        fullWidth
                        value={libraryState}
                        onChange={(e) => setLibraryState(e.target.value)}
                    >
                        {libraries.map(item => <MenuItem value={item.name}>{item.name}</MenuItem>)}
                    </Select>
                </Grid>
            </Grid>
            <Box>
                <Typography variant='subtitle1' sx={{ mb: 1 }}>Description</Typography>
                <TextField
                    rows={3}
                    multiline
                    fullWidth
                    placeholder='Description about the file'
                    value={descriptionState}
                    onChange={(e) => setDescriptionState(e.target.value)}
                />
            </Box>
        </Stack>
    )
}