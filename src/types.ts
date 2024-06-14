// types.ts
export type RootStackParamList = {
    Home: { toggleSearchBar?: () => void; email?: string };
    CreateEvent: { toggleSearchBar?: () => void; email?: string };
    Location: undefined;
    Profile: undefined;
  };