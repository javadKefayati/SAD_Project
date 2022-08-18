import * as React from 'react'
import { Stack, List, ListItemButton, ListItemIcon, ListItemText, Button, Box } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DescriptionIcon from '@mui/icons-material/Description';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import AppsIcon from '@mui/icons-material/Apps';
import AddIcon from '@mui/icons-material/Add';

export default function Sidebar({addLibraryClicked, listItemSelected}) {
    return (
        <Stack sx={{py: 2}}>
            <Box sx={{px: 2}}>
                <Button
                    startIcon={<AddIcon />}
                    variant='contained'
                    size='large'
                    sx={{borderRadius: 8}}
                    onClick={addLibraryClicked}
                >
                    Add Library
                </Button>
            </Box>
            <List>
                <ListItemButton onClick={() => listItemSelected('all')}>
                    <ListItemIcon>
                        <AppsIcon />
                    </ListItemIcon>
                    <ListItemText primary="All" />
                </ListItemButton>
                <ListItemButton onClick={() => listItemSelected('image')}>
                    <ListItemIcon>
                        <ImageIcon />
                    </ListItemIcon>
                    <ListItemText primary="Images" />
                </ListItemButton>
                <ListItemButton onClick={() => listItemSelected('video')}>
                    <ListItemIcon>
                        <VideoLibraryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Videos" />
                </ListItemButton>
                <ListItemButton onClick={() => listItemSelected('document')}>
                    <ListItemIcon>
                        <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Documents" />
                </ListItemButton>
                <ListItemButton onClick={() => listItemSelected('audio')}>
                    <ListItemIcon>
                        <AudioFileIcon />
                    </ListItemIcon>
                    <ListItemText primary="Audios" />
                </ListItemButton>
            </List>
        </Stack>
    )
}