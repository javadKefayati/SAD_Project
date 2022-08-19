import { MenuItem, Stack, TextField, Select, Box, Typography, Grid, IconButton } from '@mui/material'
import * as React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import atoms from '../../Atoms'
import authorizedAxios from '../authorizedAxios'
import urls from '../../data/urls'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { LoadingButton } from '@mui/lab'

export default function UploadFileForm({ library, description = '', submitted }) {

    const [libraryState, setLibraryState] = React.useState(library)
    const [libraries, setLibraries] = useRecoilState(atoms.LibraryAtom)
    const [descriptionState, setDescriptionState] = React.useState(description)
    const [metaDataState, setMetaDataState] = React.useState({})
    const [fileState, setFileState] = React.useState()
    const [tempKey, setTempKey] = React.useState('')
    const [tempValue, setTempValue] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const auth = useRecoilValue(atoms.AuthAtom)

    React.useEffect(() => {
        if (libraries.length === 0) {
            authorizedAxios(auth).get(urls.listLibraries).then(res => {
                setLibraries(res.data.libraries)
            })
        }
    })

    const addMetaData = () => {
        if (tempKey && tempValue) {
            setMetaDataState({ ...metaDataState, [tempKey]: tempValue })
            setTempKey('')
            setTempValue('')
        }
    }

    const removeMetaData = (key) => {
        if (Object.keys(metaDataState).includes(key)) {
            var copy = { ...metaDataState }
            delete copy[key]
            setMetaDataState(copy)
        }
    }

    const submitClicked = () => {
        setLoading(true)
        const data = new FormData()
        data.append('file', fileState)
        data.append('library', library)
        data.append('description', descriptionState)
        data.append('meta_data', metaDataState)
        authorizedAxios(auth).put(urls.uploadFile, data).then(res => {
            console.log(res)
            setLoading(false)
            if(submitted)
                submitted(res.data.file)
        }).catch(err => {console.log(err.response)})
    }

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
                        {libraries.map(item => <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>)}
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
            <Box>
                <Typography variant='subtitle1' sx={{ mb: 1 }}>Meta data</Typography>
                <Grid container columnSpacing={2} sx={{mb: 1}}>
                    {Object.keys(metaDataState).map(item =>
                        <React.Fragment key={item}>
                            <Grid item xs={4.8}>
                                <Typography sx={{ flexGrow: 2 }} variant='caption'>
                                    {item}
                                </Typography>
                            </Grid>
                            <Grid item xs={4.8}>
                                <Typography sx={{ flexGrow: 2 }} variant='caption'>
                                    {metaDataState[item]}
                                </Typography>
                            </Grid>
                            <Grid item xs={2.4}>
                                <IconButton color='error' onClick={() => removeMetaData(item)}>
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            </Grid>
                        </React.Fragment>
                    )}
                </Grid>
                <Grid container columnSpacing={2}>
                    <Grid item xs={4.8}>
                        <TextField
                            fullWidth
                            size='small'
                            label="key"
                            value={tempKey}
                            onChange={(e) => setTempKey(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4.8}>
                        <TextField
                            fullWidth
                            size='small'
                            label="value"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2.4}>
                        <IconButton onClick={addMetaData} color='primary'>
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
            <LoadingButton
                loading={loading}
                fullWidth
                variant="contained"
                onClick={submitClicked}
            >
                Submit
            </LoadingButton>
        </Stack >
    )
}