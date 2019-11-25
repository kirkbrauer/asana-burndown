import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import withApollo from 'next-with-apollo';

export default withApollo(({ ctx, headers, initialState }) => {
  const isBrowser = typeof window !== 'undefined';
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: createHttpLink({
      uri: process.env.API_URL,
      credentials: 'include',
      headers: !isBrowser && {
        'Cookie': headers.cookie
      },
      fetch: !isBrowser && fetch
    }),
    cache: new InMemoryCache().restore(initialState || {})
  });
});