import React from "react";
import { Provider as PaperProvider } from 'react-native-paper';
import { ShellNavigator } from "../navigation";

export const ShellContainer = () => {

    return (
        <PaperProvider>
          <ShellNavigator/>
        </PaperProvider>
      );
}