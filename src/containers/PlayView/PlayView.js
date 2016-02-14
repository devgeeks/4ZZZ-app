import React from 'react';

import PlaybackPanel from '../../components/PlaybackPanel';
import PlaybackControls from '../../components/PlaybackControls';
import NowPlaying from '../../components/NowPlaying';
import PlayButton from '../../components/PlayButton';
import StopButton from '../../components/StopButton';
import PendingButton from '../../components/PendingButton';

export default React.createClass({

	displayName: 'PlayView',

	getInitialState: function() {
		return {
			isPending: false,
			isPlaying: false,
			nowPlaying: {},
		};
	},

	render: function() {

		const { nowPlaying } = this.props;
		const { isPending, isPlaying } = this.state;

		const button = isPlaying
			? (isPending ? <PendingButton /> : <StopButton />)
			: <PlayButton />;

		return (
			<PlaybackPanel>
				<NowPlaying nowPlaying={ nowPlaying } />
				<PlaybackControls isPlaying={ isPlaying }>
					{ button }
				</PlaybackControls>
			</PlaybackPanel>
		);
	},
});
