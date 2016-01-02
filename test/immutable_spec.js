import {expect} from 'chai';
import {List, Map, fromJS} from 'immutable';

import {setEntries, next, vote} from '../src/core';

describe('immutability', () => {
	describe('number', () => {
		function increment (state) {
			return state + 1;
		}
		it('is immutable', () => {
			let state = 42;
			let nextState = increment(state);

			expect(nextState).to.equal(43);
			expect(state).to.equal(42);
		});
	});

	describe('list', () => {

		function add (state, word) {
			return state.push(word);
		}

		it('is immutable', () => {
			let state = List.of("1", "2");
			let nextState = add(state, "3");

			expect(nextState).to.equal(List.of("1", "2", "3"));
			expect(state).to.equal(List.of("1", "2"));
		});
	});

	describe('tree', () => {
		function add (state, word) {
			return state.update('number', number => number.push(word));
		}

		it('is immutable', () => {
			let state = Map({number: List.of("1", "2")});
			let nextState = add(state, "3");

			expect(nextState).to.equal(Map({number: List.of("1", "2", "3")}));

			expect(state).to.equal(Map({number: List.of("1", "2")}));
		});
	});

});

describe('application logic', () => {
	describe('setEntries', () => {
		it ('add entries', () => {
			const state = Map();
			const entries = ["1", "2"];
			const nextState = setEntries(state, entries);

			expect(nextState).to.equal(Map({entries: List.of("1", "2")}));
		});
	});

	describe('next', () => {
		it ('should move two vote to pair', () => {
			const state = Map({entries: List.of("1", "2", "3")});
			const nextState = next(state);

			expect(nextState).to.equal(fromJS({vote: {pair: ["1", "2"]}, entries: ["3"]}));
		});

		it ('should put the winner of the current vote back into entries', () => {
			const state = fromJS({
				vote: {
					pair: ["1", "2"],
					tally: {
						"1": 3,
						"2": 4
					}
				},
				entries: ["3", "4", "5"]
			});

			const nextState = next(state);

			expect(nextState).to.equal(fromJS({
				vote: {
					pair: ["3", "4"]
				},
				entries: ["5", "2"]
			}));

		});

		it ('should put the tied vote both back into entries', () => {
			const state = fromJS({
				vote: {
					pair: ["1", "2"],
					tally: {
						"1": 4,
						"2": 4
					}
				},
				entries: ["3", "4", "5"]
			});

			const nextState = next(state);

			expect(nextState).to.equal(fromJS({
				vote: {
					pair: ["3", "4"]
				},
				entries: ["5","1","2"]
			}));
		});

		it ('should show winner when there is one entry left', () => {
			const state = fromJS({
				vote: {
					pair: ["1", "2"],
					tally: {
						"1": 3,
						"2": 4
					}
				},
				entries: []
			});

			const nextState = next(state);

			expect(nextState).to.equal(fromJS({
				winner: "2"
			}));
		});
	});
	
	describe('vote', () => {
		it ('should add tally entry with one tally when there is no tally', () => {
			const state = fromJS({pair: ["1", "2"]});
			const myVote = "1"
			const nextState = vote(state, myVote)

			expect(nextState).to.equal(fromJS({
			
					pair: ["1", "2"],
					tally: {"1": 1}
				
			}));
		});

		it ('should increment tally when there is already some tally', () => {
			const state = fromJS({
		
					pair: ["1", "2"],
					tally: {"1": 2, "2": 3}
				
			});

			const myVote = "1";
			const nextState = vote(state, myVote);

			expect(nextState).to.equal(fromJS({
			
					pair: ["1", "2"],
					tally: {"1": 3, "2": 3}
				
			}));
		});
	});

});

