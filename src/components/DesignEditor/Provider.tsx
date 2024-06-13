import React from "react";
import { Provider as ScenifyProvider } from "@layerhub-io/react";

import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider, LightTheme } from "baseui";
import { store } from "./store/store";
import { Provider as ReduxProvider } from "react-redux";
import { AppProvider } from "./contexts/AppContext";
import { DesignEditorProvider } from "./contexts/DesignEditor";

import { TimerProvider } from "@layerhub-io/use-timer"
import { I18nextProvider } from "react-i18next"
import i18next from "i18next"
import "./translations"
import { styletron } from "./styletron";

const Provider = ({ children }: { children: React.ReactNode }) => {

  return (
    <ReduxProvider store={store}>
      <DesignEditorProvider>
        <TimerProvider>
          <AppProvider>
            <ScenifyProvider>
              <StyletronProvider value={styletron}>
                <BaseProvider theme={LightTheme}>
                  <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
                </BaseProvider>
              </StyletronProvider>
            </ScenifyProvider>
          </AppProvider>
        </TimerProvider>
      </DesignEditorProvider>
    </ReduxProvider>
  );
};

export default Provider;
