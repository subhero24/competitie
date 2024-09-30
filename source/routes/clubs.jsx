import { useRef } from 'react';
import { useState, useMemo } from 'react';
import { usePending, useData, useSearch, useResult, useHistory } from 'react-sprout';
import { getClubs } from 'vttl-api';

import Suspense from '../views/suspense.jsx';
import SearchInput from '../views/search-input.jsx';
import SpinnerView from '../views/spinner.jsx';
import ProvinceList from '../views/province-list.jsx';
import ApplicationBar, { ApplicationBarTitle } from '../components/application-bar.jsx';

import useDerivedState from '../hooks/use-derived-state.js';
import useLoadingState from '../hooks/use-loading-state.js';
import ClubsList from '../views/clubs-list.jsx';

export async function fetchClubs(params, splat, search) {
	if (search.search) {
		return getClubs();
	}
}

export default function Clubs() {
	let data = useResult();
	let search = useSearch();
	let pending = usePending();
	let history = useHistory();
	let mainRef = useRef();

	let [clubs, setClubs] = useState();
	let [searchValue, setSearchValue] = useDerivedState(search.search ?? '');
	let [filterValue, setFilterValue] = useState(searchValue);
	let [fetchClubs, fetchingClubs, pendingFetchClubs] = useLoadingState(getClubs);
	let [selectedProvince, setSelectedProvince] = useState();

	function handleSearchInputChange(event, value) {
		setSearchValue(value);

		if (value === '') {
			setFilterValue(value);
			window.history.replaceState(null, null, 'clubs');
		}
	}

	function handleSearchFormSubmit(event) {
		event.preventDefault();
		mainRef.current.focus();

		let normalizedSearchValue = searchValue.trim();
		if (normalizedSearchValue !== '') {
			window.history.replaceState(null, null, `clubs?search=${encodeURIComponent(normalizedSearchValue)}`);
		}

		setFilterValue(normalizedSearchValue);

		if (data == undefined && clubs == undefined) {
			fetchClubs().then(setClubs);
		}
	}

	let render;
	if (filterValue === '' || (fetchingClubs && !pendingFetchClubs)) {
		let handleSelect = function (event, province) {
			setSelectedProvince(province);
			history.navigate(`/provinces/${province.url}/clubs`, { sticky: true });
		};

		render = <ProvinceList pending={pending} selected={selectedProvince} onSelect={handleSelect} />;
	} else if (pendingFetchClubs) {
		render = <SpinnerView />;
	} else {
		render = <ClubList clubs={clubs} filter={filterValue} />;
	}

	return (
		<div className="grid grid-cols-[100%] grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<div className="grid gap-4">
					<div className="flex gap-4">
						<ApplicationBarTitle>Clubs</ApplicationBarTitle>
					</div>
					<form className="grid" onSubmit={handleSearchFormSubmit}>
						<SearchInput value={searchValue} onChange={handleSearchInputChange} />
					</form>
				</div>
			</ApplicationBar>

			<div ref={mainRef} className="overflow-y-auto focus:outline-none" tabIndex={-1}>
				<Suspense>{render}</Suspense>
			</div>
		</div>
	);
}

function ClubList(props) {
	let { clubs: fetchedClubs, filter } = props;
	let data = useData();
	let clubs = data ?? fetchedClubs;

	let filteredClubs = useMemo(() => {
		if (filter === '') return;
		if (clubs == undefined) return;

		let normalizedFilter = filter.toLowerCase();
		return clubs.filter(function (club) {
			let id = club.id.toLowerCase();
			let name = club.name.toLowerCase();
			let longname = club.longname.toLowerCase();
			return (
				id.includes(normalizedFilter) || name.includes(normalizedFilter) || longname.includes(normalizedFilter)
			);
		});
	}, [clubs, filter]);

	return <ClubsList clubs={filteredClubs} />;
}
