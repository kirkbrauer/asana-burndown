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
  EmailAddress: string,
  URL: string,
  DateTime: Date,
  Date: Date,
};




export type PageInfo = {
   __typename?: 'PageInfo',
  offset?: Maybe<Scalars['String']>,
  hasNextPage: Scalars['Boolean'],
};

export enum PhotoSize {
  SIZE_21X21 = 'SIZE_21X21',
  SIZE_27X27 = 'SIZE_27X27',
  SIZE_36X36 = 'SIZE_36X36',
  SIZE_60X60 = 'SIZE_60X60',
  SIZE_128X128 = 'SIZE_128X128'
}

export type Project = {
   __typename?: 'Project',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  color?: Maybe<Scalars['String']>,
  status?: Maybe<ProjectStatus>,
  archived: Scalars['Boolean'],
  createdAt: Scalars['DateTime'],
  modifiedAt: Scalars['DateTime'],
  dueOn?: Maybe<Scalars['Date']>,
  startOn?: Maybe<Scalars['Date']>,
  tasks: TaskConnection,
  workspace: Workspace,
};


export type ProjecttasksArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>
};

export type ProjectConnection = {
   __typename?: 'ProjectConnection',
  nodes?: Maybe<Array<Maybe<Project>>>,
  nextPage?: Maybe<Scalars['String']>,
};

export type ProjectStatus = {
   __typename?: 'ProjectStatus',
  text?: Maybe<Scalars['String']>,
  color?: Maybe<Scalars['String']>,
};

export type Query = {
   __typename?: 'Query',
  viewer?: Maybe<User>,
  workspace?: Maybe<Workspace>,
  project?: Maybe<Project>,
  task?: Maybe<Task>,
};


export type QueryworkspaceArgs = {
  id: Scalars['ID']
};


export type QueryprojectArgs = {
  id: Scalars['ID']
};


export type QuerytaskArgs = {
  id: Scalars['ID']
};

export type Task = {
   __typename?: 'Task',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  storyPoints?: Maybe<Scalars['Float']>,
  completed?: Maybe<Scalars['Boolean']>,
  completedAt?: Maybe<Scalars['DateTime']>,
  dueOn?: Maybe<Scalars['Date']>,
  createdAt?: Maybe<Scalars['DateTime']>,
  modifiedAt?: Maybe<Scalars['DateTime']>,
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
  email: Scalars['EmailAddress'],
  name: Scalars['String'],
  photo?: Maybe<Scalars['URL']>,
  workspaces: WorkspaceConnection,
};


export type UserphotoArgs = {
  size: PhotoSize
};


export type UserworkspacesArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>
};

export type Workspace = {
   __typename?: 'Workspace',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  projects: ProjectConnection,
  tasks: TaskConnection,
};


export type WorkspaceprojectsArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  archived?: Maybe<Scalars['Boolean']>
};


export type WorkspacetasksArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>
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
    & Pick<User, 'id' | 'email' | 'name' | 'photo'>
  )> }
);

export type WorkspaceQueryVariables = {
  id: Scalars['ID']
};


export type WorkspaceQuery = (
  { __typename?: 'Query' }
  & { workspace: Maybe<(
    { __typename?: 'Workspace' }
    & WorkspaceFragment
  )> }
);

export type WorkspacesQueryVariables = {};


export type WorkspacesQuery = (
  { __typename?: 'Query' }
  & { viewer: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
    & { workspaces: (
      { __typename?: 'WorkspaceConnection' }
      & { nodes: Maybe<Array<Maybe<(
        { __typename?: 'Workspace' }
        & WorkspaceFragment
      )>>> }
    ) }
  )> }
);

export type WorkspaceFragment = (
  { __typename?: 'Workspace' }
  & Pick<Workspace, 'id' | 'name'>
);

export const WorkspaceFragmentDoc = gql`
    fragment Workspace on Workspace {
  id
  name
}
    `;
export const ViewerDocument = gql`
    query Viewer {
  viewer {
    id
    email
    name
    photo(size: SIZE_60X60)
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
export const WorkspaceDocument = gql`
    query Workspace($id: ID!) {
  workspace(id: $id) {
    ...Workspace
  }
}
    ${WorkspaceFragmentDoc}`;

/**
 * __useWorkspaceQuery__
 *
 * To run a query within a React component, call `useWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useWorkspaceQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<WorkspaceQuery, WorkspaceQueryVariables>) {
        return ApolloReactHooks.useQuery<WorkspaceQuery, WorkspaceQueryVariables>(WorkspaceDocument, baseOptions);
      }
export function useWorkspaceLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<WorkspaceQuery, WorkspaceQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<WorkspaceQuery, WorkspaceQueryVariables>(WorkspaceDocument, baseOptions);
        }
export type WorkspaceQueryHookResult = ReturnType<typeof useWorkspaceQuery>;
export type WorkspaceLazyQueryHookResult = ReturnType<typeof useWorkspaceLazyQuery>;
export type WorkspaceQueryResult = ApolloReactCommon.QueryResult<WorkspaceQuery, WorkspaceQueryVariables>;
export const WorkspacesDocument = gql`
    query Workspaces {
  viewer {
    id
    workspaces {
      nodes {
        ...Workspace
      }
    }
  }
}
    ${WorkspaceFragmentDoc}`;

/**
 * __useWorkspacesQuery__
 *
 * To run a query within a React component, call `useWorkspacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacesQuery({
 *   variables: {
 *   },
 * });
 */
export function useWorkspacesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<WorkspacesQuery, WorkspacesQueryVariables>) {
        return ApolloReactHooks.useQuery<WorkspacesQuery, WorkspacesQueryVariables>(WorkspacesDocument, baseOptions);
      }
export function useWorkspacesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<WorkspacesQuery, WorkspacesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<WorkspacesQuery, WorkspacesQueryVariables>(WorkspacesDocument, baseOptions);
        }
export type WorkspacesQueryHookResult = ReturnType<typeof useWorkspacesQuery>;
export type WorkspacesLazyQueryHookResult = ReturnType<typeof useWorkspacesLazyQuery>;
export type WorkspacesQueryResult = ApolloReactCommon.QueryResult<WorkspacesQuery, WorkspacesQueryVariables>;