import * as React from 'react'
import { useParams } from 'react-router-dom'
import urls from '../../data/urls'
import authorizedAxios from '../authorizedAxios'
import { useRecoilValue } from 'recoil'
import atoms from '../../Atoms'
import FileItem from '../FileItem'
import { Grid } from '@mui/material'

export default function FilesList() {
    const { libraryName } = useParams()
    const [files, setFiles] = React.useState([])
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
        <Grid container>
            {files.map(item =>
                <Grid key={item.id} item xs={6} md={4} xl={3}>
                    <FileItem {...item} />
                </Grid>
            )}
        </Grid>
    )
}