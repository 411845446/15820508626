import React, {Component} from 'react'

import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory, reqEpisodes, reqManga} from '../../api'
import './detail.css'
import '../../utils/common.css'
import {Row, Col, message} from 'antd';

/*
Manga的详情子路由组件
 */
export default class MangaDetail extends Component {

    state = {
        manga:'',
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
        updateTime: '', //更新时间
        isLoading:false,
        episodes:[],
        total:'',
    }


    initDetail = () => {
        const {updateTime} = this.state.manga
        let day
        switch (updateTime) {
            case 1:
                day = '周一';
                break;
            case 2:
                day = '周二';
                break;
            case 3:
                day = '周三';
                break;
            case 4:
                day = '周四';
                break;
            case 5:
                day = '周五';
                break;
            case 6:
                day = '周六';
                break;
            case 7:
                day = '周日';
                break;
            default:
                day = '没有填写'
                break;
        }
        this.setState({
            updateTime: day
        })
    }


    /*
异步获取列表显示
*/
    getManga = async (id) => {
        let result
        result = await reqManga(id)
        console.log(result)
        if(result.status===0) {
            this.setState({
                manga:result.data,
            })
            console.log('----', this.state.manga)
        } else {
            message.error('获取分类列表失败')
        }
    }



    /*
异步获取列表显示
*/
    getEpisodes = async () => {
        // 在发请求前, 显示loading
        this.setState({loading: true})
        const {_id} = this.state.manga
        console.log(_id)
        let result
        result = await reqEpisodes(_id)
        console.log(result)
        // 在请求完成后, 隐藏loading
        this.setState({loading: false})
        if(result.status===0) {
            this.setState({
                episodes:result.data
            })
            console.log('----', this.state.episodes.length)
        } else {
            message.error('获取分类列表失败')
        }
    }

    getCategory = async () =>{
        // 得到当前漫画的分类ID
        const {pCategoryId, categoryId} = this.state.manga
        if (pCategoryId === '0') { // 一级分类下的漫画
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



    componentWillMount(){
        let idArr =this.props.location.search.split('=')
        let id = idArr[1]
        this.getManga(id)
    }


    componentDidMount(){
        setTimeout(()=>{
            this.getCategory()
            this.initDetail()
            this.getEpisodes()
            this.setState({
                isLoading:true,
            })
            },500)
    }



    render() {

        // 读取携带过来的state数据
        //  const {name, desc, updateTime, detail, imgs} = this.props.location.state.item
            const {name, imgs, detail} = this.state.manga
            const {cName1, cName2, updateTime} = this.state
            const {episodes,manga}= this.state
            console.log('111' +manga)

        const {isLoading} =this.state

        if(isLoading){
        return (
            /*<div className={"app-layout"}>
                <div className={"size-ruler p-relative border-box"}>
                    <div className={"manga-detail"}>
                        <div class={"header-info t-no-wrap"}>
                            <div>
                            {
                                imgs.map(img => (
                                <img
                                    key={img}
                                    src={BASE_IMG_URL + img}
                                    className={"manga-cover dp-i-block v-top bg-cover bg-center"}
                                    alt="img"
                                />
                             ))
                             }
                            </div>
                        </div>
                        <div className={"manga-info dp-i-block p-relative v-top border-box"}>
                            <h1 className={"manga-title t-no-wrap t-over-hidden"}>{name}</h1>
                            <h2 title={name} class={"author-name t-over-hidden"}></h2>
                            <div class={"supporting-text"}>
                                <div className={"tag-list"}>
                                    <img src={require("./images/1234.svg")} alt={"icon"} className={"label-icon v-middle"}/>
                                    <span className={"v-middle"}>{cName1} {cName2 ? '，' + cName2 : ''}</span>
                                </div>
                                <div className={"last-update"}>
                                    <img src={require("./images/5678.svg")} alt={"icon"} className={"label-icon v-middle"}/>
                                    <span className={"v-middle"}>更新至 002 话</span>
                                </div>
                                <div className={"update-schedule"}>
                                    <img src={require("./images/78910.svg")} alt={"icon"} className={"label-icon v-middle"}/>
                                    <span className={"v-middle"}>每{updateTime}更新</span>
                                </div>
                                <div className={"season-introduction p-relative"}>
                                    <div className={"size-ruler p-relative over-hidden ts-dot-4"}>
                                        <div className={"introduction-text"} dangerouslySetInnerHTML={{__html: detail}}></div>
                                    </div>
                                </div>
                                <div className={"action-buttons p-relative"}>
                                    <button className={"manga-button continue-read-btn v-middle"}>开始阅读 第 001 话</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>*/
           <div>
                <Row gutter={[0, 70]}>
                    <Col span={24}>col</Col>
                </Row>
                <Row gutter={[0, 80]}>
                    <Col span={4}>col-5</Col>
                    <Col span={16}>
                        <Row>
                            <Col span={6}>{
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        src={BASE_IMG_URL + img}
                                        className={"manga-cover dp-i-block v-top bg-cover bg-center"}
                                        alt="img"
                                    />
                                ))
                            }</Col>
                            <Col span={18} className={"manga-detail"}>
                                <div>
                                    <h1 className={"manga-title t-no-wrap t-over-hidden"}>{name}</h1>
                                    <h2 title={name} className={"author-name t-over-hidden"}>武者サブ ，SE社</h2>
                                </div>
                                <div>
                                    <img src={require("./images/1234.svg")} alt={"icon"}
                                         className={"label-icon v-middle"}/>
                                    <span className={"v-middle"}>{cName1} {cName2 ? '，' + cName2 : ''}</span>
                                </div>
                                <div>
                                    <img src={require("./images/5678.svg")} alt={"icon"}
                                         className={"label-icon v-middle"}/>
                                    <span className={"v-middle"}>更新至 002 话</span>
                                </div>
                                <div>
                                    <img src={require("./images/78910.svg")} alt={"icon"}
                                         className={"label-icon v-middle"}/>
                                    <span className={"v-middle"}>每{updateTime}更新</span>
                                </div>
                                <div className={"m-top"}>
                                    <div className={"introduction-text"}
                                             dangerouslySetInnerHTML={{__html: detail}}>

                                    </div>
                                </div>
                                <div className={"m-top"}>
                                    <button className={"manga-button continue-read-btn v-middle"}>开始阅读 第 001 话</button>
                                </div>
                            </Col>
                        </Row>
                        <div className={"section-title"}>
                            章节列表
                        </div>
                        <div>
                            <div className={"episode-list-component"}>
                                {
                                    episodes.map((item,index) => {
                                        return (
                                            <button className="list-item app-button"  onClick={() => this.props.history.push('/mangaindex/view',{item})} >
                                                <div className="short-title">{item.name}</div>
                                                <div className="title">{item.desc}</div>
                                                <div className="tag container"></div>
                                            </button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className={"section-title"}>
                            相关推荐
                        </div>
                    </Col>
                    <Col span={4}>col-5</Col>
                </Row>
            </div>
        )
        }
        return (
            <div>Loading...</div>
        )

        }
}