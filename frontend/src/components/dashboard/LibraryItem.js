import { ButtonBase, Card, CardContent, Typography } from '@mui/material'
import * as React from 'react'

export default function LibraryItem({ name, fileCount }) {
    return (
        <Card variant='outlined'>
            <ButtonBase sx={{width: '100%', textAlign: 'left', alignItems: 'start', justifyContent: 'start'}}>
                <CardContent>
                    <Typography variant="h6">
                        {name}
                    </Typography>
                    <Typography variant="body2" sx={{color: '#aaaaaa', mt: 1}}>
                        {fileCount} files
                    </Typography>
                </CardContent>
            </ButtonBase>
        </Card>
    )
}