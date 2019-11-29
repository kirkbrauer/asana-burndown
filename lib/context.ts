import { createContext, useContext } from 'react';

type AppContext = {
  workspaceId: string,
  setWorkspaceId: (id: string) => void,
  darkMode: boolean,
  setDarkMode: (enabled: boolean) => void
};

export const AppContext = createContext<AppContext>({
  workspaceId: '',
  setWorkspaceId: () => {},
  darkMode: false,
  setDarkMode: () => {}
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = AppContext.Provider;
