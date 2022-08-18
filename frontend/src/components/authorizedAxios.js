import axios from 'axios'

const authorizedAxios = (auth) => axios.create({
    headers: {
        Authorization: `Token ${auth.token}`
    }
})

export default authorizedAxios