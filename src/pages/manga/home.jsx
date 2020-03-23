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
import {reqMangas, reqSearchMangas, reqUpdateRecommendation, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option

/*
Manga的默认子路由组件
 */
export default class MangaHome extends Component {

  state = {
    total: 0, // 漫画的总数量
    mangas: [], // 漫画的数组
    loading: false, // 是否正在加载中
    searchName: '', // 搜索的关键字
    searchType: 'mangaName', // 根据哪个字段搜索
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
        render:(manga) =>{
          const {updateTime} = manga
          let day
          switch (updateTime) {
            case 1:
              day='周一';
              break;
            case 2:
              day='周二';
              break;
            case 3:
              day='周三';
              break;
            case 4:
              day='周四';
              break;
            case 5:
              day='周五';
              break;
            case 6:
              day='周六';
              break;
            case 7:
              day='周日';
              break;
            default:
              day='没有填写'
              break;
          }
          return(
              <span>{day}</span>
          )
        }

      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (manga) => {
          const {status, _id} = manga
          console.log(_id)
          const newStatus = status===1 ? 2 : 1
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status===1 ? '下架' : '上架'}
              </Button>
              <span>{status===1 ? '在上架' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (manga) => {
          const {recommendation, _id} = manga
          console.log(_id)
          const newRecommendation = recommendation===1 ? 0 : 1
          return (
              <span>
              <Button
                  type='primary'
                  onClick={() => this.updateRecommendation(_id, newRecommendation)}
              >
                {recommendation===1 ? '不推荐' : '推荐'}
              </Button>
              <span>{recommendation===1 ? '已推荐' : '没推荐'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (manga) => {
          return (
            <span>
              {/*将manga对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/manga/detail', {manga})}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/manga/addupdate', manga)}>修改</LinkButton>
            </span>
          )
        }
      },
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

  /*
  更新指定漫画的状态
   */
  updateStatus = async (mangaId, status) => {
    console.log(mangaId)
    const result = await reqUpdateStatus(mangaId, status)
    if(result.status===0) {
      message.success('更新漫画状态成功')
      this.getMangas(this.pageNum)
    }
  }

  /*
  更新指定漫画的状态
   */
  updateRecommendation = async (mangaId, recommendation) => {
    console.log(mangaId)
    const result = await reqUpdateRecommendation(mangaId, recommendation)
    if(result.status===0) {
      message.success('更新漫画推荐成功')
      this.getMangas(this.pageNum)
    }
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getMangas(1)
  }

  render() {

    // 取出状态数据
    const {mangas, total, loading, searchType, searchName} = this.state



    const title = (
      <span>
        <Select
          value= {searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType:value})}
        >
          <Option value='mangaName'>按名称搜索</Option>
          <Option value='mangaDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={searchName}
          onChange={event => this.setState({searchName:event.target.value})}
        />
        <Button type='primary' onClick={() => this.getMangas(1)}>搜索</Button>
      </span>
    )

    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/manga/addupdate')}>
        <Icon type='plus'/>
        添加漫画
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
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