import * as React from 'react'
import { useRecoilValue } from 'recoil'
import atoms from '../../Atoms'
import authorizedAxios from '../authorizedAxios'

export default function ShareFilForm({id, name}) {
    const [sharedWith, setSharedWith] = React.useState([])

    const auth = useRecoilValue(atoms.AuthAtom)

    React.useEffect(() => {
        authorizedAxios(auth).get()
    }, [])
    return (
        <>
        </>
    )
}