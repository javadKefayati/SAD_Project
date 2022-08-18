import * as React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import { Dialog, Typography, CssBaseline, Toolbar, AppBar, Drawer, Box, DialogContent, DialogTitle, Grid } from '@mui/material';
import AddLibraryForm from '../components/forms/AddLibraryForm';
import authorizedAxios from '../components/authorizedAxios';
import atoms from '../Atoms';
import { useRecoilValue } from 'recoil';
import urls from '../data/urls';
import LibraryItem from '../components/dashboard/LibraryItem';
import styled from 'styled-components'
import { unstable_styleFunctionSx } from '@mui/system';


const drawerWidth = 240;

const Image = styled('img')(unstable_styleFunctionSx)

export default function DashboardPage() {
    const [addLibraryOpen, setAddLibraryOpen] = React.useState(false)
    const [libraries, setLibraries] = React.useState([])
    const [type, setType] = React.useState('all')
    const auth = useRecoilValue(atoms.AuthAtom)

    const loadLibraries = (type) => {
        setType(type)
        authorizedAxios(auth).get(urls.listLibraries, {
            params: { type: type }
        }).then(res => {
            setLibraries(res.data.libraries)
        }).catch(err => { })
    }

    const addNewLibrary = (library) => {
        if (type === library.data_type || type === 'all') {
            setLibraries([...libraries, library])
        }
    }

    React.useEffect(() => loadLibraries('all'),[])

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            App Name
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <Sidebar
                            addLibraryClicked={() => setAddLibraryOpen(true)}
                            listItemSelected={loadLibraries}
                        />
                    </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
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
                                sx={{maxWidth: {
                                    xs: '150px',
                                    sm: '200px',
                                    md: '300px',
                                    lg: '400px'
                                }}}
                            />
                            <Typography
                                variant="h5"
                                sx={{ color: '#4F5D73' }}
                            >
                                No libraries found
                            </Typography>
                        </Box>
                    }
                    <Grid container spacing={2}>
                        {libraries.map(item =>
                            <Grid item xs={3} key={item.id}>
                                <LibraryItem name={item.name} fileCount={item.file_count} />
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Box>
            <Dialog
                open={addLibraryOpen}
                onClose={() => setAddLibraryOpen(false)}
                maxWidth='sm'
                fullWidth
            >
                <DialogTitle>
                    Add Library
                </DialogTitle>
                <DialogContent>
                    <AddLibraryForm close={() => setAddLibraryOpen(false)} libraryAdded={addNewLibrary}/>
                </DialogContent>
            </Dialog>
        </>
    )
}
