import React, {Component} from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqMangas, reqSearchMangas} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option

/*
Manga的默认子路由组件
 */
export default class EpisodeHome extends Component {

    state = {
        total: 0, // 漫画的总数量
        mangas: [], // 漫画的数组
        loading: false, // 是否正在加载中
        searchName: '', // 搜索的关键字
        searchType: 'mangaName', // 根据哪个字段搜索
        episodes:[],
    }

    /*
    初始化table的列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '漫画名称',
                dataIndex: 'name',
            },
            {
                title: '漫画描述',
                dataIndex: 'desc',
            },
            {
                title: '更新时间',
                //dataIndex: 'updateTime',
                render: (manga) => {
                    const {updateTime} = manga
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
                            day=''
                            break;
                    }
                    return (
                        <span>{day}</span>
                    )
                }

            },
            {
                title: '操作',
                width: 300,
                render: (manga) => ( // 返回需要显示的界面标签
                    <span>
                        {/*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数调用处理的函数并传入数据*/}
                        <LinkButton onClick={() => this.props.history.push('/episode/showEpisodes', {manga})}>漫画分话详情</LinkButton>

          </span>
                )
            }
        ];
    }


    /*
    获取指定页码的列表数据显示
     */
    getMangas = async (pageNum) => {
        this.pageNum = pageNum // 保存pageNum, 让其它方法可以看到
        this.setState({loading: true}) // 显示loading

        const {searchName, searchType} = this.state
        // 如果搜索关键字有值, 说明我们要做搜索分页
        let result
        if (searchName) {
            result = await reqSearchMangas({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        } else { // 一般分页请求
            result = await reqMangas(pageNum, PAGE_SIZE)
        }

        this.setState({loading: false}) // 隐藏loading
        if (result.status === 0) {
            // 取出分页数据, 更新状态, 显示分页列表
            const {total, list} = result.data
            this.setState({
                total,
                mangas: list
            })
        }
    }


    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getMangas(1)
    }

    render() {

        // 取出状态数据
        const {mangas, total, loading, searchType, searchName} = this.state


        const title = (
            <span>
        <Select
            value={searchType}
            style={{width: 150}}
            onChange={value => this.setState({searchType: value})}
        >
          <Option value='mangaName'>按名称搜索</Option>
          <Option value='mangaDesc'>按描述搜索</Option>
        </Select>
        <Input
            placeholder='关键字'
            style={{width: 150, margin: '0 15px'}}
            value={searchName}
            onChange={event => this.setState({searchName: event.target.value})}
        />
        <Button type='primary' onClick={() => this.getMangas(1)}>搜索</Button>
      </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={mangas}
                    columns={this.columns}
                    pagination={{
                        current: this.pageNum,
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getMangas
                    }}
                />
            </Card>
        )
    }
}