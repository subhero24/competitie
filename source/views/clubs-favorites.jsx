import { useState } from 'react';

import useLocalStorageState from '../hooks/use-local-storage-state.js';
import ClubsList from './clubs-list.jsx';

export default function ClubsFavorites() {
	let [favoriteClubs] = useLocalStorageState('favoritedClubs', []);
	let [clubs] = useState(favoriteClubs);

	if (clubs.length === 0) {
		return <div className="grid w-full h-full items-x-center items-y-center">No favorite clubs found</div>;
	} else {
		return <ClubsList clubs={clubs} />;
	}
}
