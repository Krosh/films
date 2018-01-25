import React, {Component} from 'react';

import {connect} from "react-redux";
import Vote from "./Vote";
import {loadFilm} from "../actions/VoteActions";


class App extends Component {
    render() {
        console.log(this.props);
        return (
            <Vote currentFilm={this.props.currentFilm} nextBtnClick={() => {this.props.dispatch(loadFilm())}}/>
        );
    }
}

const mapStateToProps = state => {
    console.log(state);
    return {
        ...state.vote
    }
}

export default connect(
    mapStateToProps,
    // mapDispatchToProps
)(App);
