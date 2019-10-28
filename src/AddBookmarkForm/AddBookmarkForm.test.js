import React from 'react';
import ReactDOM from 'react-dom';
import AddBookmarkForm from './AddBookmarkForm';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddBookmarkForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});
