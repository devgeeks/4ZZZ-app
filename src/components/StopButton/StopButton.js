import React from 'react';
import classNames from 'classnames';
import Tappable from 'react-tappable';
import MdStop from 'react-icons/lib/md/stop';

import './stopbutton.css';

export default React.createClass({

	displayName: 'StopButton',

	render() {

		const cx = classNames({
			'stop-button': true,
		});

		return (
			<div>
				<Tappable className={ cx } component='a' classBase='tappable'>
					<MdStop size="48" />
				</Tappable>
			</div>
		);
	},
});
