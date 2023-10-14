import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Trip} from 'constants/items';

type Trips = Trip[] | null;

// Define a type for the slice state
interface TripsState {
  trips: Trips;
  tripsLoading: boolean;
}

// Define the initial state using that type
const initialState: TripsState = {
  trips: null,
  tripsLoading: false,
};

export const tripsSlice = createSlice({
  name: 'trips',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setTrips: (state, action: PayloadAction<Trips>) => {
      state.trips = action.payload;
    },
    setTripsLoading: (state, action: PayloadAction<boolean>) => {
      state.tripsLoading = action.payload;
    },
  },
});

export const {setTrips, setTripsLoading} = tripsSlice.actions;

export default tripsSlice.reducer;
