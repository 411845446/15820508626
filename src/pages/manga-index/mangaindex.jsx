import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import MangaIndex from './home'
import MangaDetail from './detail'
import View from './view'


/*
漫画路由
 */
export default class Manga extends Component {
    render() {
        return (
            <Switch>
                <Route path='/mangaIndex' component={MangaIndex} exact/> {/*路径完全匹配*/}
                <Route path='/mangaIndex/detail' component={MangaDetail}/>
                <Route path='/mangaIndex/view' component={View}/>
                <Redirect to='/mangaIndex'/>
            </Switch>
        )
    }
}