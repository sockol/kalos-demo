import { createWithApollo } from "./createWithApollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    });
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({ 
  uri: "http://localhost/api/graphql"
})

const createClient = (ctx: NextPageContext) =>
    new ApolloClient({
        cache: new InMemoryCache(),
        link: from([errorLink, httpLink]),
    });

export const withApollo = createWithApollo(createClient);

