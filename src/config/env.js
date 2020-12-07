// 定义访问的根目录
let baseUrl = ''
// 每页最大显示记录数
const maxResultCount = 5

if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://test.soot.xhs-sz.com:9045/api/v1/'
} else {
    baseUrl = 'http://172.16.10.115:44391/api/v1/'
}

export { baseUrl, maxResultCount }
