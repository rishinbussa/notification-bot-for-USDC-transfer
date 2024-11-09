

import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/94063/task/v0.0.7",  
  cache: new InMemoryCache()
});

export default client;