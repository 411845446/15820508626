import React, {PureComponent} from 'react'
import {
  Card,
  Icon,
  Form,
  Input,
  Cascader,
  Button,
  message, Select
} from 'antd'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddOrUpdateManga} from '../../api'

const {Item} = Form
const { TextArea } = Input

const Option = Select.Option
/*
Manga的添加和更新的子路由组件
 */
class MangaAddUpdate extends PureComponent {

  state = {
    options: [],
  }

  constructor (props) {
    super(props)

    // 创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  initOptions = async (categorys) => {
    // 根据categorys生成options数组
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }))

    // 如果是一个二级分类漫画的更新
    const {isUpdate, manga} = this
    const {pCategoryId} = manga
    if(isUpdate && pCategoryId!=='0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      // 找到当前漫画对应的一级option对象
      const targetOption = options.find(option => option.value===pCategoryId)

      // 关联对应的一级option上
      targetOption.children = childOptions
    }


    // 更新options状态
    this.setState({
      options
    })
  }

  /*
  异步获取一级/二级分类列表, 并显示
  async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
   */
  getCategorys = async (mangaId) => {
    const result = await reqCategorys(mangaId)   // {status: 0, data: categorys}
    if (result.status===0) {
      const categorys = result.data
      // 如果是一级分类列表
      if (mangaId==='0') {
        this.initOptions(categorys)
      } else { // 二级列表
        return categorys  // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
      }
    }
  }


  /*
  验证价格的自定义验证函数
   */
  validateUpdateTime = (rule, value, callback) => {
    console.log(value, typeof value)
    if (value*1 > 0) {
      callback() // 验证通过
    } else {
      callback('必须选择一个') // 验证没通过
    }
  }

  /*
  用加载下一级列表的回调函数
   */
  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0]
    // 显示loading
    targetOption.loading = true

    // 根据选中的分类, 请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    // 隐藏loading
    targetOption.loading = false
    // 二级分类数组有数据
    if (subCategorys && subCategorys.length>0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else { // 当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options],
    })
  }

  submit = () => {
    // 进行表单验证, 如果通过了, 才发送请求
    this.props.form.validateFields(async (error, values) => {
      if (!error) {

        // 1. 收集数据, 并封装成manga对象
        const {name, desc, updateTime, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()

        const manga = {name, desc, updateTime, imgs, detail, pCategoryId, categoryId}

        // 如果是更新, 需要添加_id
        if(this.isUpdate) {
          manga._id = this.manga._id
        }

        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateManga(manga)

        // 3. 根据结果提示
        if (result.status===0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}漫画成功!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}漫画失败!`)
        }
      }
    })
  }

  componentDidMount () {
    this.getCategorys('0')
  }

  componentWillMount () {
    // 取出携带的state
    const manga = this.props.location.state  // 如果是添加没值, 否则有值
    // 保存是否是更新的标识
    this.isUpdate = !!manga
    // 保存漫画(如果没有, 保存是{})
    this.manga = manga || {}
  }

  render() {

    const {isUpdate, manga} = this
    const {pCategoryId, categoryId, imgs, detail} = manga
    // 用来接收级联分类ID的数组
    const categoryIds = []
    if(isUpdate) {
      // 漫画是一个一级分类的漫画
      if(pCategoryId==='0') {
        categoryIds.push(categoryId)
      } else {
        // 漫画是一个二级分类的漫画
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

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
        <span>{isUpdate ? '修改漫画' : '添加漫画'}</span>
      </span>
    )

    const {getFieldDecorator} = this.props.form

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="漫画名称">
            {
              getFieldDecorator('name', {
                initialValue: manga.name,
                rules: [
                  {required: true, message: '必须输入漫画名称'}
                ]
              })(<Input placeholder='请输入漫画名称'/>)
            }
          </Item>
          <Item label="漫画描述">
            {
              getFieldDecorator('desc', {
                initialValue: manga.desc,
                rules: [
                  {required: true, message: '必须输入漫画描述'}
                ]
              })(<TextArea placeholder="请输入漫画描述" autosize={{ minRows: 2, maxRows: 6 }} />)
            }

          </Item>
          <Item label="更新时间">
            {
              getFieldDecorator('updateTime', {
                initialValue: manga.updateTime,
                rules: [
                  {validator: this.validateUpdateTime}
                ]
              })(<Select>
                <Option value='1'>星期一</Option>
                <Option value='2'>星期二</Option>
                <Option value='3'>星期三</Option>
                <Option value='4'>星期四</Option>
                <Option value='5'>星期五</Option>
                <Option value='6'>星期六</Option>
                <Option value='7'>星期日</Option>

              </Select>)
            }
          </Item>
          <Item label="漫画分类">
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [
                  {required: true, message: '必须指定漫画分类'},
                ]
              })(
                <Cascader
                  placeholder='请指定漫画分类'
                  options={this.state.options}  /*需要显示的列表数据数组*/
                  loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                />
              )
            }

          </Item>
          <Item label="漫画图片">
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label="漫画详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
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

export default Form.create()(MangaAddUpdate)


/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
使用ref
1. 创建ref容器: thi.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
3. 通过ref容器读取标签元素: this.pw.current
 */