import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../lib/theme';
import withApollo from '../lib/apollo';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';

class MyApp extends App<{ apollo: ApolloClient<any> }> {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>Asana Burndown Chart</title>
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ApolloProvider client={apollo}>
            <Component {...pageProps} />
          </ApolloProvider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default withApollo(MyApp);
