import { useHistory, usePending } from 'react-sprout';
import useLocalStorageState from '../hooks/use-local-storage-state';
import { useState } from 'react';
import List, { Listitem, ListitemSpinner, ListitemSubtext, ListitemText } from '../components/list';
import FavoriteIcon from '../components/favorite-icon';

export default function ClubsList(props) {
	let { clubs } = props;
	let [favoriteClubs, setFavoriteClubs] = useLocalStorageState('favoritedClubs', []);

	let pending = usePending();
	let history = useHistory();
	let [selectedClub, setSelectedClub] = useState();

	if (clubs != undefined && clubs.length === 0) {
		return (
			<div className="grid w-full h-full items-x-center items-y-center grid-cols-1 grid-rows-[1fr]">
				No clubs found
			</div>
		);
	} else if (clubs != undefined && clubs.length > 0) {
		let listitemsRender = clubs.map(function (club) {
			function handleClick() {
				setSelectedClub(club);
				history.navigate(`/clubs/${club.id}`, { sticky: true });
			}

			function handleFavoriteChange(event, favorite) {
				if (favorite) {
					setFavoriteClubs([...favoriteClubs, club]);
				} else {
					setFavoriteClubs(favoriteClubs.filter(c => c.id != club.id));
				}
			}

			function handleFavoriteIconClick(event) {
				event.stopPropagation();
			}

			let favorite = favoriteClubs.some(c => c.id == club.id);

			let listitemDecorationRender;
			if (pending && club === selectedClub) {
				listitemDecorationRender = <ListitemSpinner />;
			} else {
				listitemDecorationRender = (
					<FavoriteIcon
						defaultValue={favorite}
						onChange={handleFavoriteChange}
						onClick={handleFavoriteIconClick}
					/>
				);
			}
			return (
				<Listitem key={club.id} role="link" onClick={handleClick}>
					<div className="grid gap-4 grid-cols-[minmax(0,1fr),auto] items-y-center">
						<div>
							<ListitemText>{club.longname}</ListitemText>
							<ListitemSubtext>{club.id}</ListitemSubtext>
						</div>
						{listitemDecorationRender}
					</div>
				</Listitem>
			);
		});

		return <List>{listitemsRender}</List>;
	}
}
