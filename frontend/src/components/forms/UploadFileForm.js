import { MenuItem, Stack, TextField, Select, Box, Typography, Grid, IconButton, Button } from '@mui/material'
import * as React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import atoms from '../../Atoms'
import authorizedAxios from '../authorizedAxios'
import urls from '../../data/urls'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { LoadingButton } from '@mui/lab'

export default function UploadFileForm({ file, library, submitted }) {

    const isEdit = file !== null && file !== undefined
    const libraryProp = library ? library : file ? file.library.name : ''
    const [libraryState, setLibraryState] = React.useState(libraryProp)
    const [libraries, setLibraries] = useRecoilState(atoms.LibraryAtom)
    const [descriptionState, setDescriptionState] = React.useState(file ? file.description : '')
    const [metaDataState, setMetaDataState] = React.useState(file ? file.meta_data : {})
    const [fileState, setFileState] = React.useState()
    const [tempKey, setTempKey] = React.useState('')
    const [tempValue, setTempValue] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [attachmentTypes, setAttachmentTypes] = React.useState([])
    const [tempType, setTempType] = React.useState('')
    const [tempAttachment, setTempAttachment] = React.useState()
    const [attachments, setAttachments] = React.useState(file ? file.fileattachment_set : [])

    const auth = useRecoilValue(atoms.AuthAtom)

    React.useEffect(() => {
        if (libraries.length === 0) {
            authorizedAxios(auth).get(urls.listLibraries).then(res => {
                setLibraries(res.data.libraries)
            })
        }
        authorizedAxios(auth).get(urls.attachmentTypes + `?name=${libraryProp}`).then(res => {
            setAttachmentTypes(res.data)
        })
    }, [])

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

    const addAttachment = () => {
        if (tempType && tempAttachment) {
            const data = new FormData()
            data.append('file', tempAttachment)
            data.append('type', tempType)
            authorizedAxios(auth).put(urls.uploadAttachment, data).then(res => {
                setAttachments([...attachments, res.data.attachment])
                setTempType('')
                setTempAttachment(null)
            }).catch(err => { console.log(err.response) })
        }
    }

    const removeAttachment = (id) => {
        authorizedAxios(auth).delete(urls.attachments, {
            data: {id: id}
        }).then(res => {
            setAttachments(attachments.filter(item => item.id !== id))
        })
    }

    const submitClicked = () => {
        setLoading(true)
        if (isEdit) {
            const url = urls.crudFile.replace("<pk>", file.id)
            authorizedAxios(auth).post(url, {
                description: descriptionState,
                meta_data: JSON.stringify(metaDataState),
            }).then(res => {
                setLoading(false)
                for(const item of attachments) {
                    authorizedAxios(auth).post(urls.attachments, {
                        file_id: file.id,
                        attachment_id: item.id
                    }).then(res => {
                        console.log(res.data)
                    })
                }
                if (submitted)
                    submitted(res.data)
            }).catch(err => { console.log(err.response) })
        } else {
            const data = new FormData()
            data.append('file', fileState)
            data.append('library', libraryState)
            data.append('description', descriptionState)
            data.append('meta_data', JSON.stringify(metaDataState))
            authorizedAxios(auth).put(urls.uploadFile, data).then(res => {
                setLoading(false)
                let file_id = res.data.file.id
                for(const item of attachments) {
                    console.log("Test!")
                    authorizedAxios(auth).post(urls.attachments, {
                        file_id: file_id,
                        attachment_id: item.id
                    }).then(res => {
                        console.log(res.data)
                    })
                }
                if (submitted)
                    submitted(res.data.file)
            }).catch(err => { console.log(err.response) })
        }
    }

    const downloadAttachment = (id) => {
        authorizedAxios(auth).get(urls.attachments, {
            params: {id: id}
        }).then(res => {
            const blob = new Blob(
                [res.data],
                { type: res.headers['content-type'] }
            )
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        })
    }

    return (
        <Stack spacing={4}>
            <Grid container spacing={4}>
                {!isEdit &&
                    <Grid item xs={6}>
                        <Typography variant='subtitle1' sx={{ mb: 1 }}>File</Typography>
                        <TextField
                            type="file"
                            fullWidth
                            onChange={(e) => setFileState(e.target.files[0])}
                        />
                    </Grid>
                }
                <Grid item xs={isEdit ? 12 : 6}>
                    <Typography variant='subtitle1' sx={{ mb: 1 }}>Library</Typography>
                    <Select
                        fullWidth
                        value={libraryState}
                        disabled={isEdit}
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
                <Grid container columnSpacing={2} sx={{ mb: 1 }}>
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
            <Box>
                <Typography variant='subtitle1' sx={{ mb: 1 }}>Attachments</Typography>
                <Grid container columnSpacing={2} sx={{ mb: 1 }}>
                    {attachments.map(item =>
                        <React.Fragment key={item}>
                            <Grid item xs={9.6}>
                                <Button
                                    fullWidth
                                    onClick={() => downloadAttachment(item.id)}
                                >
                                    {item.type}
                                </Button>
                            </Grid>
                            <Grid item xs={2.4}>
                                <IconButton color='error' onClick={() => removeAttachment(item.id)}>
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            </Grid>
                        </React.Fragment>
                    )}
                </Grid>
                <Grid container columnSpacing={2}>
                    <Grid item xs={4.8}>
                        <Select
                            fullWidth
                            size='small'
                            label="key"
                            value={tempType}
                            onChange={(e) => setTempType(e.target.value)}
                        >
                            {attachmentTypes.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </Select>
                    </Grid>
                    <Grid item xs={4.8}>
                        <TextField
                            fullWidth
                            size='small'
                            type='file'
                            onChange={(e) => setTempAttachment(e.target.files[0])}
                        />
                    </Grid>
                    <Grid item xs={2.4}>
                        <IconButton onClick={addAttachment} color='primary'>
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