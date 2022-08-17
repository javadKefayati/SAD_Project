import {atom} from 'recoil'

const AuthAtom = atom({
    key: 'AuthAtom',
    default: {
        token: ''
    },
})

const atoms = {
    AuthAtom
}

export default atoms