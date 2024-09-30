import ReactDom from 'react-dom/client';

import Application from './application.jsx';

import { Suspense } from 'react';

function Root() {
	return (
		<Suspense fallback={null}>
			<Application />
		</Suspense>
	);
}

ReactDom.createRoot(document.getElementById('root')).render(<Root />);
