import React, {Component} from 'react'

import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'
import './detail.less'


/*
Manga的详情子路由组件
 */
export default class MangaDetail extends Component {

    state = {
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
    }

    async componentDidMount () {

        // 得到当前漫画的分类ID
        const {pCategoryId, categoryId} = this.props.location.state.item
        if(pCategoryId==='0') { // 一级分类下的漫画
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else { // 二级分类下的漫画
            /*
            //通过多个await方式发多个请求: 后面一个请求是在前一个请求成功返回之后才发送
            const result1 = await reqCategory(pCategoryId) // 获取一级分类列表
            const result2 = await reqCategory(categoryId) // 获取二级分类
            const cName1 = result1.data.name
            const cName2 = result2.data.name
            */

            // 一次性发送多个请求, 只有都成功了, 才正常处理
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }

    }

    render() {

        // 读取携带过来的state数据
      //  const {name, desc, updateTime, detail, imgs} = this.props.location.state.item
        const {name, updateTime, detail, imgs} = this.props.location.state.item
        const {cName1, cName2} = this.state


        return (
            <div className={"app-layout"}>
                <div className={"manga-detail"} >
                    <div className={"manga-div-left"}
                    >
                        <span>
                        {
                    imgs.map(img => (
                      <img
                          key={img}
                          src={BASE_IMG_URL + img}
                          className="manga-img"
                          alt="img"
                      />
                    ))
                    }
            </span>
                    </div>
                    <div className={"manga-div-right"}>
                        <h1 className={"manga-title"}>{name}</h1>
                        <p>{cName1} {cName2 ? '，'+cName2 : ''}</p>
                        <p>{updateTime}</p>
                        <p><span dangerouslySetInnerHTML={{__html: detail}}>
                        </span></p>
                     </div>
                </div>
                <div className={"section-title"}>
                        1234
                </div>
            </div>
        )
    }
}