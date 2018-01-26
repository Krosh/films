import React, {Component} from 'react';

import {connect} from "react-redux";
import Vote from "./Vote";
import {loadFilm, setMark} from "../actions/VoteActions";


class App extends Component {
    render() {
        return (
            <Vote changeMark={(value) => {this.props.dispatch(setMark(value))}} mark={this.props.mark} currentFilm={this.props.currentFilm} nextBtnClick={() => {this.props.dispatch(loadFilm())}} totalInfo={this.props.totalInfo}/>
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
