import ApplicationBar, { ApplicationBarTitle } from '../../components/application-bar.jsx';

import DivisionsRoot from '../../views/divisions-root.jsx';

export default function Divisions() {
	return (
		<div className="grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)]">
			<ApplicationBar>
				<ApplicationBarTitle>Divisions</ApplicationBarTitle>
			</ApplicationBar>
			<DivisionsRoot />
		</div>
	);
}
