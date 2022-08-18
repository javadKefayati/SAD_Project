import * as React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import { Dialog, Typography, CssBaseline, Toolbar, AppBar, Drawer, Box, DialogContent, DialogTitle } from '@mui/material';
import AddLibraryForm from '../components/forms/AddLibraryForm';

const drawerWidth = 240;

export default function ClippedDrawer() {
    const [addLibraryOpen, setAddLibraryOpen] = React.useState(false)

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
                        <Sidebar addLibraryClicked={() => setAddLibraryOpen(true)}/>
                    </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    Hello, World!
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
                    <AddLibraryForm close={() => setAddLibraryOpen(false)}/>
                </DialogContent>
            </Dialog>
        </>
    )
}
