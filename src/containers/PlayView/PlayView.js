import React from 'react';

import PlayButton from '../../components/PlayButton';

export default React.createClass({

	displayName: 'PlayView',

	render: function() {
		return (
			<div className='page-view'>
				<PlayButton />
			</div>
		);
	}
});
