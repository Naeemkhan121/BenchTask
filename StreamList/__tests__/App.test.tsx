/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View: RNView } = require('react-native');
  return {
    GestureHandlerRootView: ({ children }: { children: React.ReactNode }) =>
      React.createElement(RNView, {}, children),
  };
});

jest.mock('../src/navigation/RootNavigator', () => ({
  RootNavigator: function MockRootNavigator(): React.ReactElement {
    const React = require('react');
    const { View: RNView } = require('react-native');
    return React.createElement(RNView, { testID: 'root-navigator' });
  },
}));

jest.mock('react-native-toast-message', () => {
  const React = require('react');
  const { View: RNView } = require('react-native');
  function MockToast(): React.ReactElement {
    return React.createElement(RNView, { testID: 'toast-root' });
  }
  MockToast.show = jest.fn();
  MockToast.hide = jest.fn();
  return {
    __esModule: true,
    default: MockToast,
    BaseToast: RNView,
  };
});

import App from '../App';

test('renders without throwing', () => {
  ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
