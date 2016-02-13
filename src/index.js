import React from 'react';
import ReactDOM from 'react-dom';

import PlayView from './containers/PlayView';

import './index.css';

const App = React.createClass({
	render() {
		return (
			<div>
				<PlayView />
			</div>
		);
	},
});

ReactDOM.render(<App />, document.getElementById('app'));
