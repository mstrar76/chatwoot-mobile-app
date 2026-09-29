// Conversation Filter Slice is used to manage the filters for the conversations screen

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConversationFilterOptions } from '@/types';
import { RootState } from '@/store';

export type FilterState = Record<ConversationFilterOptions, string>;

export const defaultFilterState: FilterState = {
  // Default to every conversation so nothing assigned to others is hidden by surprise.
  assignee_type: 'all',
  status: 'open',
  sort_by: 'latest',
  inbox_id: '0',
};

// Filters remembered as the user's choice; they survive account and installation switches.
// inbox_id is account-specific, so it is never remembered.
type RememberedFilters = Partial<Omit<FilterState, 'inbox_id'>>;

interface ConversationFilterState {
  filters: FilterState;
  remembered?: RememberedFilters;
}

const initialState: ConversationFilterState = {
  filters: defaultFilterState,
};

const conversationFilterSlice = createSlice({
  name: 'conversationFilter',
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<{ key: ConversationFilterOptions; value: string }>,
    ) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      if (key !== 'inbox_id') {
        state.remembered = { ...state.remembered, [key]: value };
      }
    },
    // Back to the remembered choice (used on account switch).
    resetFilters: state => {
      state.filters = { ...defaultFilterState, ...state.remembered };
    },
    // Back to the app defaults, forgetting the remembered choice.
    clearFilters: state => {
      state.filters = defaultFilterState;
      state.remembered = undefined;
    },
  },
});

export const { setFilters, resetFilters, clearFilters } = conversationFilterSlice.actions;

export const selectFilters = (state: RootState) => state.conversationFilter.filters;

export default conversationFilterSlice.reducer;
