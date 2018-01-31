import React from 'react';
import Rating from 'react-rating';
import NumVotes from "./NumVotes";

const Vote = ({skipBtnClick, nextBtnClick, currentFilm, mark, changeMark, totalInfo}) => {
    const btnClass = 'button' + (mark ? '' : ' disabled');
    return (
        <div className="section section_intro block">
            <div className="block-wrapper">
                <div className="section__wrapper section__wrapper_align_center">
                    <div className="filmsIntro">
                        <div className="filmsIntro__wrapper">
                            <div className="filmsIntro__side">
                                <div className="filmsIntro__poster"
                                     style={{backgroundImage: "url('" + currentFilm.image + "')"}}>
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
                                            <NumVotes current={totalInfo.current} total={totalInfo.total}/>
                                        </div>
                                    </div>
                                    <div className="filmsIntro__desc">
                                        {currentFilm.desc}
                                    </div>
                                    <div className="filmsIntro__rating">
                                        <Rating
                                            onChange={changeMark}
                                            initialRating={mark}
                                            emptySymbol={<div className="rating__item"/>}
                                            fullSymbol={<div className="rating__item rating__item_active"/>}
                                        />
                                    </div>
                                    <div className="filmsIntro__action">
                                        <div className="filmsIntro__action-item">
                                            <button className={btnClass} onClick={ () => nextBtnClick()}>
                                                <span className="button__title">Следуюший</span>
                                                <span className="button__ok"/>
                                            </button>

                                            <button className="button" onClick={ () => skipBtnClick()}>
                                                <span className="button__title">Пропустить</span>
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
