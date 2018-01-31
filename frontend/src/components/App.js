import React, {Component} from 'react';

import {connect} from "react-redux";
import Vote from "./Vote";
import {loadFilm, setMark,  markAsAnswered, markAsSkipped} from "../actions/VoteActions";


class App extends Component {
    render() {
        const nextBtnClick = () => {this.props.dispatch(markAsAnswered()); this.props.dispatch(loadFilm())};
        const changeMark = (value) => {this.props.dispatch(setMark(value))};
        const skipBtnClick = () => {this.props.dispatch(markAsSkipped()); this.props.dispatch(loadFilm())};
        return (
            <Vote changeMark={changeMark} mark={this.props.mark} currentFilm={this.props.currentFilm} skipBtnClick={skipBtnClick} nextBtnClick={nextBtnClick} totalInfo={this.props.totalInfo}/>
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state.vote
    }
}

export default connect(
    mapStateToProps,
    // mapDispatchToProps
)(App);
