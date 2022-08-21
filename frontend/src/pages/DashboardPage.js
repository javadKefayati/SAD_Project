import * as React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import { Dialog, Typography, CssBaseline, Toolbar, AppBar, Drawer, Box, DialogContent, DialogTitle, Button } from '@mui/material';
import AddLibraryForm from '../components/forms/AddLibraryForm';
import authorizedAxios from '../components/authorizedAxios';
import atoms from '../Atoms';
import { useRecoilValue, useRecoilState} from 'recoil';
import urls from '../data/urls';
import { Outlet, useNavigate } from 'react-router-dom';


const drawerWidth = 240;

export default function DashboardPage() {
    const [addLibraryOpen, setAddLibraryOpen] = React.useState(false)
    const [libraries, setLibraries] = React.useState([])
    const [allLibraries, setAllLibraries] = useRecoilState(atoms.LibraryAtom)
    const [type, setType] = React.useState('all')
    const auth = useRecoilValue(atoms.AuthAtom)
    const navigate = useNavigate()

    const loadLibraries = (type) => {
        setType(type)
        authorizedAxios(auth).get(urls.listLibraries, {
            params: { type: type }
        }).then(res => {
            setLibraries(res.data.libraries)
            if(type === 'all')
                setAllLibraries(res.data.libraries)
        }).catch(err => { })
    }

    const showLibraries = (type) => {
        navigate('/home')
        loadLibraries(type)
    }

    const addNewLibrary = (library) => {
        if (type === library.data_type || type === 'all') {
            setLibraries([...libraries, library])
        }
    }

    const logoutClicked = () => {
        authorizedAxios(auth).post(urls.logout).then(res => {
            navigate("/login")
        })
    }

    React.useEffect(() => loadLibraries('all'),[])

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar sx={{justifyContent: 'space-between'}}>
                        <Typography variant="h6" noWrap component="div">
                            Share Drive
                        </Typography>
                        <Button variant="outlined" onClick={logoutClicked} sx={{color: '#ffffff'}}>
                            Logout
                        </Button>
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
                            listItemSelected={showLibraries}
                        />
                    </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1}}>
                    <Toolbar />
                    <Outlet context={[libraries, setLibraries]}/>
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
