import React, { Component } from 'react';
import BookmarksContext from '../BookmarksContext';
import './UpdateBookmarkForm.css';
import ValidationError from '../ValidationError/ValidationError';
import config from '../config';

const Required = () => (
    <span className='UpdateBookmark__required'>*</span>
)

export default class UpdateBookmarkForm extends Component {
    static contextType = BookmarksContext;

    state = {
        bookmarkTitle: {
            value: '',
            touched: false,
        },
        bookmarkUrl: {
            value: '',
            touched: false,
        },
        bookmarkDescription: {
            value: '',
            touched: false,
        },
        bookmarkRating: {
            value: '',
            touched: false,
        },
        error: null,
    };
    handleClickCancel = () => {
        this.props.history.push('/')
    }
    handleTitleChange = (e) => {
        const newTitle = e.target.value;
        this.setState({
            bookmarkTitle: {
                value: newTitle,
                touched: true
            }
        })
    }
    handleUrlChange = (e) => {
        const newUrl = e.target.value;
        this.setState({
            bookmarkUrl: {
                value: newUrl,
                touched: true
            }
        })
    }
    handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        this.setState({
            bookmarkDescription: {
                value: newDescription,
                touched: true
            }
        })
    }
    handleRatingChange = (e) => {
        const newRating = parseFloat(e.target.value);
        this.setState({
            bookmarkRating: {
                value: newRating,
                touched: true
            }
        })
    }
    validateBookmarkTitle() {
        const bookmarkTitle = this.state.bookmarkTitle.value.trim();
        if (bookmarkTitle.length === 0) {
            return 'Bookmark title is required'
        };
    }
    validateBookmarkUrl() {
        const bookmarkUrl = this.state.bookmarkUrl.value.trim();
        if (bookmarkUrl.length === 0) {
            return 'Bookmark URL is required'
        };
    }
    validateBookmarkRating() {
        const bookmarkRating = this.state.bookmarkRating.value;
        if (isNaN(bookmarkRating)) {
            return 'Bookmark rating is required'
        };
        if (parseFloat(bookmarkRating) < 1 || parseFloat(bookmarkRating) > 5) {
            return 'Bookmark rating must be between 1 and 5'
        };
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { bookmarkTitle, bookmarkUrl, bookmarkDescription, bookmarkRating } = this.state;
        const bookmarkId = this.props.match.params.bookmarkId;
        const bookmark = {
            id: parseInt(bookmarkId),
            title: bookmarkTitle.value,
            url: bookmarkUrl.value,
            description: bookmarkDescription.value,
            rating: bookmarkRating.value,
        }
        this.setState({ error: null })
        fetch(config.API_ENDPOINT + `/bookmarks/${bookmarkId}`, {
            method: 'PATCH',
            body: JSON.stringify(bookmark),
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => {
                    throw error
                    })
                }
                this.context.updateBookmark(bookmark);
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({ error })
            })
    }
    componentDidMount() {
        const bookmarkId = this.props.match.params.bookmarkId;
        fetch(config.API_ENDPOINT + `/bookmarks/${bookmarkId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => {
                    throw error
                    })
                }
                return res.json()
            })
            .then(responseData => {
                this.setState({
                    bookmarkTitle: {
                        value: responseData.title,
                        touched: false
                    },
                    bookmarkUrl: {
                        value: responseData.url,
                        touched: false
                    },
                    bookmarkDescription: {
                        value: responseData.description,
                        touched: false
                    },
                    bookmarkRating: {
                        value: responseData.rating,
                        touched: false
                    }
                })
            })
            .catch(error => {
                this.setState({ error })
            })
    }

    render () {
        const { bookmarkTitle, bookmarkUrl, bookmarkDescription, bookmarkRating } = this.state;
        const error = this.state.error
            ? <div className='UpdateBookmark__error'>An error occured: {this.state.error}</div>
            : '';
        return (
            <section className='UpdateBookmark'>
                <h2>Update bookmark</h2>
                <form
                    className='UpdateBookmark__form'
                    onSubmit={this.handleSubmit}
                >
                    <div className='UddBookmark__error' role='alert'>
                        {error && <p>{error.message}</p>}
                    </div>
                    <div>
                        <label htmlFor='title'>
                            Title
                            {' '}
                            <Required />
                        </label>
                        <input
                            type='text'
                            name='title'
                            id='title'
                            placeholder='Great website!'
                            value={bookmarkTitle.value}
                            onChange={this.handleTitleChange}
                            required
                        />
                        {this.state.bookmarkTitle.touched 
                            && (<ValidationError message={this.validateBookmarkTitle()} />) }
                    </div>
                    <div>
                        <label htmlFor='url'>
                            URL
                            {' '}
                            <Required />
                        </label>
                        <input
                            type='url'
                            name='url'
                            id='url'
                            placeholder='https://www.great-website.com/'
                            value={bookmarkUrl.value}
                            onChange={this.handleUrlChange}
                            required
                        />
                        {this.state.bookmarkUrl.touched 
                            && (<ValidationError message={this.validateBookmarkUrl()} />) }
                    </div>
                    <div>
                        <label htmlFor='description'>
                            Description
                        </label>
                        <textarea
                            name='description'
                            id='description'
                            value={bookmarkDescription.value}
                            onChange={this.handleDescriptionChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='rating'>
                            Rating
                            {' '}
                            <Required />
                        </label>
                        <input
                            type='number'
                            name='rating'
                            id='rating'
                            min='1'
                            max='5'
                            value={bookmarkRating.value}
                            onChange={this.handleRatingChange}
                            required
                        />
                        {this.state.bookmarkRating.touched 
                            && (<ValidationError message={this.validateBookmarkRating()} />) }
                    </div>
                    <div className='UpdateBookmark__buttons'>
                        <button type='button' onClick={this.handleClickCancel}>
                            Cancel
                        </button>
                        {' '}
                        <button type='submit'>
                            Save
                        </button>
                    </div>
                </form>
            </section>
        );
    }
}