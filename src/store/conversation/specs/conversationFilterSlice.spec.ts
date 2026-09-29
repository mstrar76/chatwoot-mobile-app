import conversationFilterReducer, {
  setFilters,
  resetFilters,
  clearFilters,
  selectFilters,
  defaultFilterState,
} from '../conversationFilterSlice';
import { RootState } from '@/store';

describe('conversationFilter reducer', () => {
  it('should return initial state', () => {
    expect(conversationFilterReducer(undefined, { type: '' })).toEqual({
      filters: defaultFilterState,
    });
  });

  describe('setFilters', () => {
    it('should update filter value for given key', () => {
      const initialState = {
        filters: defaultFilterState,
      };

      const nextState = conversationFilterReducer(
        initialState,
        setFilters({ key: 'status', value: 'resolved' }),
      );

      expect(nextState.filters.status).toBe('resolved');
      expect(nextState.filters.assignee_type).toBe(defaultFilterState.assignee_type);
      expect(nextState.filters.sort_by).toBe(defaultFilterState.sort_by);
      expect(nextState.filters.inbox_id).toBe(defaultFilterState.inbox_id);
    });
  });

  describe('resetFilters', () => {
    it('should reset filters to default state', () => {
      const modifiedState = {
        filters: {
          ...defaultFilterState,
          status: 'resolved',
          assignee_type: 'all',
        },
      };

      const nextState = conversationFilterReducer(modifiedState, resetFilters());

      expect(nextState.filters).toEqual(defaultFilterState);
    });
  });

  describe('remembered choice', () => {
    it('defaults to all assignees', () => {
      expect(defaultFilterState.assignee_type).toBe('all');
    });

    it('restores the last chosen filters on reset, except the inbox', () => {
      let state = conversationFilterReducer(undefined, { type: '' });
      state = conversationFilterReducer(state, setFilters({ key: 'assignee_type', value: 'me' }));
      state = conversationFilterReducer(state, setFilters({ key: 'status', value: 'all' }));
      state = conversationFilterReducer(state, setFilters({ key: 'inbox_id', value: '7' }));

      const reset = conversationFilterReducer(state, resetFilters());

      expect(reset.filters).toEqual({
        ...defaultFilterState,
        assignee_type: 'me',
        status: 'all',
      });
    });

    it('clearFilters forgets the remembered choice', () => {
      let state = conversationFilterReducer(undefined, { type: '' });
      state = conversationFilterReducer(state, setFilters({ key: 'assignee_type', value: 'me' }));
      state = conversationFilterReducer(state, clearFilters());
      state = conversationFilterReducer(state, resetFilters());

      expect(state.filters).toEqual(defaultFilterState);
    });
  });

  describe('selectFilters', () => {
    it('should return filters from state', () => {
      const mockState = {
        conversationFilter: {
          filters: defaultFilterState,
        },
      } as RootState;

      expect(selectFilters(mockState)).toEqual(defaultFilterState);
    });
  });
});
