import React, {Component} from 'react'
import './home.less'
import {reqCategory,reqMangasRecommendation} from "../../api";
import LinkButton from "../../components/link-button";
import {Layout} from 'antd';
import {BASE_IMG_URL} from "../../utils/constants";
import Card from "antd/es/card";
import Meta from "antd/es/card/Meta";

const { Content, Footer } = Layout;


/*
Home路由组件
 */
export default class MangaHome extends Component {

    state = {
        mangas: [], // 漫画的数组
        loading: false, // 是否正在加载中
    }

    /*
  初始化table的列的数组
   */
    initColumns = () => {
        this.columns = [
            {
                width:100,
                height:100,
                title: '',
                render: (img) => (
                    <img key={img}
                         src={img}
                         className="manga-img"
                         alt="img"></img>
                )
            },

        ];
    }

    /*
      获取指定页码的列表数据显示
       */
    getMangas = async () => {
        this.setState({loading: true}) // 显示loading

        // 如果搜索关键字有值, 说明我们要做搜索分页
        let result = await reqMangasRecommendation(1)
        console.log(result)
        this.setState({loading: false}) // 隐藏loading
        if (result.status === 0) {
            // 取出分页数据, 更新状态, 显示分页列表
            const {list} = result.data
            this.setState({
                mangas: list
            })
        }
    }

    getCategory= async (item) => {

        // 得到当前漫画的分类ID
        const {pCategoryId, categoryId} = item
        if(pCategoryId==='0') { // 一级分类下的漫画
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
           // const cName2 = ''
            return cName1.toString()
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
            console.log(results+'1234')
            const cName1 = results[0].data.name
           // const cName2 = results[1].data.name
            return cName1.toString()
        }

    }



    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getMangas()
    }

    render() {

        // 取出状态数据
        const {mangas} = this.state


        return (
            <Layout className="layout">
                <div className={"header"}>
                    <LinkButton onclick={""}><span className={"nav"}>冒险</span></LinkButton>
                    <LinkButton><span className={"nav"}>热血</span></LinkButton>
                    <LinkButton><span className={"nav"}>搞笑</span></LinkButton>
                    <LinkButton><span className={"nav"}>恋爱</span></LinkButton>
                    <LinkButton><span className={"nav"}>nav 2</span></LinkButton>
                    <LinkButton><span className={"nav"}>nav 3</span></LinkButton>
                    <LinkButton><span className={"nav"}>nav 1</span></LinkButton>
                    <LinkButton><span className={"nav"}>nav 2</span></LinkButton>
                    <LinkButton><span className={"nav"}>nav 3</span></LinkButton>
                </div>
                <Content style={{padding: '0 50px'}}>
                    <div className="site-layout-content">
                       {/* <Table
                            rowKey='img'
                            loading={loading}
                            dataSource={list}
                            columns={this.columns}
                            pagination={{defaultPageSize: 8}}
                        />*/}
                        <div className={"left"}>
                            <h1 className={"recommend-title"}>本周推荐</h1>
                        {
                            mangas.map((item,index) => {
                                return (
                                    <Card key={index} className={"card"}
                                        hoverable
                                        style={{width: 200}}
                                        cover={<img alt="example"
                                                    src={BASE_IMG_URL +item.imgs}/>}
                                          onClick={() => this.props.history.push('/mangaindex/detail',{item})}
                                    >
                                               <Meta title={item.name} description={item.desc}/>
                                    </Card>
                                )
                            })
                        }
                        </div>
                        <div></div>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        )
    }
}