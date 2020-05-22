import axios from "axios";
const axiosInstance = axios.create()

export const loadUniversityDesc = async function (universityName: string) {
    return await axiosInstance.get<string>(`./static/学校介绍/${universityName}.txt`)
}

export const loadUniversityLogo = async function (universityName: string) {
    return await axiosInstance.get(`./static/logo/${universityName}.jpg`, {
        responseType: "blob"
    })
}

export const loadArticleTemplate = async function (name: string) {
    return await axiosInstance.get<string>(`./static/template/${name}`);
}
