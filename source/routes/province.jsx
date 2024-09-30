import { useRef, useState, useMemo } from 'react';
import { useData, useParams, useSearch, useHistory } from 'react-sprout';
import { getClubs } from 'vttl-api';

import Suspense from '../views/suspense.jsx';
import BackButton from '../components/back-button.jsx';
import ApplicationBar, { ApplicationBarTitle } from '../components/application-bar.jsx';

import { provincesByUrl } from '../vttl/provinces.js';

import useDerivedState from '../hooks/use-derived-state.js';
import SearchInput from '../views/search-input.jsx';
import ClubsList from '../views/clubs-list.jsx';

export async function fetchProvinceClubs(params) {
	let province = provincesByUrl[params.provinceUrl];
	if (province) {
		return await getClubs({ ClubCategory: province.id });
	}
}

export default function Province() {
	let params = useParams();
	let search = useSearch();
	let mainRef = useRef();
	let history = useHistory();
	let province = provincesByUrl[params.provinceUrl];

	let [searchValue, setSearchValue] = useDerivedState(search.search ?? '');
	let [filterValue, setFilterValue] = useState(searchValue);

	function handleSearchInputChange(event, value) {
		if (value === '') {
			setFilterValue(value);
			history.replaceState(null, null, 'clubs');
		}

		setSearchValue(value);
	}

	function handleSearchFormSubmit(event) {
		event.preventDefault();

		if (searchValue !== '') {
			setFilterValue(searchValue);
			mainRef.current.focus();
			window.history.replaceState(null, null, `clubs?search=${encodeURIComponent(searchValue)}`);
		}
	}

	return (
		<div className="grid grid-cols-[100%] grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<div className="grid gap-4">
					<div className="flex gap-4">
						<BackButton />
						<ApplicationBarTitle>{province?.name}</ApplicationBarTitle>
					</div>

					<form className="grid" onSubmit={handleSearchFormSubmit}>
						<SearchInput value={searchValue} onChange={handleSearchInputChange} />
					</form>
				</div>
			</ApplicationBar>

			<div ref={mainRef} className="overflow-y-auto focus:outline-none" tabIndex={-1}>
				<Suspense>
					<ClubList filter={filterValue} />
				</Suspense>
			</div>
		</div>
	);
}

function ClubList(props) {
	let { filter } = props;

	let clubs = useData();
	let filteredClubs = useMemo(() => {
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
