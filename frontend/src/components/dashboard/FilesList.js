import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import urls from '../../data/urls'
import authorizedAxios from '../authorizedAxios'
import { useRecoilValue } from 'recoil'
import atoms from '../../Atoms'
import FileItem from '../FileItem'
import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, Toolbar, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import UploadFileForm from '../forms/UploadFileForm'
import { LoadingButton } from '@mui/lab'
import ShareFilForm from '../forms/ShareFileForm'
import styled from 'styled-components'
import { unstable_styleFunctionSx } from '@mui/system';

const Image = styled('img')(unstable_styleFunctionSx)

export default function FilesList() {
    const { libraryName } = useParams()
    const [files, setFiles] = React.useState([])
    const [selectedFile, setSelectedFile] = React.useState()
    const [openDialog, setOpenDialog] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const auth = useRecoilValue(atoms.AuthAtom)
    const navigate = useNavigate()

    const loadFiles = () => {
        const url = urls.listFiles.replace("<name>", libraryName)
        authorizedAxios(auth).get(url).then(res => {
            //TODO: add pagination
            setFiles(res.data)
        }).catch(err => {
            //TODO: load 404 page
        })
    }

    const addNewFile = (file) => {
        setFiles([...files, file])
        setOpenDialog('')
    }

    const deleteClicked = (file) => {
        setSelectedFile(file)
        setOpenDialog('delete')
    }

    const deleteSelectedFile = () => {
        setLoading(true)
        const url = urls.crudFile.replace("<pk>", selectedFile.id)
        authorizedAxios(auth).delete(url).then(res => {
            setFiles(files.filter(item => item.id !== selectedFile.id))
            setSelectedFile(null)
            setLoading(false)
            setOpenDialog('')
        }).catch(err => { setLoading(false) })
    }

    const shareClicked = (file) => {
        setSelectedFile(file)
        setOpenDialog('share')
    }

    const downloadClicked = (file) => {
        const url = urls.crudFile.replace("<pk>", file.id)
        authorizedAxios(auth).get(url, {
            responseType: 'arraybuffer'
        }).then(res => {
            const blob = new Blob(
                [res.data],
                { type: res.headers['content-type'] }
            )
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        })
    }

    const editClicked = (file) => {
        setSelectedFile(file)
        setOpenDialog('edit')
    }

    const updateFile = (newFile) => {
        setFiles([...files.filter(item => item.id !== newFile.id), newFile])
        setOpenDialog('')
    }

    const deleteLibrary = () => {
        authorizedAxios(auth).delete(urls.deleteLibrary, {
            data: { "name": libraryName }
        }).then(res => {
            navigate('/home')
        })
    }

    React.useEffect(() => loadFiles(), [])
    return (
        <>
            <AppBar position='relative' color='transparent'>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant='h6'>
                        {libraryName}
                    </Typography>
                    <Stack direction={'row'}>
                        <Button
                            startIcon={<UploadFileIcon />}
                            onClick={() => { setOpenDialog('upload') }}
                            variant='outlined'
                            sx={{ mr: 2 }}>
                            New file
                        </Button>
                        <Button
                            onClick={() => setOpenDialog('deleteLibrary')}
                            startIcon={<DeleteForeverIcon />}
                            variant='outlined'
                        >
                            Delete library
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>
            {files.length === 0 &&
                <Box
                    sx={{
                        transform: 'translate(-20%, -50%)',
                        top: '50%',
                        left: '50%',
                        position: 'absolute',
                        color: '#aaaaaa',
                        opacity: '0.5',
                        textAlign: 'center'
                    }}
                >
                    <Image
                        src={"/icons/no-files.gif"}
                        alt="404 not found"
                        sx={{
                            maxWidth: {
                                xs: '150px',
                                sm: '200px',
                                md: '300px',
                                lg: '400px'
                            }
                        }}
                    />
                    <Typography
                        variant="h5"
                        sx={{ color: '#4F5D73' }}
                    >
                        No files found
                    </Typography>
                </Box>
            }
            {files.length !== 0 &&
                <Grid container sx={{ p: 2 }} spacing={2}>
                    {files.map(item =>
                        <Grid key={item.id} item xs={6} md={4} xl={3}>
                            <FileItem
                                {...item}
                                onDelete={() => deleteClicked(item)}
                                onDownload={() => downloadClicked(item)}
                                onShare={() => shareClicked(item)}
                                onEdit={() => editClicked(item)}
                            />
                        </Grid>
                    )}
                </Grid>
            }
            <>
                <Dialog maxWidth={'sm'} fullWidth open={openDialog === 'upload'} onClose={() => setOpenDialog('')}>
                    <DialogTitle>
                        Upload File
                    </DialogTitle>
                    <DialogContent>
                        <UploadFileForm library={libraryName} submitted={addNewFile} />
                    </DialogContent>
                </Dialog>
                <Dialog maxWidth={'sm'} fullWidth open={openDialog === 'share'} onClose={() => setOpenDialog('')}>
                    <DialogTitle>
                        Share File
                    </DialogTitle>
                    <DialogContent>
                        <ShareFilForm {...selectedFile} />
                    </DialogContent>
                </Dialog>
                <Dialog maxWidth={'sm'} fullWidth open={openDialog === 'delete'} onClose={() => setOpenDialog('')} PaperProps={{ sx: { p: 1 } }}>
                    <DialogTitle>
                        Delete file
                    </DialogTitle>
                    <DialogContent>
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                            Are you sure you want to delete {selectedFile ? selectedFile.name : ''}? {'\n'}
                            This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='text' onClick={() => setOpenDialog('')}>
                            Cancel
                        </Button>
                        <LoadingButton
                            loading={loading}
                            variant='contained'
                            color='error'
                            onClick={deleteSelectedFile}
                        >
                            Delete
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
                <Dialog maxWidth={'sm'} fullWidth open={openDialog === 'edit'} onClose={() => setOpenDialog('')}>
                    <DialogTitle>
                        Edit File
                    </DialogTitle>
                    <DialogContent>
                        <UploadFileForm file={selectedFile} submitted={updateFile} />
                    </DialogContent>
                </Dialog>
                <Dialog maxWidth={'sm'} fullWidth open={openDialog === 'deleteLibrary'} onClose={() => setOpenDialog('')} PaperProps={{ sx: { p: 1 } }}>
                    <DialogTitle>
                        Delete library
                    </DialogTitle>
                    <DialogContent>
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                            Are you sure you want to delete THIS LIBRARY and ALL RELATED FILES? {'\n'}
                            This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='text' onClick={() => setOpenDialog('')}>
                            Cancel
                        </Button>
                        <LoadingButton
                            loading={loading}
                            variant='contained'
                            color='error'
                            onClick={deleteLibrary}
                        >
                            Delete
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </>
        </>
    )
}