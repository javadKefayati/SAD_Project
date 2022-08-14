import * as React from 'react'
import { Stack, List, ListItemButton, ListItemIcon, ListItemText, Button, Box } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DescriptionIcon from '@mui/icons-material/Description';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import AddIcon from '@mui/icons-material/Add';

export default function Sidebar() {
    return (
        <Stack sx={{py: 2}}>
            <Box sx={{px: 2}}>
                <Button startIcon={<AddIcon />} variant='contained' size='large' sx={{borderRadius: 8}}>
                    Add Library
                </Button>
            </Box>
            <List>
                <ListItemButton>
                    <ListItemIcon>
                        <ImageIcon />
                    </ListItemIcon>
                    <ListItemText primary="Images" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <VideoLibraryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Videos" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Documents" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <AudioFileIcon />
                    </ListItemIcon>
                    <ListItemText primary="Audios" />
                </ListItemButton>
            </List>
        </Stack>
    )
}