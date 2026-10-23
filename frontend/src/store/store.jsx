import { create } from 'zustand';
import { createDeckSlice } from './deckSlice';
import { createDungeonSlice } from './dungeonSlice';
import { createAccountSlice } from './accountSlice';

export const useUserData = create((...args) => ({
    ...createDeckSlice(...args),
    ...createDungeonSlice(...args),
    ...createAccountSlice(...args)
}));