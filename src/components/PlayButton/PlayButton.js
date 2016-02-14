import React from 'react';
import classNames from 'classnames';
import Tappable from 'react-tappable';
import MdPlayArrow from 'react-icons/lib/md/play-arrow';

import './playbutton.css';

export default React.createClass({

	displayName: 'PlayButton',

	render() {

		const cx = classNames({
			'play-button': true,
		});

		return (
				<div>
					<Tappable className={ cx } component="a" classBase="tappable">
						<MdPlayArrow size="48" />
					</Tappable>
				</div>
		);
	},
});
