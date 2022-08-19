import * as React from 'react'
import { useParams } from 'react-router-dom'
import urls from '../../data/urls'
import authorizedAxios from '../authorizedAxios'
import { useRecoilValue } from 'recoil'
import atoms from '../../Atoms'
import FileItem from '../FileItem'
import { AppBar, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Toolbar } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import UploadFileForm from '../forms/UploadFileForm'

export default function FilesList() {
    const { libraryName } = useParams()
    const [files, setFiles] = React.useState([])
    const [uploadFileOpen, setUploadFileOpen] = React.useState(false)
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

    React.useEffect(() => loadFiles(), [])
    return (
        <>
            <AppBar position='relative' color='transparent'>
                <Toolbar sx={{justifyContent: 'end'}}>
                    <Button
                        startIcon={<UploadFileIcon />}
                        onClick={() => setUploadFileOpen(true)}
                        variant='outlined'
                        sx={{mr: 2}}>
                        New file
                    </Button>
                    <Button startIcon={<DeleteForeverIcon />} variant='outlined'>
                        Delete library
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container sx={{p: 2}}>
                {files.map(item =>
                    <Grid key={item.id} item xs={6} md={4} xl={3}>
                        <FileItem {...item} />
                    </Grid>
                )}
            </Grid>
            <Dialog maxWidth={'sm'} fullWidth open={uploadFileOpen} onClose={() => setUploadFileOpen(false)}>
                <DialogTitle>
                    Upload File
                </DialogTitle>
                <DialogContent>
                    <UploadFileForm library={libraryName}/>
                </DialogContent>
            </Dialog>
        </>
    )
}