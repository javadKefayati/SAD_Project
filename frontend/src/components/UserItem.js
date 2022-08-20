import { Avatar, Stack, Typography } from '@mui/material';
import * as React from 'react'

function stringToColor(string) {
    let hash = 0;
    let i;
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
}

function stringAvatar(name) {
    const hasTwoLetters = name.split(' ').length > 1 && name.split(' ')[1].length > 0
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: hasTwoLetters ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name.split(' ')[0][0],
    };
}

export default function UserItem ({ username, first_name, last_name }) {
    let name = (first_name || last_name) ? `${first_name} ${last_name}` : username
    return (
        <Stack direction="row" spacing={2} alignItems='center'>
            <Avatar {...stringAvatar(name)} />
            <Stack sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: '600' }}>
                    {username}
                </Typography>
                <Typography>
                    {first_name}{' '}{last_name}
                </Typography>
            </Stack>
        </Stack>
    );
}