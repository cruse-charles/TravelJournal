import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import { persistReducer, persistStore, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// new
const errorTransform = createTransform(
    (inboundState, key) => {
        const {error, ...rest} = inboundState
        return rest
    },
    (outboundState, key) => {
        return outboundState
    },
    {whitelist: ['user']}
)
// new

const rootReducer = combineReducers({user: userReducer})

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    //new
    transforms: [errorTransform]
    //new
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})

export const persistor = persistStore(store)