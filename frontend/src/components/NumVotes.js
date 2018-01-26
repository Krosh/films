import React, {Component} from 'react';
import Rating from 'react-rating';

const NumVotes = ({current, total}) => {
    return (
        <div className="filmsIntro__header-side">
            <div className="filmsIntro__count">{current}/{total}</div>
        </div>
    );
};

export default NumVotes;
