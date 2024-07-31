import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import { persistReducer, persistStore, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Create a transform to modify state during persistance
const errorTransform = createTransform(
    // Transform state before being persisted
    (inboundState, key) => {
        const {error, ...rest} = inboundState
        return rest
    },
    // Transform state after being rehydrated
    (outboundState, key) => {
        return outboundState
    },
    // Define which reducers this transform gets applied to
    {whitelist: ['user']}
)

const rootReducer = combineReducers({user: userReducer})

// Key for persisted state in storage, select storage engine to use, version of the persisted state, and transforms to apply
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    transforms: [errorTransform]
}
// Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})

// Export persistor to manage persisted state
export const persistor = persistStore(store)