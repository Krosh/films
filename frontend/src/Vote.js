import React, {Component} from 'react';

class Vote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFilm: {
                name: 'Фильм',
                desc: 'Описание',
                poster: 'images/temp/poster.jpg',
            },
        };

        this.nextBtnClick = this.nextBtnClick.bind(this);
        this.loadData();
    }

    loadData() {
        const url = 'http://localhost:8000/film/';
        fetch(url, {
                mode: 'cors',
            })
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    currentFilm: {
                        name: data.name,
                        desc: 'Бля не спарсили',
                        poster: data.image,
                    }
                });
            });
    }

    nextBtnClick() {
        this.loadData();
    }

    render() {
        return (
            <div className="section section_intro block">
                <div className="block-wrapper">
                    <div className="section__wrapper section__wrapper_align_center">
                        <div className="filmsIntro">
                            <div className="filmsIntro__wrapper">
                                <div className="filmsIntro__side">
                                    <div className="filmsIntro__poster"
                                         style={{backgroundImage: "url('" + this.state.currentFilm.poster + "')"}}>
                                    </div>
                                </div>
                                <div className="filmsIntro__main">
                                    <div className="filmsIntro__main-wrapper">
                                        <div className="filmsIntro__header">
                                            <div className="filmsIntro__header-wrapper">
                                                <div className="filmsIntro__header-main">
                                                    <div className="filmsIntro__title">
                                                        { this.state.currentFilm.name }
                                                    </div>
                                                </div>
                                                <div className="filmsIntro__header-side">
                                                    <div className="filmsIntro__count">1/5</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="filmsIntro__desc">
                                            { this.state.currentFilm.desc }
                                        </div>
                                        <div className="filmsIntro__rating">
{/*
                                            <div js-rating className="rating filmsIntro-rating">
*/}
                                                <div className="rating__list">
                                              {/*      <div js-rating-item className="rating__item rating__item_active"
                                                         data-value="1"></div>
                                                    <div js-rating-item className="rating__item rating__item_active"
                                                         data-value="2"></div>
                                                    <div js-rating-item className="rating__item rating__item_active"
                                                         data-value="3"></div>
                                                    <div js-rating-item className="rating__item rating__item_active"
                                                         data-value="4"></div>
                                                    <div js-rating-item className="rating__item"
                                                         data-value="5"></div>
                                              */}  </div>
{/*
                                                <input type="text" hidden js-rating-input/>
*/}
{/*
                                            </div>
*/}
                                        </div>
                                        <div className="filmsIntro__action">
                                            <div className="filmsIntro__action-item">
                                                <button className="button" onClick={this.nextBtnClick}>
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
    }
}

export default Vote;
