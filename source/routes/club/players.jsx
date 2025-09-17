import { useState } from 'react';
import { useData, useHistory, useSearch, usePending } from 'react-sprout';
import { getMembers, getCategories } from 'vttl-api';

import List, { Listitem, ListitemText, ListitemSubtext, ListitemSpinner } from '../../components/list.jsx';
import Avatar from '../../components/avatar.jsx';
import Suspense from '../../views/suspense';
import CategorySelect from '../../views/category-select.jsx';

import toTitleCase from '../../utilities/string/to-title-case.js';

const filters = {
	men: category => category.shortname === 'ALL' && category.ranking == '1',
	women: category => category.shortname === 'ALL' && category.ranking == '2',
	youth: category => category.shortname === 'YOU' && category.ranking == '1',
	veterans: category => category.shortname === 'VET' && category.ranking == '1',
};

export async function fetchClubPlayers(params, splat, search) {
	let categories = await getCategories();
	let category = search.category ?? 'men';
	let categoryResult = categories.find(filters[category]);

	return await getMembers({ Club: params.clubId, PlayerCategory: categoryResult.id });
}

export default function ClubPlayers() {
	let search = useSearch();
	let history = useHistory();
	let pending = usePending();
	let [selectedPlayer, setSelectedPlayer] = useState();

	let category = search.category ?? 'men';

	function handleCategoryChange(event, value) {
		history.navigate(`?category=${value}`, { replace: true });
	}

	function handlePlayerSelect(event, player) {
		setSelectedPlayer(player);
		history.navigate(`/players/${player.id}/results?category=${category}`, {
			sticky: true,
			state: { club: true },
		});
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[minmax(0,1fr),auto]">
			<Suspense>
				<PlayersList key={category} pending={pending} selected={selectedPlayer} onSelect={handlePlayerSelect} />
			</Suspense>
			<div className="z-20 p-2 bg-zinc-900 bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-outer pb-2-safe">
				<CategorySelect defaultValue={category} onChange={handleCategoryChange} />
			</div>
		</div>
	);
}

function PlayersList(props) {
	let { pending, selected, onSelect } = props;

	let players = useData();
	if (players.length === 0) {
		return <div className="grid items-x-center items-y-center">No players found</div>;
	}

	let playerListitemsRender = players.map(function (player) {
		let { id, firstname, lastname, position, index, ranking, status } = player;

		let playerName = toTitleCase(firstname) + ' ' + toTitleCase(lastname);
		let playerInfo = id + (status === 'D' ? '-D' : '') + ' - index ' + index;

		function handleClick(event) {
			onSelect?.(event, player);
		}

		let listitemDecorationRender;
		if (pending && player === selected) {
			listitemDecorationRender = <ListitemSpinner />;
		} else {
			listitemDecorationRender = <ListitemText>{ranking}</ListitemText>;
		}

		return (
			<Listitem key={id} onClick={handleClick}>
				<div className="grid grid-cols-[auto,minmax(0,1fr),auto] gap-4 items-y-center">
					<Avatar>{position}</Avatar>
					<div className="flex flex-col">
						<ListitemText>{playerName}</ListitemText>
						<ListitemSubtext>{playerInfo}</ListitemSubtext>
					</div>
					{listitemDecorationRender}
				</div>
			</Listitem>
		);
	});

	return <List>{playerListitemsRender}</List>;
}
