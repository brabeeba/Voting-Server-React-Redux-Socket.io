import {expect} from 'chai';
import {List, Map, fromJS} from 'immutable';

import reducer from '../src/reducer';

describe('reducer', () => {
	it ('should handle set entries', () => {
		const state = Map();
		const action = {type: 'SET_ENTRIES', entries: ["1", "2"]};
		const nextState = reducer(state, action);

		expect(nextState).to.equal(fromJS({entries: ["1", "2"]}));

	});

	it ('should handle next', () => {
		const state = fromJS({entries: ["1", "2"]});
		const action = {type: 'NEXT'};
		const nextState = reducer(state, action);

		expect(nextState).to.equal(fromJS({
			votes: {
				pairs: ["1", "2"]
			},
			entries: []
		}));
	});

	it ('should handle vote', () => {
		const state = fromJS({
			votes: {
				pairs: ["1", "2"]
			},
			entries: []
		});

		const action = {type: 'VOTE', entry: "1"};
		const nextState = reducer(state, action);

		expect(nextState).to.equal(fromJS({
			votes: {
				pairs: ["1", "2"],
				tally: {
					"1": 1
				}
			},
			entries: []
		}));
	});

	it ('has initial state', () => {
		const action = {type: 'SET_ENTRIES', entries: ["1", "2"]};
		const nextState = reducer(undefined, action);

		expect(nextState).to.equal(fromJS({entries: ["1", "2"]}));
	});
});