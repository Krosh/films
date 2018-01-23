import React, {Component} from 'react';
import Rating from 'react-rating';

let Vote = ({nextBtnClick, currentFilm}) => {
    return (
        <div className="section section_intro block">
            <div className="block-wrapper">
                <div className="section__wrapper section__wrapper_align_center">
                    <div className="filmsIntro">
                        <div className="filmsIntro__wrapper">
                            <div className="filmsIntro__side">
                                <div className="filmsIntro__poster"
                                     style={{backgroundImage: "url('" + currentFilm.poster + "')"}}>
                                </div>
                            </div>
                            <div className="filmsIntro__main">
                                <div className="filmsIntro__main-wrapper">
                                    <div className="filmsIntro__header">
                                        <div className="filmsIntro__header-wrapper">
                                            <div className="filmsIntro__header-main">
                                                <div className="filmsIntro__title">
                                                    {currentFilm.name}
                                                </div>
                                            </div>
                                            <div className="filmsIntro__header-side">
                                                <div className="filmsIntro__count">1/5</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="filmsIntro__desc">
                                        {currentFilm.desc}
                                    </div>
                                    <div className="filmsIntro__rating">
                                        <Rating
                                            emptySymbol={<div className="rating__item"/>}
                                            fullSymbol={<div className="rating__item rating__item_active"/>}
                                        />
                                    </div>
                                    <div className="filmsIntro__action">
                                        <div className="filmsIntro__action-item">
                                            <button className="button" onClick={ () => nextBtnClick()}>
                                                <span className="button__title">Следуюший</span>
                                                <span className="button__ok"></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vote;
