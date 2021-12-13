import React from 'react';
import { useRef, useMemo, useContext, forwardRef, createContext } from 'react';
import { motion } from 'framer-motion';

import Ripples from './ripples.jsx';

import classnames from '../utilities/string/classnames.js';

import useValue from '../hooks/use-value';

let TabsContext = createContext({ value: undefined, onChange: undefined });

export default function Tabs(props) {
	let { children } = props;

	let indicatorRef = useRef();
	let [value, onChange] = useValue(props);

	let tabsContextValue = useMemo(() => {
		return { indicatorRef, value, onChange };
	}, [value, onChange]);

	return (
		<div className="grid overflow-auto items-x-center no-scrollbar">
			<div className="grid grid-flow-col auto-cols-[minmax(max-content,16rem)]">
				<TabsContext.Provider value={tabsContextValue}>{children}</TabsContext.Provider>
			</div>
		</div>
	);
}

let TabIndicator = forwardRef(function TabIndicator(props, ref) {
	let { initial } = props;

	return (
		<motion.div
			ref={ref}
			className="absolute bottom-0 w-full h-0.5 bg-zinc-800"
			initial={initial}
			animate={{ left: 0, width: '100%' }}
		/>
	);
});

export function Tab(props) {
	let { icon: Icon, label, value = label, onClick, children } = props;

	let ref = useRef();
	let tabsContextValue = useContext(TabsContext);
	let tabSelected = value === tabsContextValue.value;

	function handleClick(event) {
		onClick?.(event);
		tabsContextValue.onChange?.(event, value);
	}

	let iconRender;
	if (Icon) {
		iconRender = (
			<div className="grid w-6 h-6">
				<Icon />
			</div>
		);
	}

	let labelRender;
	if (label != undefined) {
		labelRender = <span className="text-sm font-semibold uppercase">{label}</span>;
	}

	let indicatorRender;
	if (tabSelected) {
		let initial;
		let indicatorRef = tabsContextValue.indicatorRef;
		if (indicatorRef.current != undefined) {
			let tabRect = ref.current.getBoundingClientRect();
			let indicatorRect = indicatorRef.current.getBoundingClientRect();
			let indicatorCenter = indicatorRect.x + indicatorRect.width / 2;

			if (tabRect.width !== 0) {
				let width = `${(indicatorRect.width / tabRect.width) * 100}%`;
				let left = `calc(${((indicatorCenter - tabRect.x) / tabRect.width) * 100}% - ${width} / 2)`;

				initial = { width, left };
			}
		}

		indicatorRender = <TabIndicator ref={indicatorRef} initial={initial} />;
	}

	let tabClassName = classnames('flex flex-col items-center gap-1 p-4', tabSelected ? 'opacity-100' : 'opacity-50');

	return (
		<button
			ref={ref}
			className="relative flex-auto max-w-[16rem] focus:outline-none focus-visible:bg-black/10 focus-visible:rounded-t"
			onClick={handleClick}
		>
			<div className={tabClassName}>
				{iconRender}
				{labelRender}
				{children}
			</div>

			{indicatorRender}

			<div className="absolute inset-0 overflow-hidden">
				<Ripples />
			</div>
		</button>
	);
}

export { TabsContext, TabIndicator };
