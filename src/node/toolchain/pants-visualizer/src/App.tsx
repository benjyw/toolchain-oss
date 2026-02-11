/*
Copyright 2022 Toolchain Labs, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0 (see LICENSE).
*/

import Results from './components/Results';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme';
import nodeReducer from './store/nodeSlice';
import visibleGraphReducer from './store/visibleGraphSlice';
import hierarchicalDigraphReducer from './store/hierarchicalDigraphSlice';
import graphZoomReducer from './store/graphZoomSlice';
import globalTypesReducer from './store/globalTypesSlice';

const store = configureStore({
  reducer: {
    node: nodeReducer,
    visibleGraph: visibleGraphReducer,
    hierarchicalDigraph: hierarchicalDigraphReducer,
    graphZoom: graphZoomReducer,
    globalTypes: globalTypesReducer,
  },
  devTools: true,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CssBaseline />
        <Results />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
