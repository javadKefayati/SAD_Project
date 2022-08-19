import { Card, CardActions, CardContent, IconButton, Stack, Typography } from '@mui/material'
import * as React from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import atoms from '../Atoms'
import { useRecoilValue } from 'recoil'

export default function FileItem({ name, file, owner, description, size, can_edit }) {
    const auth = useRecoilValue(atoms.AuthAtom)
    description = ''
    return (
        <Card variant="outlined">
            <CardContent>
                <Stack>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {name.length > 35 ? name.substring(0, 31) + "..." : description}
                    </Typography>
                    <Typography variant='caption' sx={{ color: '#aaaaaa' }}>
                        {description.length > 35 ? description.substring(0, 31) + "..." : description}
                    </Typography>
                    <Typography variant='body2' sx={{ color: '#aaaaaa', flexGrow: 1 }}>
                        {size}
                    </Typography>
                </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: 'end', alignItems: 'end' }}>
                {can_edit &&
                    <>
                        <IconButton size='large'>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton size='large'>
                            <EditIcon />
                        </IconButton>
                        <IconButton size='large'>
                            <ShareIcon />
                        </IconButton>
                    </>
                }
                <IconButton size='large'>
                    <DownloadIcon />
                </IconButton>
            </CardActions>
        </Card>
    )
}