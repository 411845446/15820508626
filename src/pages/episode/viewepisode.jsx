import React, {Component} from 'react'
import {
    Card,
    Table, Icon,
} from 'antd'

import {BASE_IMG_URL} from '../../utils/constants'
import LinkButton from "../../components/link-button";



/*
Manga的默认子路由组件
 */
export default class viewEpisode extends Component {

    state = {
        loading: false, // 是否正在加载中
        episode: {},
        imgs: [],
    }

    /*
    初始化table的列的数组
     */
    initColumns = () => {
        this.columns = [
            {
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


    componentWillMount() {
       let episode = this.props.location.state.episode
        this.setState({
            episode:episode
    })
        const {imgs} = this.state.episode
        console.log(imgs)
        this.initColumns()
    }

    componentDidMount() {
    }

    render() {

        // 取出状态数据
        const {loading} = this.state

        const {imgs} = this.state.episode

        const result = imgs.map(img => (BASE_IMG_URL + img))

        console.log('result'+result)

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{fontSize: 20}}/>
                </LinkButton>
                <span>查看分话</span>
            </span>
        )


        return (
            <Card title={title}>
                <Table
                    rowKey='_id'
                    loading={loading}
                    dataSource={result}
                    columns={this.columns}
                    pagination={{defaultPageSize: 1, showQuickJumper: true}}
                />
            </Card>
        )
    }
}