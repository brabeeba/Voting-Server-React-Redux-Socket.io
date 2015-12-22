import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
	return state.set("entries", List(entries));
}

function getWinners(votes) {
	if (!votes) return [];
	const [a, b] = votes.get('pairs');
	const aVote = votes.getIn(['tally', a], 0);
	const bVote = votes.getIn(['tally', b], 0);
	if (aVote > bVote) return [a];
	if (bVote > aVote) return [b];
	if (aVote == bVote) return [a, b];
	

}

export function next(state) {
	const entries = state.get('entries').concat(getWinners(state.get('votes')));

	if (entries.size === 1) {
		return state.remove('votes').remove('entries').set('winner', entries.first());
	} else {
		return state.merge({votes: Map({pairs: entries.take(2)}), entries: entries.skip(2)});
	}

	
}

export function vote(state, myVote) {
	return state.updateIn(['tally', myVote], 0, val => val + 1)
}