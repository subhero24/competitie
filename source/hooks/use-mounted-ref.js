import { useRef, useLayoutEffect } from 'react';

// Needs to use a ref because unmount needs to update its value in useEffect hooks on the same render cycle

export default function useMountedRef() {
	let mounted = useRef(false);

	useLayoutEffect(() => {
		mounted.current = true;

		return () => {
			mounted.current = false;
		};
	}, []);

	return mounted;
}
