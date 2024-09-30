import { useNavigate, useSearch } from 'react-sprout';

import ApplicationBar, { ApplicationBarTitle } from '../components/application-bar';
import Tabs, { Tab } from '../components/tabs';
import useLocalStorageState from '../hooks/use-local-storage-state';
import { ExtensionIcon, PeopleIcon, SensorDoorIcon } from 'material-icons';
import DivisionsFavorites from '../views/divisions-favorites';
import PlayersFavorites from '../views/players-favorites';
import ClubsFavorites from '../views/clubs-favorites';

export default function Favorites() {
	let search = useSearch();
	let navigate = useNavigate();

	let [tab, setTab] = useLocalStorageState('defaultFavoritesTab', search.tab ?? 'clubs');

	function handleTabChange(event, tab) {
		setTab(tab);
		navigate(`?tab=${tab}`, { replace: true });
	}

	let render;
	if (tab === 'clubs') {
		render = <ClubsFavorites />;
	} else if (tab === 'players') {
		render = <PlayersFavorites />;
	} else if (tab === 'divisions') {
		render = <DivisionsFavorites />;
	}

	return (
		<div className="grid grid-cols-[100%] grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<div className="grid gap-4">
					<div className="flex gap-4">
						<ApplicationBarTitle>Favorites</ApplicationBarTitle>
					</div>
					<div className="-mx-4 -mb-4">
						<Tabs value={tab} onChange={handleTabChange}>
							<Tab icon={SensorDoorIcon} label="clubs" />
							<Tab icon={PeopleIcon} label="players" />
							<Tab icon={ExtensionIcon} label="divisions" />
						</Tabs>
					</div>
				</div>
			</ApplicationBar>

			{render}
		</div>
	);
}
