import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type PageInfo = {
   __typename?: 'PageInfo',
  offset?: Maybe<Scalars['String']>,
  hasNextPage: Scalars['Boolean'],
};

export type Project = {
   __typename?: 'Project',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  archived: Scalars['Boolean'],
  status?: Maybe<ProjectStatus>,
  createdAt: Scalars['String'],
  modifiedAt: Scalars['String'],
};

export type ProjectConnection = {
   __typename?: 'ProjectConnection',
  nodes?: Maybe<Array<Maybe<Project>>>,
  nextPage?: Maybe<Scalars['String']>,
};

export type ProjectStatus = {
   __typename?: 'ProjectStatus',
  color?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
};

export type Query = {
   __typename?: 'Query',
  viewer?: Maybe<User>,
  workspaces: WorkspaceConnection,
  projects: ProjectConnection,
  tasks: TaskConnection,
};


export type QueryworkspacesArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>
};


export type QueryprojectsArgs = {
  workspace: Scalars['ID'],
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  archived?: Maybe<Scalars['Boolean']>
};


export type QuerytasksArgs = {
  project: Scalars['ID'],
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>
};

export type Task = {
   __typename?: 'Task',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  storyPoints?: Maybe<Scalars['Float']>,
  completed?: Maybe<Scalars['Boolean']>,
  completedAt?: Maybe<Scalars['String']>,
  dueOn?: Maybe<Scalars['String']>,
  createdAt?: Maybe<Scalars['String']>,
  modifiedAt?: Maybe<Scalars['String']>,
  defaultPoints?: Maybe<Scalars['Boolean']>,
};

export type TaskConnection = {
   __typename?: 'TaskConnection',
  nodes?: Maybe<Array<Maybe<Task>>>,
  nextPage?: Maybe<Scalars['String']>,
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  email: Scalars['String'],
  name: Scalars['String'],
};

export type Workspace = {
   __typename?: 'Workspace',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
};

export type WorkspaceConnection = {
   __typename?: 'WorkspaceConnection',
  nodes?: Maybe<Array<Maybe<Workspace>>>,
  nextPage?: Maybe<Scalars['String']>,
};

export type ViewerQueryVariables = {};


export type ViewerQuery = (
  { __typename?: 'Query' }
  & { viewer: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'name'>
  )> }
);


export const ViewerDocument = gql`
    query Viewer {
  viewer {
    id
    email
    name
  }
}
    `;

/**
 * __useViewerQuery__
 *
 * To run a query within a React component, call `useViewerQuery` and pass it any options that fit your needs.
 * When your component renders, `useViewerQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewerQuery({
 *   variables: {
 *   },
 * });
 */
export function useViewerQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ViewerQuery, ViewerQueryVariables>) {
        return ApolloReactHooks.useQuery<ViewerQuery, ViewerQueryVariables>(ViewerDocument, baseOptions);
      }
export function useViewerLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ViewerQuery, ViewerQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ViewerQuery, ViewerQueryVariables>(ViewerDocument, baseOptions);
        }
export type ViewerQueryHookResult = ReturnType<typeof useViewerQuery>;
export type ViewerLazyQueryHookResult = ReturnType<typeof useViewerLazyQuery>;
export type ViewerQueryResult = ApolloReactCommon.QueryResult<ViewerQuery, ViewerQueryVariables>;