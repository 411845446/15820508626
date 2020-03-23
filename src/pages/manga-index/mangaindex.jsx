import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import MangaIndex from './home'
import MangaDetail from './detail'


/*
漫画路由
 */
export default class Manga extends Component {
    render() {
        return (
            <Switch>
                <Route path='/mangaindex' component={MangaIndex} exact/> {/*路径完全匹配*/}
                <Route path='/mangaindex/detail' component={MangaDetail}/>
                <Redirect to='/manga'/>
            </Switch>
        )
    }
}