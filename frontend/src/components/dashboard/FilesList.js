import * as React from 'react'
import { useParams } from 'react-router-dom'
import urls from '../../data/urls'
import authorizedAxios from '../authorizedAxios'
import { useRecoilValue } from 'recoil'
import atoms from '../../Atoms'
import FileItem from '../FileItem'
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Toolbar, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import UploadFileForm from '../forms/UploadFileForm'
import { LoadingButton } from '@mui/lab'

export default function FilesList() {
    const { libraryName } = useParams()
    const [files, setFiles] = React.useState([])
    const [selectedFile, setSelectedFile] = React.useState()
    const [openDialog, setOpenDialog] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const auth = useRecoilValue(atoms.AuthAtom)

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
        const url = urls.deleteFile.replace("<pk>", selectedFile.id)
        authorizedAxios(auth).delete(url).then(res => {
            setFiles(files.filter(item => item.id != selectedFile.id))
            setSelectedFile(null)
            setLoading(false)
            setOpenDialog('')
        }).catch(err => {setLoading(false)})
    }

    const shareClicked = (file) => {

    }

    const downloadClicked = (file) => {

    }

    React.useEffect(() => loadFiles(), [])
    return (
        <>
            <AppBar position='relative' color='transparent'>
                <Toolbar sx={{ justifyContent: 'end' }}>
                    <Button
                        startIcon={<UploadFileIcon />}
                        onClick={() => setOpenDialog('upload')}
                        variant='outlined'
                        sx={{ mr: 2 }}>
                        New file
                    </Button>
                    <Button startIcon={<DeleteForeverIcon />} variant='outlined'>
                        Delete library
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container sx={{ p: 2 }} spacing={2}>
                {files.map(item =>
                    <Grid key={item.id} item xs={6} md={4} xl={3}>
                        <FileItem
                            {...item}
                            onDelete={() => deleteClicked(item)}
                            onDownload={() => downloadClicked(item)}
                            onShare={() => shareClicked(item)}
                        />
                    </Grid>
                )}
            </Grid>
            <Dialog maxWidth={'sm'} fullWidth open={openDialog === 'upload'} onClose={() => setOpenDialog('')}>
                <DialogTitle>
                    Upload File
                </DialogTitle>
                <DialogContent>
                    <UploadFileForm library={libraryName} submitted={addNewFile} />
                </DialogContent>
            </Dialog>
            <Dialog maxWidth={'sm'} fullWidth open={openDialog === 'delete'} onClose={() => setOpenDialog('')} PaperProps={{sx: {p: 1}}}>
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
        </>
    )
}