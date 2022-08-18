import {atom} from 'recoil'

const AuthAtom = atom({
    key: 'AuthAtom',
    default: {
        token: '89b4c58cb879882a16cef5c819a2225bbd5dad70'
    },
})

const atoms = {
    AuthAtom
}

export default atoms