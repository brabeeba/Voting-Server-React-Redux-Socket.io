import {expect} from 'chai';
import {List, Map, fromJS} from 'immutable';

import makeStore from '../src/store';

describe('store', () => {
	it ('is a redux store with correct reducer configured', () => {
		const store = makeStore();
		expect(store.getState()).to.equal(Map());

		store.dispatch({
			type: 'SET_ENTRIES',
			entries: ["1"]
		});

		expect(store.getState()).to.equal(fromJS({
			entries: ["1"]
		}));
	});
});