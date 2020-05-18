const KEY = 'heimamm_token';
// 设置token
const setToken = token => {
    localStorage.setItem(KEY, token)
}
// 获取token
const getToken = () => {
    return localStorage.getItem(KEY)
}
// 移除token
const removeToken = () => {
    localStorage.removeItem(KEY)
}
// 按需导出
export {
    setToken,
    getToken,
    removeToken
};