import * as React from 'react'
import { useParams } from 'react-router-dom'
import urls from '../../data/urls'
import authorizedAxios from '../authorizedAxios'
import { useRecoilValue } from 'recoil'
import atoms from '../../Atoms'

export default function FilesList() {
    const { libraryName } = useParams()
    const [files, setFiles] = React.useState([])
    const auth = useRecoilValue(atoms.AuthAtom)

    const loadFiles = () => {
        const url = urls.listFiles.replace("<name>", libraryName)
        authorizedAxios(auth).get(url).then(res => {
            //TODO: add pagination
            setFiles(res.data)
            console.log(res.data)
        }).catch(err => {
            //TODO: load 404 page
        })
    }

    React.useEffect(() => loadFiles(), [])
    return (
        <>
            {files.map(item => <p key={item.name}>{item.name}</p>)}
        </>
    )
}