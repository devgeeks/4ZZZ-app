import React from 'react';
import classNames from 'classnames';
import FaSpinner from 'react-icons/lib/fa/circle-o-notch';
import Tappable from 'react-tappable';

import './pendingbutton.css';

export default React.createClass({

	displayName: 'PendingButton',

	render() {

		const cx = classNames({
			'pending-button': true,
		});

		return (
			<div>
				<Tappable className={ cx } component="a" classBase="tappable">
					<FaSpinner size="32" />
				</Tappable>
			</div>
		);
	},
});
