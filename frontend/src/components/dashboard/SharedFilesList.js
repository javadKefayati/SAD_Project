import * as React from 'react'
import urls from '../../data/urls'
import authorizedAxios from '../authorizedAxios'
import { useRecoilValue } from 'recoil'
import atoms from '../../Atoms'
import FileItem from '../FileItem'
import { Grid } from '@mui/material'

export default function SharedFilesList() {
    const [files, setFiles] = React.useState([])
    const [selectedFile, setSelectedFile] = React.useState()
    const auth = useRecoilValue(atoms.AuthAtom)

    const loadFiles = () => {
        authorizedAxios(auth).get(urls.sharedList).then(res => {
            //TODO: add pagination
            setFiles(res.data)
        }).catch(err => {
            //TODO: load 404 page
        })
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

    React.useEffect(() => loadFiles(), [])
    return (
        <Grid container sx={{ p: 2 }} spacing={2}>
            {files.map(item =>
                <Grid key={item.id} item xs={6} md={4} xl={3}>
                    <FileItem
                        {...item}
                        onDownload={() => downloadClicked(item)}
                    />
                </Grid>
            )}
        </Grid>
    )
}