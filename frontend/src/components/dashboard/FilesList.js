import * as React from 'react'
import { useParams } from 'react-router-dom'

export default function FilesList() {
    const {name} = useParams()
    const [files, setFiles] = React.useState([])

    
    return (
        <h1>Hello World!</h1>
    )
}