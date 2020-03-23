import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'


import EpisodeHome from './home'
import EpisodeAddUpdate from './add-update'
import ShowEpisodes from "./showepisodes";
import viewEpisode from "./viewepisode";


/*
漫画路由
 */
export default class Episode extends Component {
    render() {
        return (
            <Switch>
                <Route path='/episode' component={EpisodeHome} exact/>
                <Route path='/episode/addUpdate' component={EpisodeAddUpdate}/>
                <Route path='/episode/showEpisodes' component={ShowEpisodes}/>
                <Route path='/episode/viewEpisodes' component={viewEpisode}/>
                <Redirect to='/episode'/>
            </Switch>
        )
    }
}