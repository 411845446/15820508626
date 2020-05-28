import React, {Component} from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqEpisodesPage, reqSearchEpisodes} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
import {formateDate} from "../../utils/dateUtils";

const Option = Select.Option

/*
episode的默认子路由组件
 */
export default class ShowEpisodes extends Component {

    state = {
        total: 0, // 漫画的总数量
        loading: false, // 是否正在加载中
        searchName: '', // 搜索的关键字
        searchType: 'episodeName', // 根据哪个字段搜索
        episodes:[],
        manga:{}
    }

    /*
    初始化table的列的数组
     */
    initColumns = () => {

        this.columns = [
            {
                title: '分话名称',
                dataIndex: 'name',
            },
            {
                title: '分话描述',
                dataIndex: 'desc',
            },
            {
                title: '更新时间',
            /*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数调用处理的函数并传入数据*/
                render(episode) {
                    let updateTime =  formateDate(episode.updateTime)
                    return updateTime
                }
            },
            {
                title: '操作',
                width: 300,
                render: (episode) => ( // 返回需要显示的界面标签
                    <span>
                        {/*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数调用处理的函数并传入数据*/}
                        <LinkButton  onClick={() => this.props.history.push('/episode/addUpdate',{episode})}>修改分话</LinkButton>
                        <LinkButton  onClick={() => this.props.history.push('/episode/viewEpisodes',{episode})}>查看分话</LinkButton>
                    </span>
                )
            }
        ];
    }


    /*
 异步获取列表显示
  */
    getEpisodes = async (pageNum) => {

        // 在发请求前, 显示loading
        this.setState({loading: true})
        const {_id} =  this.state.manga
        const {searchName, searchType} = this.state
        // 如果搜索关键字有值, 说明我们要做搜索分页
        let result
        if (searchName) {
            result = await reqSearchEpisodes({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        } else { // 一般分页请求 发异步ajax请求, 获取数据
            result = await reqEpisodesPage(pageNum, PAGE_SIZE, _id)
        }
        // 在请求完成后, 隐藏loading
        this.setState({loading: false})
        const {total,list} = result.data
        if(result.status===0) {
                this.setState({
                    total:total,
                    episodes:list
                })
                console.log('----', this.state.episodes.length)
        } else {
            message.error('获取分类列表失败')
        }
    }


    /*
    获取指定页码的列表数据显示
     */
    getEpisodesPage = async (pageNum) => {
        this.pageNum = pageNum // 保存pageNum, 让其它方法可以看到
        this.setState({loading: true}) // 显示loading
        const {_id} = this.state.manga
        const {searchName, searchType} = this.state
        // 如果搜索关键字有值, 说明我们要做搜索分页
        let result
        if (searchName) {
            result = await reqSearchEpisodes({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        } else { // 一般分页请求
            console.log('111'+_id)
            result = await reqEpisodesPage(pageNum, PAGE_SIZE,_id)
        }

        this.setState({loading: false}) // 隐藏loading
        if (result.status === 0) {
            // 取出分页数据, 更新状态, 显示分页列表
            const {total, list} = result.data
            this.setState({
                total,
                episodes: list
            })
        }
    }


    componentWillMount() {
        let manga = this.props.location.state.manga
        this.setState({
            manga:manga
        })
        this.initColumns()
    }

    componentDidMount() {
        this.getEpisodesPage(1)
    }

    render() {

        // 取出状态数据
        const {episodes,total, loading, searchType, searchName,manga} = this.state

        const title = (
            <span>
        <Select
            value={searchType}
            style={{width: 150}}
            onChange={value => this.setState({searchType: value})}
        >
          <Option value='episodeName'>按名称搜索</Option>
          <Option value='episodeDesc'>按描述搜索</Option>
        </Select>
        <Input
            placeholder='关键字'
            style={{width: 150, margin: '0 15px'}}
            value={searchName}
            onChange={event => this.setState({searchName: event.target.value})}
        />
        <Button type='primary' onClick={() => this.getEpisodes(1)}>搜索</Button>
      </span>
        )

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/episode/addUpdate',{manga})}>
                <Icon type='plus'/>
                添加分话
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={episodes}
                    columns={this.columns}
                    pagination={{
                        current: this.pageNum,
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getEpisodesPage
                    }}
                />
            </Card>
        )
    }
}