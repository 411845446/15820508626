import React, {PureComponent} from 'react'
import {
    Card,
    Icon,
    Form,
    Input,
    Button,
    message
} from 'antd'

import PicturesWall from '../manga/pictures-wall'
import RichTextEditor from '../manga/rich-text-editor'
import LinkButton from '../../components/link-button'
import {reqAddOrUpdateEpisode} from '../../api'

const {Item} = Form
const { TextArea } = Input



/*
Manga的添加和更新的子路由组件
 */
class EpisodeAddUpdate extends PureComponent {

    state = {
        mangaName:'',
        mangaId:''
    }

    constructor (props) {
        super(props)
        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }


    submit = () => {
        // 进行表单验证, 如果通过了, 才发送请求
        this.props.form.validateFields(async (error, values) => {
            if (!error) {

                // 1. 收集数据, 并封装成manga对象
                const {name, desc} = values

                const imgs = this.pw.current.getImgs()

                const detail = this.editor.current.getDetail()

                const mangaId = this.state.mangaId

                const mangaName = this.state.mangaName

                const episode = {name, desc, imgs, detail,mangaName,mangaId}

                // 如果是更新, 需要添加_id
                if(this.isUpdate) {
                    episode._id = this.episode._id
                    console.log( episode._id)
                }

                // 2. 调用接口请求函数去添加/更新
                const result = await reqAddOrUpdateEpisode(episode)

                // 3. 根据结果提示
                if (result.status===0) {
                    console.log(episode)
                    message.success(`${this.isUpdate ? '更新' : '添加'}分话成功!`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}分话失败!`)
                }
            }
        })
    }

    componentDidMount () {
    }

    componentWillMount () {
        // 取出携带的epsiode
        const episode = this.props.location.state.episode  // 如果是添加没值, 否则有值
        // 保存是否是更新的标识
        this.isUpdate = !!episode
        // 保存分话(如果没有, 保存是{})
        this.episode = episode || {}
        // 取出携带的manga
        const manga = this.props.location.state.manga
        // 保存漫画(如果没有, 保存是{})
        this.manga = manga || {}

        const {name,_id} = this.manga
        this.setState({
            mangaName:name,
            mangaId:_id
        })
    }

    render() {

        const {isUpdate, episode} = this
        const {imgs, detail} = episode

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 },  // 左侧label的宽度
            wrapperCol: { span: 8 }, // 右侧包裹的宽度
        }

        // 头部左侧标题
        const title = (
            <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize: 20}}/>
        </LinkButton>
        <span>{isUpdate ? '修改分话' : '添加分话'}</span>
      </span>
        )

        const {getFieldDecorator} = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="分话名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: episode.name,
                                rules: [
                                    {required: true, message: '必须输入分话名称'}
                                ]
                            })(<Input placeholder='请输入分话名称'/>)
                        }
                    </Item>
                    <Item label="分话描述">
                        {
                            getFieldDecorator('desc', {
                                initialValue: episode.desc,
                                rules: [
                                    {required: true, message: '必须输入分话描述'}
                                ]
                            })(<TextArea placeholder="请输入分话描述" autosize={{ minRows: 2, maxRows: 6 }} />)
                        }

                    </Item>
                    <Item label="分话图片">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="分话详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(EpisodeAddUpdate)
