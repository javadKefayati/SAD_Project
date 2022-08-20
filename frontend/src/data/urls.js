const BASE_URL = "http://localhost:8000/"
const urls = {
    login: BASE_URL + "api-token-auth/",
    register: BASE_URL + "api/auth/register",
    getMe: BASE_URL + "api/auth/get-me",
    createLibrary: BASE_URL + "api/library/create",
    listLibraries: BASE_URL + "api/library/list",
    listFiles: BASE_URL + "api/library/<name>/files",
    uploadFile: BASE_URL + "api/file/upload",
    crudFile: BASE_URL + "api/file/<pk>",
    shareFile: BASE_URL + "api/file/<pk>/share",
    sharedList: BASE_URL + "api/library/shared",
}
export default urls