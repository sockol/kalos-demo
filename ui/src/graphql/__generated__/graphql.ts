/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Mutation = {
  __typename?: 'Mutation';
  createTransaction?: Maybe<Transaction>;
};


export type MutationCreateTransactionArgs = {
  input: TransactionInput;
};

export type Org = {
  __typename?: 'Org';
  id: Scalars['String']['output'];
  stats: Stats;
  transactions: Array<Transaction>;
};

export type Query = {
  __typename?: 'Query';
  org?: Maybe<Org>;
};

export type Stats = {
  __typename?: 'Stats';
  highestPerformingSalesRep: Scalars['String']['output'];
  highestSellingRegion: Scalars['String']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Float']['output'];
  amountInUsd: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  region: Scalars['String']['output'];
  salesRep: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TransactionInput = {
  amount: Scalars['Float']['input'];
  currency: Scalars['String']['input'];
  name: Scalars['String']['input'];
  region: Scalars['String']['input'];
  salesRep: Scalars['String']['input'];
};
