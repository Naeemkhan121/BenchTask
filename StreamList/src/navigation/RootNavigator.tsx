import type { ReactElement } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DetailScreen } from '../screens/DetailScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SeeAllScreen } from '../screens/SeeAllScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { useWatchlistStore } from '../store/watchlistStore';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { showComingSoonToast } from '../utils/toast';
import type {
  HomeStackParamList,
  RootTabParamList,
  SearchStackParamList,
} from './types';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

type TabIconProps = { color: string; size?: number };

function HomeTabIcon({ color, size }: TabIconProps): ReactElement {
  return (
    <MaterialCommunityIcons
      color={color}
      name="home-variant-outline"
      size={size ?? layout.iconSizeTab}
    />
  );
}

function SearchTabIcon({ color, size }: TabIconProps): ReactElement {
  return (
    <MaterialCommunityIcons
      color={color}
      name="magnify"
      size={size ?? layout.iconSizeTab}
    />
  );
}

function WatchlistTabIcon({ color, size }: TabIconProps): ReactElement {
  return (
    <MaterialCommunityIcons
      color={color}
      name="bookmark-outline"
      size={size ?? layout.iconSizeTab}
    />
  );
}

function ProfileTabIcon({ color, size }: TabIconProps): ReactElement {
  return (
    <MaterialCommunityIcons
      color={color}
      name="account-outline"
      size={size ?? layout.iconSizeTab}
    />
  );
}

function SearchStackNavigator(): ReactElement {
  return (
    <SearchStack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: colors.surface },
      }}
    >
      <SearchStack.Screen
        name="SearchMain"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ headerShown: false }}
      />
    </SearchStack.Navigator>
  );
}

function HomeStackNavigator(): ReactElement {
  return (
    <HomeStack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: colors.surface },
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="SeeAll"
        component={SeeAllScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.icon_on_dark,
          headerTitleStyle: {
            ...typography['title-lg'],
            color: colors.on_surface,
          },
        })}
      />
    </HomeStack.Navigator>
  );
}

function TabBarBackground(): ReactElement {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        blurAmount={28}
        blurType="dark"
        reducedTransparencyFallbackColor={colors.surface}
        style={StyleSheet.absoluteFill}
      />
    );
  }
  return <View style={styles.tabBarBgFallback} />;
}

const TAB_BAR_MIN_HEIGHT = 56;

function tabBarStyleForPlatform(bottomInset: number) {
  const base = {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outline_variant,
    paddingTop: spacing.xs,
    paddingBottom: bottomInset,
    minHeight: TAB_BAR_MIN_HEIGHT + bottomInset,
  };
  if (Platform.OS === 'android') {
    return {
      ...base,
      backgroundColor: colors.surface,
      elevation: 12,
    };
  }
  return {
    ...base,
    backgroundColor: 'transparent' as const,
    elevation: 0,
  };
}

const styles = StyleSheet.create({
  tabBarBgFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
    opacity: 0.94,
  },
});

function MainTabs(): ReactElement {
  const insets = useSafeAreaInsets();
  const watchlistCount = useWatchlistStore((s) => s.items.length);
  const watchlistHydrated = useWatchlistStore((s) => s.hydrated);
  const watchlistBadge =
    watchlistHydrated && watchlistCount > 0
      ? String(watchlistCount)
      : undefined;

  const tabBarBaseStyle = tabBarStyleForPlatform(insets.bottom);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary_container,
        tabBarInactiveTintColor: colors.on_surface_variant,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          ...typography['label-sm'],
          marginBottom: spacing.xs,
        },
        tabBarIconStyle: {
          marginTop: spacing.xs,
        },
        tabBarItemStyle: {
          flex: 1,
          paddingVertical: spacing.xs,
          justifyContent: 'center',
          minWidth: 0,
        },
        tabBarStyle: tabBarBaseStyle,
        tabBarBackground: TabBarBackground,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'HomeMain';
          return {
            title: 'Home',
            tabBarIcon: HomeTabIcon,
            tabBarStyle:
              routeName === 'Detail'
                ? { display: 'none' }
                : tabBarBaseStyle,
          };
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStackNavigator}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'SearchMain';
          return {
            title: 'Search',
            tabBarIcon: SearchTabIcon,
            tabBarStyle:
              routeName === 'Detail'
                ? { display: 'none' }
                : tabBarBaseStyle,
          };
        }}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistScreen}
        options={{
          title: 'Watchlist',
          tabBarIcon: WatchlistTabIcon,
          tabBarBadge: watchlistBadge,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary_container,
            color: colors.on_surface,
          },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            showComingSoonToast();
          },
        }}
        options={{
          title: 'Profile',
          tabBarIcon: ProfileTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator(): ReactElement {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}
