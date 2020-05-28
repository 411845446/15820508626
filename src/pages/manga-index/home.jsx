import React, {Component} from 'react'
import './home.css'
import {reqCategory,reqMangasRecommendation} from "../../api";
import LinkButton from "../../components/link-button";
import {Row,Col} from 'antd';
import {BASE_IMG_URL} from "../../utils/constants";
import '../../utils/common.css'
import Spin from "antd/es/spin";

/*
Home路由组件
 */
export default class MangaHome extends Component {

    state = {
        mangas: [], // 漫画的数组
        isLoading: false, // 是否正在加载中
        initLoading:false,
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
    }



    /*
      获取指定页码的列表数据显示
       */
    getMangas = async () => {

        let result = await reqMangasRecommendation(1)
        console.log(result)
        if (result.status === 0) {
            // 取出分页数据, 更新状态, 显示分页列表
            const {list} = result.data
            this.setState({
                mangas:list,
                initLoading:true,
            })
        }

    }

    getCategory= async (item) => {

        // 得到当前漫画的分类ID
        const {pCategoryId, categoryId} = item
        if(pCategoryId==='0') { // 一级分类下的漫画
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            const cName2 =''
            return {cName1,cName2}
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
            return {cName1,cName2}
        }

    }

    initManga =() =>{
        let list = this.state.mangas
        list.map((item,index)=>{
            this.getCategory(item).then(res=>{
                const{cName1,cName2} = res
                item.categoryName = cName1+cName2
                console.log(item.categoryName)
            })
            console.log(list.length+'````'+index)
            if(index==list.length-1){
                this.setState({
                    mangas: list,
                    isLoading:true,
                })
            }
        })
    }


   componentWillMount() {
       this.getMangas()
       setTimeout(()=>{
           const {initLoading} =this.state
           if(initLoading){
               this.initManga()
           }
           console.log(this.state.mangas)
       },500)
    }

    componentDidMount() {

    }

    render() {

        // 取出状态数据
        const {isLoading} =this.state
        let mangas
        if(isLoading) {
                mangas = this.state.mangas
                console.log(JSON.stringify(mangas) + '````````')

            return (
                <div>
                    <div className={"header"}>
                        <LinkButton><span className={"nav"}>冒险</span></LinkButton>
                        <LinkButton><span className={"nav"}>热血</span></LinkButton>
                        <LinkButton><span className={"nav"}>搞笑</span></LinkButton>
                        <LinkButton><span className={"nav"}>恋爱</span></LinkButton>
                        <LinkButton><span className={"nav"}>nav 2</span></LinkButton>
                        <LinkButton><span className={"nav"}>nav 3</span></LinkButton>
                        <LinkButton><span className={"nav"}>nav 1</span></LinkButton>
                        <LinkButton><span className={"nav"}>nav 2</span></LinkButton>
                        <LinkButton><span className={"nav"}>nav 3</span></LinkButton>
                    </div>
                    <Row>
                        <Col span={4}>col-4</Col>
                        <Col span={16} className={"m-auto p-relative"}>
                            <Col span={18}>
                                <h1 className={"home-section-title"}>本周推荐</h1>
                                {
                                        mangas.map((item, index) => {
                                            let id = item._id
                                            let idArr = id.split("\"")
                                            id = idArr[0]
                                            return (
                                                <div key={index}
                                                     className={"home-manga-card-vertical dp-i-block v-top border-box home-list-item"}>
                                                    <div className={"home-manga-cover-section p-relative"}>
                                                        <a
                                                            href={'/mangaIndex/detail?id=' + (id)}
                                                            target="_blank"
                                                        >
                                                            <img alt="example"
                                                                 src={BASE_IMG_URL + item.imgs}
                                                                 className={"home-manga-cover-image p-relative bg-cover bg-center bg-no-repeat"}
                                                            />
                                                        </a>
                                                        <div className="text-info-section">
                                                            <div
                                                                className={"home-manga-title-text t-no-wrap t-over-hidden"}>{item.name}</div>
                                                            <div
                                                                className={"home-supporting-text t-no-wrap t-over-hidden"}>{item.categoryName}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                }
                            </Col>
                            <Col span={6} className={"home-rank-list-component border-box dp-i-block v-top"}>
                                <div className={"home-title-row p-relative"}>
                                    <h2 className={"home-section-title ts-dot-4"}>排行榜</h2>
                                    <a href="#" target="_blank"
                                       className="home-ranking-jump p-absolute ts-dot-4">更多></a>
                                </div>
                                <div className="">
                                    <a>
                                        <div className="home-list-item">
                                            1234
                                        </div>
                                    </a>
                                    <a>
                                        <div className="home-list-item">
                                            1234
                                        </div>
                                    </a>
                                    <a>
                                        <div className="home-list-item">
                                            1234
                                        </div>
                                    </a>
                                </div>
                            </Col>
                        </Col>
                        <Col span={4}>col-4</Col>
                    </Row>
                    <div style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</div>
                </div>
            )
        }
        return (
            <div><Spin/></div>
        )
    }
}