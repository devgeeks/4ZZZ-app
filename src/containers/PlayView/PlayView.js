import React from 'react';

import PlayButton from '../../components/PlayButton';
import StopButton from '../../components/StopButton';

export default React.createClass({

	displayName: 'PlayView',

	render: function() {
		return (
			<div className='page-view'>
				<PlayButton />
				<StopButton />
			</div>
		);
	}
});
