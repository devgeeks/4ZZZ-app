import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Router, Route } from 'react-router';
import { hashHistory } from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import PlayView from './containers/PlayView';

import './index.css';

const App = React.createClass({
	render() {

		const key = this.props.location.pathname;

		return (
			<div className="app">
				<CSSTransitionGroup
						transitionEnterTimeout={ 250 }
						transitionLeaveTimeout={ 250 }
						transitionName="routetransition">
					{ React.cloneElement(this.props.children || <div />, { key: key }) }
				</CSSTransitionGroup>
			</div>
		);
	},
});

ReactDOM.render((
	<Router history={ hashHistory }>
		<Route component={ App }>
			<Route path="play" component={ PlayView } />
			<Redirect from="/" to="/play" />
		</Route>
	</Router>
), document.getElementById('app'));
