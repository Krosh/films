import React, {Component} from 'react';

import {connect} from "react-redux";
import Vote from "./Vote";
import {loadFilm, setMark} from "../actions/VoteActions";
import {markAsAnswered, markAsSkipped} from "../actions/TotalInfoActions";


class App extends Component {
    render() {
        const nextBtnClick = () => {this.props.dispatch(markAsAnswered(this.props.currentFilm._id, this.props.mark)); this.props.dispatch(loadFilm())};
        const changeMark = (value) => {this.props.dispatch(setMark(value))};
        const skipBtnClick = () => {this.props.dispatch(markAsSkipped(this.props.currentFilm._id)); this.props.dispatch(loadFilm())};
        return (
            <Vote changeMark={changeMark} mark={this.props.mark} currentFilm={this.props.currentFilm} skipBtnClick={skipBtnClick} nextBtnClick={nextBtnClick} totalInfo={this.props.totalInfo}/>
        );
    }
}

const mapStateToProps = state => {
    console.log(state);
    return {
        ...state.vote,
        totalInfo: state.totalInfo,
    }
}

export default connect(
    mapStateToProps,
    // mapDispatchToProps
)(App);
