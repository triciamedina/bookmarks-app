import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link } from 'react-router-dom';
import BookmarkItem from './BookmarkItem';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <BookmarkItem url="http://www.test.com"/>
    </BrowserRouter>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});
