/*
要求: 能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise

基本要求: 能根据接口文档定义接口请求函数
 */
import jsonp from 'jsonp'
import {message} from 'antd'
import ajax from './ajax'

// const BASE = 'http://localhost:5000'
const BASE = ''
// 登陆
/*
export function reqLogin(username, password) {
  return ajax('/login', {username, password}, 'POST')
}*/
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

// 获取漫画分页列表
export const reqMangas = (pageNum, pageSize) => ajax(BASE + '/manage/manga/list', {pageNum, pageSize})

// 获取指定漫画
export const reqManga = (mangaId) => ajax(BASE + '/manage/manga/info', {mangaId})

// 获取推荐漫画
export const reqMangasRecommendation = (recommendation) => ajax(BASE + '/manage/manga/searchRecommendation', {recommendation})

// 更新漫画的状态(上架/下架)
export const reqUpdateStatus = (mangaId, status) => ajax(BASE + '/manage/manga/updateStatus', {mangaId, status}, 'POST')

// 更新漫画的状态(上架/下架)
export const reqUpdateRecommendation = (mangaId, recommendation) => ajax(BASE + '/manage/manga/updateRecommendation', {mangaId, recommendation}, 'POST')

/*
搜索漫画分页列表 (根据漫画名称/漫画描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchMangas = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/manga/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,
})

// 搜索漫画分页列表 (根据漫画描述)
/*export const reqSearchmanga2 = ({pageNum, pageSize, searchName}) => ajax(BASE + '/manage/manga/search', {
  pageNum,
  pageSize,
  productDesc: searchName,
})*/

// 删除指定名称的漫画
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

// 添加/修改漫画
export const reqAddOrUpdateManga = (manga) => ajax(BASE + '/manage/manga/' + ( manga._id?'update':'add'), manga, 'POST')
// 修改商品
// export const reqUpdateProduct = (manga) => ajax(BASE + '/manage/manga/update', manga, 'POST')



// 获取分话分页列表
export const reqEpisodesPage = (pageNum, pageSize, mangaId) => ajax(BASE + '/manage/episode/listPage', {pageNum, pageSize,mangaId})

// 获取指定分话
export const reqEpisode = (name) => ajax(BASE + '/manage/episode/getEpisode', {name})

//获取分话列表
export const reqEpisodes = (mangaId) => ajax(BASE + '/manage/episode/list', {mangaId})


// 更新分话的状态(上架/下架)
export const reqEpisodeUpdateStatus = (episodeId, status) => ajax(BASE + '/manage/episode/updateStatus', {episodeId, status}, 'POST')



/*
搜索分话分页列表 (根据漫画名称/漫画描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchEpisodes = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/episode/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,
})


// 删除指定名称的分话
export const reqDeleteEpisodesImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

// 添加/修改分话
export const reqAddOrUpdateEpisode = (episode) => ajax(BASE + '/manage/episode/' + ( episode._id?'update':'add'), episode, 'POST')


// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')
// 添加角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')


// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')
// 删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')

/*
json请求的接口请求函数
 */
export const reqWeather = (city) => {

  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    // 发送jsonp请求
    jsonp(url, {}, (err, data) => {
      console.log('jsonp()', err, data)
      // 如果成功了
      if (!err && data.status==='success') {
        // 取出需要的数据
        const {dayPictureUrl, weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        // 如果失败了
        message.error('获取天气信息失败!')
      }

    })
  })
}
// reqWeather('北京')
/*
jsonp解决ajax跨域的原理
  1). jsonp只能解决GET类型的ajax请求跨域问题
  2). jsonp请求不是ajax请求, 而是一般的get请求
  3). 基本原理
   浏览器端:
      动态生成<script>来请求后台接口(src就是接口的url)
      定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
   服务器端:
      接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
   浏览器端:
      收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
 */