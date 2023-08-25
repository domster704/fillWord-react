import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {mainReducer} from "./reducers";

const rootReducer = combineReducers({
    main: mainReducer
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});