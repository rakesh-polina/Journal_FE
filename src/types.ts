// types.ts
export type RootStackParamList = {
    Home: { toggleSearchBar?: () => void; email?: string };
    CreateEvent: { toggleSearchBar?: () => void; email?: string };
    Profile: undefined;
  };