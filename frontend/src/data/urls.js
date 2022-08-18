const BASE_URL = "http://localhost:8000/"
const urls = {
    login: BASE_URL + "api-token-auth/",
    register: BASE_URL + "api/auth/register",
    createLibrary: BASE_URL + "api/library/create",
    listLibraries: BASE_URL + "api/library/list"
}
export default urls