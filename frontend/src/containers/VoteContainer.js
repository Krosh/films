import { connect } from 'react-redux'
import {loadFilm} from "../actions/VoteActions";
import Vote from "../components/Vote";

const mapStateToProps = (state, ownProps) => {
    return {currentFilm: 'sdsdds'};
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        nextBtnClick: () => {
            dispatch(loadFilm())
        }
    }
}

const VoteContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Vote)

export default VoteContainer;