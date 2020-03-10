import React, {Component} from 'react'
import './manga.less'
import {reqCategory} from "../../api";
import LinkButton from "../../components/link-button";
import {Card, Icon, List} from "antd";
import {BASE_IMG_URL} from "../../utils/constants";

const Item = List.Item

/*
Home路由组件
 */
export default class MangaList extends Component {

    state = {
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
    }

    async componentDidMount () {

        // 得到当前漫画的分类ID
        const {pCategoryId, categoryId} = this.props.location.state.manga
        if(pCategoryId==='0') { // 一级分类下的漫画
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

    render() {

        // 读取携带过来的state数据
        const {name, desc, updateTime, detail, imgs} = this.props.location.state.manga
        const {cName1, cName2} = this.state

        const title = (
            <span>
        <LinkButton>
          <Icon
              type='arrow-left'
              style={{marginRight: 10, fontSize: 20}}
              onClick={() => this.props.history.goBack()}
          />
        </LinkButton>

        <span>漫画详情</span>
      </span>
        )
        return (
            <Card title={title} className='manga-detail'>
                <List>
                    <Item>
                        <span className="left">漫画名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">漫画描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">更新时间:</span>
                        <span>{updateTime}</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span>{cName1} {cName2 ? ' --> '+cName2 : ''}</span>
                    </Item>
                    <Item>
                        <span className="left">漫画封面:</span>
                        <span>
              {
                  imgs.map(img => (
                      <img
                          key={img}
                          src={BASE_IMG_URL + img}
                          className="manga-img"
                          alt="img"
                      />
                  ))
              }
            </span>
                    </Item>
                    <Item>
                        <span className="left">漫画详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}>
            </span>
                    </Item>

                </List>
            </Card>
        )
    }
}