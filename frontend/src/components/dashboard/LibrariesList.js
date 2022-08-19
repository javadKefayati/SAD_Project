import * as React from 'react'
import { Typography, Box, Grid } from '@mui/material';
import LibraryItem from './LibraryItem';
import styled from 'styled-components'
import { unstable_styleFunctionSx } from '@mui/system';
import { useOutletContext } from 'react-router-dom';

const Image = styled('img')(unstable_styleFunctionSx)

export default function LibrariesList() {
    const [libraries, setLibraries] = useOutletContext()
    return (
        <>
            {libraries.length === 0 &&
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
                        src={"/icons/not-found.gif"}
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
                        No libraries found
                    </Typography>
                </Box>
            }
            <Grid container spacing={2} sx={{p: 2}}>
                {libraries.map(item =>
                    <Grid item xs={3} key={item.id}>
                        <LibraryItem name={item.name} fileCount={item.file_count} />
                    </Grid>
                )}
            </Grid>
        </>
    )
}