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
  DateTime: any,
  Date: any,
};

export type AsanaPageInfo = {
   __typename?: 'AsanaPageInfo',
  nextPage?: Maybe<Scalars['String']>,
  hasNextPage: Scalars['Boolean'],
};

export type Burndown = {
   __typename?: 'Burndown',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  project: Project,
  createdAt?: Maybe<Scalars['DateTime']>,
  modifiedAt?: Maybe<Scalars['DateTime']>,
  tasks: BurndownTaskConnection,
  path: Array<Maybe<BurndownPoint>>,
  user: User,
};


export type BurndowntasksArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  completed?: Maybe<Scalars['Boolean']>,
  hasPoints?: Maybe<Scalars['Boolean']>,
  hasDueDate?: Maybe<Scalars['Boolean']>,
  orderBy?: Maybe<TaskOrder>,
  dueOn?: Maybe<DateQuery>,
  completedAt?: Maybe<DateTimeQuery>
};

export type BurndownConnection = {
   __typename?: 'BurndownConnection',
  totalCount: Scalars['Int'],
  edges: Array<Maybe<BurndownEdge>>,
  pageInfo: PageInfo,
};

export type BurndownEdge = {
   __typename?: 'BurndownEdge',
  node: Burndown,
  cursor: Scalars['String'],
};

export enum BurndownField {
  CREATED_AT = 'CREATED_AT',
  MODIFIED_AT = 'MODIFIED_AT'
}

export type BurndownInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  projectId: Scalars['ID'],
  tasks: Array<Maybe<TaskInput>>,
};

export type BurndownOrder = {
  direction: OrderDirection,
  field: BurndownField,
};

export type BurndownPoint = {
   __typename?: 'BurndownPoint',
  date: Scalars['Date'],
  completed: Scalars['Float'],
  expected: Scalars['Float'],
};

export type BurndownTaskConnection = {
   __typename?: 'BurndownTaskConnection',
  totalPoints: Scalars['Float'],
  totalCount: Scalars['Int'],
  edges?: Maybe<Array<Maybe<TaskEdge>>>,
  pageInfo: PageInfo,
};


export type DateQuery = {
  lt?: Maybe<Scalars['Date']>,
  lte?: Maybe<Scalars['Date']>,
  gt?: Maybe<Scalars['Date']>,
  gte?: Maybe<Scalars['Date']>,
  eq?: Maybe<Scalars['Date']>,
};


export type DateTimeQuery = {
  lt?: Maybe<Scalars['DateTime']>,
  lte?: Maybe<Scalars['DateTime']>,
  gt?: Maybe<Scalars['DateTime']>,
  gte?: Maybe<Scalars['DateTime']>,
  eq?: Maybe<Scalars['DateTime']>,
};


export type Mutation = {
   __typename?: 'Mutation',
  saveBurndown: Burndown,
};


export type MutationsaveBurndownArgs = {
  burndown: BurndownInput
};

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type PageInfo = {
   __typename?: 'PageInfo',
  startCursor?: Maybe<Scalars['String']>,
  endCursor?: Maybe<Scalars['String']>,
  hasNextPage: Scalars['Boolean'],
  hasPreviousPage: Scalars['Boolean'],
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
  url?: Maybe<Scalars['URL']>,
  archived: Scalars['Boolean'],
  createdAt: Scalars['DateTime'],
  modifiedAt: Scalars['DateTime'],
  dueOn?: Maybe<Scalars['Date']>,
  startOn?: Maybe<Scalars['Date']>,
  tasks: TaskConnection,
  burndowns: BurndownConnection,
  burndown: Burndown,
  workspace: Workspace,
};


export type ProjecttasksArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>
};


export type ProjectburndownsArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  orderBy?: Maybe<BurndownOrder>
};

export type ProjectConnection = {
   __typename?: 'ProjectConnection',
  nodes?: Maybe<Array<Maybe<Project>>>,
  pageInfo: AsanaPageInfo,
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
  burndown?: Maybe<Burndown>,
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


export type QueryburndownArgs = {
  id: Scalars['ID']
};

export type Task = {
   __typename?: 'Task',
  id: Scalars['ID'],
  taskId: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  storyPoints?: Maybe<Scalars['Float']>,
  completed?: Maybe<Scalars['Boolean']>,
  completedAt?: Maybe<Scalars['DateTime']>,
  dueOn?: Maybe<Scalars['Date']>,
  hasDueDate: Scalars['Boolean'],
  createdAt?: Maybe<Scalars['DateTime']>,
  modifiedAt?: Maybe<Scalars['DateTime']>,
  hasPoints: Scalars['Boolean'],
};

export type TaskConnection = {
   __typename?: 'TaskConnection',
  nodes?: Maybe<Array<Maybe<Task>>>,
  pageInfo?: Maybe<AsanaPageInfo>,
};

export type TaskEdge = {
   __typename?: 'TaskEdge',
  node: Task,
  cursor: Scalars['String'],
};

export enum TaskField {
  TASK_ID = 'TASK_ID',
  STORY_POINTS = 'STORY_POINTS',
  COMPLETED_AT = 'COMPLETED_AT',
  DUE_ON = 'DUE_ON',
  CREATED_AT = 'CREATED_AT',
  MODIFIED_AT = 'MODIFIED_AT'
}

export type TaskInput = {
  id: Scalars['ID'],
  taskId: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  storyPoints?: Maybe<Scalars['Float']>,
  completed?: Maybe<Scalars['Boolean']>,
  completedAt?: Maybe<Scalars['DateTime']>,
  createdAt: Scalars['DateTime'],
  modifiedAt?: Maybe<Scalars['DateTime']>,
  dueOn?: Maybe<Scalars['Date']>,
  hasPoints?: Maybe<Scalars['Boolean']>,
};

export type TaskOrder = {
  direction: OrderDirection,
  field: TaskField,
};


export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  email: Scalars['EmailAddress'],
  name: Scalars['String'],
  photo?: Maybe<Scalars['URL']>,
  workspaces: WorkspaceConnection,
  burndowns: BurndownConnection,
};


export type UserphotoArgs = {
  size: PhotoSize
};


export type UserworkspacesArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>
};


export type UserburndownsArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  orderBy?: Maybe<BurndownOrder>
};

export type Workspace = {
   __typename?: 'Workspace',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  projects: ProjectConnection,
};


export type WorkspaceprojectsArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  archived?: Maybe<Scalars['Boolean']>
};

export type WorkspaceConnection = {
   __typename?: 'WorkspaceConnection',
  nodes?: Maybe<Array<Maybe<Workspace>>>,
  pageInfo?: Maybe<AsanaPageInfo>,
};

export type BurndownFragment = (
  { __typename?: 'Burndown' }
  & Pick<Burndown, 'id' | 'name' | 'description' | 'createdAt' | 'modifiedAt'>
);

export type BurndownPointFragment = (
  { __typename?: 'BurndownPoint' }
  & Pick<BurndownPoint, 'date' | 'expected' | 'completed'>
);

export type GenerateBurndownQueryVariables = {
  projectId: Scalars['ID'],
  today: Scalars['Date'],
  upcomingLimit: Scalars['Date']
};


export type GenerateBurndownQuery = (
  { __typename?: 'Query' }
  & { project: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
    & { burndown: (
      { __typename?: 'Burndown' }
      & { tasks: (
        { __typename?: 'BurndownTaskConnection' }
        & BurndownTaskConnectionFragment
      ), completedTasks: (
        { __typename?: 'BurndownTaskConnection' }
        & BurndownTaskConnectionFragment
      ), incompleteTasks: (
        { __typename?: 'BurndownTaskConnection' }
        & BurndownTaskConnectionFragment
      ), missingPoints: (
        { __typename?: 'BurndownTaskConnection' }
        & BurndownTaskConnectionFragment
      ), missingDueDate: (
        { __typename?: 'BurndownTaskConnection' }
        & BurndownTaskConnectionFragment
      ), overdueTasks: (
        { __typename?: 'BurndownTaskConnection' }
        & BurndownTaskConnectionFragment
      ), upcomingTasks: (
        { __typename?: 'BurndownTaskConnection' }
        & BurndownTaskConnectionFragment
      ), path: Array<Maybe<(
        { __typename?: 'BurndownPoint' }
        & BurndownPointFragment
      )>> }
      & BurndownFragment
    ) }
  )> }
);

export type PageInfoFragment = (
  { __typename?: 'PageInfo' }
  & Pick<PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
);

export type ProjectFragment = (
  { __typename?: 'Project' }
  & Pick<Project, 'id' | 'name' | 'description' | 'color' | 'archived' | 'createdAt' | 'modifiedAt' | 'dueOn' | 'startOn' | 'url'>
  & { status: Maybe<(
    { __typename?: 'ProjectStatus' }
    & Pick<ProjectStatus, 'text' | 'color'>
  )> }
);

export type TaskFragment = (
  { __typename?: 'Task' }
  & Pick<Task, 'id' | 'taskId' | 'name' | 'storyPoints' | 'hasPoints' | 'completed' | 'completedAt' | 'dueOn' | 'createdAt' | 'modifiedAt'>
);

export type BurndownTaskConnectionFragment = (
  { __typename?: 'BurndownTaskConnection' }
  & Pick<BurndownTaskConnection, 'totalCount'>
  & { edges: Maybe<Array<Maybe<(
    { __typename?: 'TaskEdge' }
    & Pick<TaskEdge, 'cursor'>
    & { node: (
      { __typename?: 'Task' }
      & TaskFragment
    ) }
  )>>>, pageInfo: (
    { __typename?: 'PageInfo' }
    & PageInfoFragment
  ) }
);

export type WorkspaceFragment = (
  { __typename?: 'Workspace' }
  & Pick<Workspace, 'id' | 'name'>
);

export type SaveBurndownMutationVariables = {
  burndown: BurndownInput
};


export type SaveBurndownMutation = (
  { __typename?: 'Mutation' }
  & { saveBurndown: (
    { __typename?: 'Burndown' }
    & BurndownFragment
  ) }
);

export type ProjectQueryVariables = {
  id: Scalars['ID']
};


export type ProjectQuery = (
  { __typename?: 'Query' }
  & { project: Maybe<(
    { __typename?: 'Project' }
    & { workspace: (
      { __typename?: 'Workspace' }
      & Pick<Workspace, 'id'>
    ) }
    & ProjectFragment
  )> }
);

export type ProjectsQueryVariables = {
  workspaceId: Scalars['ID'],
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  archived?: Maybe<Scalars['Boolean']>
};


export type ProjectsQuery = (
  { __typename?: 'Query' }
  & { workspace: Maybe<(
    { __typename?: 'Workspace' }
    & Pick<Workspace, 'id'>
    & { projects: (
      { __typename?: 'ProjectConnection' }
      & { nodes: Maybe<Array<Maybe<(
        { __typename?: 'Project' }
        & ProjectFragment
      )>>>, pageInfo: (
        { __typename?: 'AsanaPageInfo' }
        & Pick<AsanaPageInfo, 'nextPage' | 'hasNextPage'>
      ) }
    ) }
  )> }
);

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
      )>>>, pageInfo: Maybe<(
        { __typename?: 'AsanaPageInfo' }
        & Pick<AsanaPageInfo, 'nextPage' | 'hasNextPage'>
      )> }
    ) }
  )> }
);

export const BurndownFragmentDoc = gql`
    fragment Burndown on Burndown {
  id
  name
  description
  createdAt
  modifiedAt
}
    `;
export const BurndownPointFragmentDoc = gql`
    fragment BurndownPoint on BurndownPoint {
  date
  expected
  completed
}
    `;
export const ProjectFragmentDoc = gql`
    fragment Project on Project {
  id
  name
  description
  color
  archived
  createdAt
  modifiedAt
  dueOn
  startOn
  url
  status {
    text
    color
  }
}
    `;
export const TaskFragmentDoc = gql`
    fragment Task on Task {
  id
  taskId
  name
  storyPoints
  hasPoints
  completed
  completedAt
  dueOn
  createdAt
  modifiedAt
}
    `;
export const PageInfoFragmentDoc = gql`
    fragment PageInfo on PageInfo {
  hasNextPage
  hasPreviousPage
  startCursor
  endCursor
}
    `;
export const BurndownTaskConnectionFragmentDoc = gql`
    fragment BurndownTaskConnection on BurndownTaskConnection {
  totalCount
  edges {
    node {
      ...Task
    }
    cursor
  }
  pageInfo {
    ...PageInfo
  }
}
    ${TaskFragmentDoc}
${PageInfoFragmentDoc}`;
export const WorkspaceFragmentDoc = gql`
    fragment Workspace on Workspace {
  id
  name
}
    `;
export const GenerateBurndownDocument = gql`
    query GenerateBurndown($projectId: ID!, $today: Date!, $upcomingLimit: Date!) {
  project(id: $projectId) {
    id
    burndown {
      ...Burndown
      tasks {
        ...BurndownTaskConnection
      }
      completedTasks: tasks(completed: true) {
        ...BurndownTaskConnection
      }
      incompleteTasks: tasks(completed: false) {
        ...BurndownTaskConnection
      }
      missingPoints: tasks(hasPoints: false) {
        ...BurndownTaskConnection
      }
      missingDueDate: tasks(hasDueDate: false) {
        ...BurndownTaskConnection
      }
      overdueTasks: tasks(completed: false, dueOn: {lt: $today}) {
        ...BurndownTaskConnection
      }
      upcomingTasks: tasks(completed: false, dueOn: {gte: $today, lte: $upcomingLimit}) {
        ...BurndownTaskConnection
      }
      path {
        ...BurndownPoint
      }
    }
  }
}
    ${BurndownFragmentDoc}
${BurndownTaskConnectionFragmentDoc}
${BurndownPointFragmentDoc}`;

/**
 * __useGenerateBurndownQuery__
 *
 * To run a query within a React component, call `useGenerateBurndownQuery` and pass it any options that fit your needs.
 * When your component renders, `useGenerateBurndownQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGenerateBurndownQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      today: // value for 'today'
 *      upcomingLimit: // value for 'upcomingLimit'
 *   },
 * });
 */
export function useGenerateBurndownQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GenerateBurndownQuery, GenerateBurndownQueryVariables>) {
        return ApolloReactHooks.useQuery<GenerateBurndownQuery, GenerateBurndownQueryVariables>(GenerateBurndownDocument, baseOptions);
      }
export function useGenerateBurndownLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GenerateBurndownQuery, GenerateBurndownQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GenerateBurndownQuery, GenerateBurndownQueryVariables>(GenerateBurndownDocument, baseOptions);
        }
export type GenerateBurndownQueryHookResult = ReturnType<typeof useGenerateBurndownQuery>;
export type GenerateBurndownLazyQueryHookResult = ReturnType<typeof useGenerateBurndownLazyQuery>;
export type GenerateBurndownQueryResult = ApolloReactCommon.QueryResult<GenerateBurndownQuery, GenerateBurndownQueryVariables>;
export const SaveBurndownDocument = gql`
    mutation SaveBurndown($burndown: BurndownInput!) {
  saveBurndown(burndown: $burndown) {
    ...Burndown
  }
}
    ${BurndownFragmentDoc}`;
export type SaveBurndownMutationFn = ApolloReactCommon.MutationFunction<SaveBurndownMutation, SaveBurndownMutationVariables>;

/**
 * __useSaveBurndownMutation__
 *
 * To run a mutation, you first call `useSaveBurndownMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveBurndownMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveBurndownMutation, { data, loading, error }] = useSaveBurndownMutation({
 *   variables: {
 *      burndown: // value for 'burndown'
 *   },
 * });
 */
export function useSaveBurndownMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SaveBurndownMutation, SaveBurndownMutationVariables>) {
        return ApolloReactHooks.useMutation<SaveBurndownMutation, SaveBurndownMutationVariables>(SaveBurndownDocument, baseOptions);
      }
export type SaveBurndownMutationHookResult = ReturnType<typeof useSaveBurndownMutation>;
export type SaveBurndownMutationResult = ApolloReactCommon.MutationResult<SaveBurndownMutation>;
export type SaveBurndownMutationOptions = ApolloReactCommon.BaseMutationOptions<SaveBurndownMutation, SaveBurndownMutationVariables>;
export const ProjectDocument = gql`
    query Project($id: ID!) {
  project(id: $id) {
    ...Project
    workspace {
      id
    }
  }
}
    ${ProjectFragmentDoc}`;

/**
 * __useProjectQuery__
 *
 * To run a query within a React component, call `useProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
        return ApolloReactHooks.useQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, baseOptions);
      }
export function useProjectLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, baseOptions);
        }
export type ProjectQueryHookResult = ReturnType<typeof useProjectQuery>;
export type ProjectLazyQueryHookResult = ReturnType<typeof useProjectLazyQuery>;
export type ProjectQueryResult = ApolloReactCommon.QueryResult<ProjectQuery, ProjectQueryVariables>;
export const ProjectsDocument = gql`
    query Projects($workspaceId: ID!, $first: Int, $after: String, $archived: Boolean) {
  workspace(id: $workspaceId) {
    id
    projects(first: $first, after: $after, archived: $archived) {
      nodes {
        ...Project
      }
      pageInfo {
        nextPage
        hasNextPage
      }
    }
  }
}
    ${ProjectFragmentDoc}`;

/**
 * __useProjectsQuery__
 *
 * To run a query within a React component, call `useProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      archived: // value for 'archived'
 *   },
 * });
 */
export function useProjectsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ProjectsQuery, ProjectsQueryVariables>) {
        return ApolloReactHooks.useQuery<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, baseOptions);
      }
export function useProjectsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProjectsQuery, ProjectsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, baseOptions);
        }
export type ProjectsQueryHookResult = ReturnType<typeof useProjectsQuery>;
export type ProjectsLazyQueryHookResult = ReturnType<typeof useProjectsLazyQuery>;
export type ProjectsQueryResult = ApolloReactCommon.QueryResult<ProjectsQuery, ProjectsQueryVariables>;
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
      pageInfo {
        nextPage
        hasNextPage
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