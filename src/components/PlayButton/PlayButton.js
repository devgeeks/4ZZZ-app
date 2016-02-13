import React from 'react';
import classNames from 'classnames';
import Tappable from 'react-tappable';

import './playbutton.css';

export default React.createClass({

	displayName: 'PlayButton',

	render() {

		const cx = classNames({
			'play-button': true,
		});

		return (
				<div>
					<Tappable className={ cx } href="#">
						<div className='arrow-right' />
					</Tappable>
				</div>
		);
	},
});
