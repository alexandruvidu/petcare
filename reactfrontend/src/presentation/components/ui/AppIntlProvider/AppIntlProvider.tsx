import { PropsWithChildren } from 'react';
import { IntlProvider } from 'react-intl';
import enMessages from '../../../assets/lang/en';

/**
 * Internationalization provider for the application
 * Wraps the application with react-intl
 */
export const AppIntlProvider = ({ children }: PropsWithChildren<{}>) => {
  return (
    <IntlProvider
      messages={enMessages}
      locale="en"
      defaultLocale="en"
    >
      {children}
    </IntlProvider>
  );
};
