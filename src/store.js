import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import themeReducer from "./reducers/themeSlice";
import globalDataReducer from "./reducers/globalDataSlice";

const store = configureStore({
    reducer: {
        user: authReducer,
        theme: themeReducer,
        globalData: globalDataReducer,
    }
})


export default store;