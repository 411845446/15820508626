import React, {Component} from 'react'
import {
    Card,
    Icon,
    Row,Col
} from 'antd'

import {BASE_IMG_URL} from '../../utils/constants'
import LinkButton from "../../components/link-button";
import Pagination from "antd/es/pagination";

import './view.less'


/*
Manga的默认子路由组件
 */
export default class View extends Component {

    state = {
        loading: false, // 是否正在加载中
        episode: {},
        imgs: [],
        img:'',
        total:'',
    }


    getEpisode = (page) =>{
       const {imgs} = this.props.location.state.item
        let imgArr = []
        imgArr =  imgs.toString().split(',')
        let total = imgArr.length
        let img = imgArr[page-1]
        this.setState({
            img:BASE_IMG_URL +img,
            total:total,
        })
    }


    componentWillMount() {
        let episode = this.props.location.state.item
        this.setState({
            episode:episode
        })
        this.getEpisode(1)
    }

    componentDidMount() {
    }

    render() {

        // 取出状态数据
        /*const {loading} = this.state*/

        const {imgs,name,desc} = this.state.episode

        const result = imgs.map(img => (BASE_IMG_URL + img))

        console.log(result+'-*--')

        const title = (
            <Row>
                <Col span={10}>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{fontSize: 20}}/>
                </LinkButton>
                </Col>
                <Col span={14}>
                    <LinkButton onClick={() => this.props.history.push('/mangaIndex')}>首页 </LinkButton>>
                    <LinkButton onClick={() => this.props.history.goBack()}>{name} </LinkButton>>
                    <div className={"episode-title"}>{desc}12312321311</div>
                </Col>
            </Row>
        )


        return (
            <Card title={title}>
                <div className={"manga-episode"}>
                    <img key={this.state.img}
                         src={this.state.img}
                         className={"manga-episode-img"}
                         alt="img"></img>
                <Pagination
                    defaultPageSize={1}
                    total={this.state.total}
                    showQuickJumper
                    showTotal={total => `Total ${total} items`}
                    onChange={this.getEpisode}
                />
                </div>

            </Card>
        )
    }
}