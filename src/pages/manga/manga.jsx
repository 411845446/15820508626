import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import MangaHome from './home'
import MangaAddUpdate from './add-update'
import MangaDetail from './detail'

import './manga.less'

/*
漫画路由
 */
export default class Manga extends Component {
  render() {
    return (
      <Switch>
        <Route path='/manga' component={MangaHome} exact/> {/*路径完全匹配*/}
        <Route path='/manga/addupdate' component={MangaAddUpdate}/>
        <Route path='/manga/detail' component={MangaDetail}/>
        <Redirect to='/manga'/>
      </Switch>
    )
  }
}