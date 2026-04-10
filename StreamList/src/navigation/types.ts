import type { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  HomeMain: undefined;
  Detail: { movieId: string };
  SeeAll: {
    title: string;
    listType: 'trending' | 'top_rated' | 'discover' | 'similar';
    genreId?: string;
    /** Required when `listType` is `similar`. */
    movieId?: string;
  };
};

export type SearchStackParamList = {
  SearchMain: undefined;
  Detail: { movieId: string };
};

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  WatchlistTab: undefined;
  ProfileTab: undefined;
};
