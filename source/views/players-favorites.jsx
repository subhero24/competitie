import { useState } from 'react';
import { useNavigate, usePending } from 'react-sprout';

import useLocalStorageState from '../hooks/use-local-storage-state.js';
import { PlayersList } from '../routes/players.jsx';

export default function PlayersFavorites() {
	let pending = usePending();
	let navigate = useNavigate();

	let [selected, setSelected] = useState();
	let [favoritePlayers, setFavoritePlayers] = useLocalStorageState('favoritedPlayers', []);
	let [players] = useState(favoritePlayers);

	if (players.length === 0) {
		return <div className="grid w-full h-full items-x-center items-y-center">No favorite players found</div>;
	} else {
		function handleFavoriteChange(event, player, favorite) {
			let { id } = player;

			if (favorite) {
				setFavoritePlayers([...favoritePlayers, player]);
			} else {
				setFavoritePlayers(favoritePlayers.filter(player => player.id != id));
			}
		}

		function handleSelect(event, player) {
			setSelected(player);
			navigate(`/players/${player.id}`, { sticky: true });
		}

		return (
			<PlayersList
				players={players}
				favorites={favoritePlayers}
				pending={pending}
				selected={selected}
				onFavoriteChange={handleFavoriteChange}
				onSelect={handleSelect}
			/>
		);
	}
}
