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
  tasks: TaskConnection,
  path: Array<Maybe<BurndownPoint>>,
  user: User,
};


export type BurndowntasksArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  skip?: Maybe<Scalars['Int']>,
  complete?: Maybe<Scalars['Boolean']>,
  storyPoints?: Maybe<IntQuery>,
  hasPoints?: Maybe<Scalars['Boolean']>,
  hasDueDate?: Maybe<Scalars['Boolean']>,
  orderBy?: Maybe<TaskOrder>,
  dueOn?: Maybe<DateQuery>,
  completedAt?: Maybe<DateTimeQuery>,
  createdAt?: Maybe<DateTimeQuery>,
  modifiedAt?: Maybe<DateTimeQuery>,
  reload?: Maybe<Scalars['Boolean']>
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
  completed?: Maybe<Scalars['Float']>,
  expected: Scalars['Float'],
};


export type DateQuery = {
  lt?: Maybe<Scalars['Date']>,
  lte?: Maybe<Scalars['Date']>,
  gt?: Maybe<Scalars['Date']>,
  gte?: Maybe<Scalars['Date']>,
  eq?: Maybe<Scalars['Date']>,
  ne?: Maybe<Scalars['Date']>,
};


export type DateTimeQuery = {
  lt?: Maybe<Scalars['DateTime']>,
  lte?: Maybe<Scalars['DateTime']>,
  gt?: Maybe<Scalars['DateTime']>,
  gte?: Maybe<Scalars['DateTime']>,
  eq?: Maybe<Scalars['DateTime']>,
  ne?: Maybe<Scalars['DateTime']>,
};


export type IntQuery = {
  lt?: Maybe<Scalars['Int']>,
  lte?: Maybe<Scalars['Int']>,
  gt?: Maybe<Scalars['Int']>,
  gte?: Maybe<Scalars['Int']>,
  eq?: Maybe<Scalars['Int']>,
  ne?: Maybe<Scalars['Int']>,
};

export type Mutation = {
   __typename?: 'Mutation',
  saveBurndown: Burndown,
  updateTask: Task,
};


export type MutationsaveBurndownArgs = {
  burndown: BurndownInput
};


export type MutationupdateTaskArgs = {
  id: Scalars['ID'],
  data: UpdateTaskInput
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
  after?: Maybe<Scalars['String']>,
  skip?: Maybe<Scalars['Int']>,
  complete?: Maybe<Scalars['Boolean']>,
  storyPoints?: Maybe<IntQuery>,
  hasPoints?: Maybe<Scalars['Boolean']>,
  hasDueDate?: Maybe<Scalars['Boolean']>,
  orderBy?: Maybe<TaskOrder>,
  dueOn?: Maybe<DateQuery>,
  completedAt?: Maybe<DateTimeQuery>,
  createdAt?: Maybe<DateTimeQuery>,
  modifiedAt?: Maybe<DateTimeQuery>,
  reload?: Maybe<Scalars['Boolean']>
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
  complete?: Maybe<Scalars['Boolean']>,
  completedAt?: Maybe<Scalars['DateTime']>,
  dueOn?: Maybe<Scalars['Date']>,
  hasDueDate: Scalars['Boolean'],
  createdAt?: Maybe<Scalars['DateTime']>,
  modifiedAt?: Maybe<Scalars['DateTime']>,
  hasPoints: Scalars['Boolean'],
};

export type TaskConnection = {
   __typename?: 'TaskConnection',
  totalPoints: Scalars['Float'],
  totalCount: Scalars['Int'],
  edges?: Maybe<Array<Maybe<TaskEdge>>>,
  pageInfo: PageInfo,
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
  complete?: Maybe<Scalars['Boolean']>,
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

export type UpdateTaskInput = {
  name?: Maybe<Scalars['String']>,
  complete?: Maybe<Scalars['Boolean']>,
  completedAt?: Maybe<Scalars['DateTime']>,
  dueOn?: Maybe<Scalars['Date']>,
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
  & Pick<Task, 'id' | 'taskId' | 'name' | 'storyPoints' | 'hasPoints' | 'complete' | 'completedAt' | 'dueOn' | 'createdAt' | 'modifiedAt'>
);

export type TaskConnectionFragment = (
  { __typename?: 'TaskConnection' }
  & Pick<TaskConnection, 'totalCount' | 'totalPoints'>
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

export type UpdateTaskMutationVariables = {
  id: Scalars['ID'],
  data: UpdateTaskInput
};


export type UpdateTaskMutation = (
  { __typename?: 'Mutation' }
  & { updateTask: (
    { __typename?: 'Task' }
    & TaskFragment
  ) }
);

export type GenerateBurndownQueryVariables = {
  projectId: Scalars['ID']
};


export type GenerateBurndownQuery = (
  { __typename?: 'Query' }
  & { project: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
    & { burndown: (
      { __typename?: 'Burndown' }
      & { path: Array<Maybe<(
        { __typename?: 'BurndownPoint' }
        & BurndownPointFragment
      )>> }
      & BurndownFragment
    ) }
  )> }
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

export type ProjectStatisticsQueryVariables = {
  id: Scalars['ID'],
  start?: Maybe<Scalars['Date']>,
  end?: Maybe<Scalars['Date']>
};


export type ProjectStatisticsQuery = (
  { __typename?: 'Query' }
  & { project: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
    & { allTasks: (
      { __typename?: 'TaskConnection' }
      & Pick<TaskConnection, 'totalCount' | 'totalPoints'>
    ), completeTasks: (
      { __typename?: 'TaskConnection' }
      & Pick<TaskConnection, 'totalCount' | 'totalPoints'>
    ), incompleteTasks: (
      { __typename?: 'TaskConnection' }
      & Pick<TaskConnection, 'totalCount' | 'totalPoints'>
    ), missingDueDate: (
      { __typename?: 'TaskConnection' }
      & TaskConnectionFragment
    ), missingStoryPoints: (
      { __typename?: 'TaskConnection' }
      & TaskConnectionFragment
    ), upcomingTasks: (
      { __typename?: 'TaskConnection' }
      & TaskConnectionFragment
    ), overdueTasks: (
      { __typename?: 'TaskConnection' }
      & TaskConnectionFragment
    ) }
  )> }
);

export type ProjectTasksQueryVariables = {
  id: Scalars['ID'],
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  skip?: Maybe<Scalars['Int']>,
  complete?: Maybe<Scalars['Boolean']>,
  hasPoints?: Maybe<Scalars['Boolean']>,
  hasDueDate?: Maybe<Scalars['Boolean']>,
  orderBy?: Maybe<TaskOrder>,
  storyPoints?: Maybe<IntQuery>,
  dueOn?: Maybe<DateQuery>,
  completedAt?: Maybe<DateTimeQuery>,
  createdAt?: Maybe<DateTimeQuery>,
  modifiedAt?: Maybe<DateTimeQuery>,
  reload?: Maybe<Scalars['Boolean']>
};


export type ProjectTasksQuery = (
  { __typename?: 'Query' }
  & { project: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
    & { tasks: (
      { __typename?: 'TaskConnection' }
      & TaskConnectionFragment
    ) }
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
  complete
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
export const TaskConnectionFragmentDoc = gql`
    fragment TaskConnection on TaskConnection {
  totalCount
  totalPoints
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
export const UpdateTaskDocument = gql`
    mutation UpdateTask($id: ID!, $data: UpdateTaskInput!) {
  updateTask(id: $id, data: $data) {
    ...Task
  }
}
    ${TaskFragmentDoc}`;
export type UpdateTaskMutationFn = ApolloReactCommon.MutationFunction<UpdateTaskMutation, UpdateTaskMutationVariables>;

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskMutation, { data, loading, error }] = useUpdateTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateTaskMutation, UpdateTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, baseOptions);
      }
export type UpdateTaskMutationHookResult = ReturnType<typeof useUpdateTaskMutation>;
export type UpdateTaskMutationResult = ApolloReactCommon.MutationResult<UpdateTaskMutation>;
export type UpdateTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const GenerateBurndownDocument = gql`
    query GenerateBurndown($projectId: ID!) {
  project(id: $projectId) {
    id
    burndown {
      ...Burndown
      path {
        ...BurndownPoint
      }
    }
  }
}
    ${BurndownFragmentDoc}
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
export const ProjectStatisticsDocument = gql`
    query ProjectStatistics($id: ID!, $start: Date, $end: Date) {
  project(id: $id) {
    id
    allTasks: tasks(first: 0) {
      totalCount
      totalPoints
    }
    completeTasks: tasks(first: 0, complete: true) {
      totalCount
      totalPoints
    }
    incompleteTasks: tasks(first: 0, complete: false) {
      totalCount
      totalPoints
    }
    missingDueDate: tasks(first: 20, hasDueDate: false) {
      ...TaskConnection
    }
    missingStoryPoints: tasks(first: 20, hasPoints: false) {
      ...TaskConnection
    }
    upcomingTasks: tasks(first: 100, dueOn: {gte: $start, lte: $end}, complete: false, orderBy: {field: DUE_ON, direction: ASC}) {
      ...TaskConnection
    }
    overdueTasks: tasks(first: 20, dueOn: {lt: $start}, complete: false, orderBy: {field: DUE_ON, direction: DESC}) {
      ...TaskConnection
    }
  }
}
    ${TaskConnectionFragmentDoc}`;

/**
 * __useProjectStatisticsQuery__
 *
 * To run a query within a React component, call `useProjectStatisticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectStatisticsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectStatisticsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      start: // value for 'start'
 *      end: // value for 'end'
 *   },
 * });
 */
export function useProjectStatisticsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ProjectStatisticsQuery, ProjectStatisticsQueryVariables>) {
        return ApolloReactHooks.useQuery<ProjectStatisticsQuery, ProjectStatisticsQueryVariables>(ProjectStatisticsDocument, baseOptions);
      }
export function useProjectStatisticsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProjectStatisticsQuery, ProjectStatisticsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ProjectStatisticsQuery, ProjectStatisticsQueryVariables>(ProjectStatisticsDocument, baseOptions);
        }
export type ProjectStatisticsQueryHookResult = ReturnType<typeof useProjectStatisticsQuery>;
export type ProjectStatisticsLazyQueryHookResult = ReturnType<typeof useProjectStatisticsLazyQuery>;
export type ProjectStatisticsQueryResult = ApolloReactCommon.QueryResult<ProjectStatisticsQuery, ProjectStatisticsQueryVariables>;
export const ProjectTasksDocument = gql`
    query ProjectTasks($id: ID!, $first: Int, $after: String, $skip: Int, $complete: Boolean, $hasPoints: Boolean, $hasDueDate: Boolean, $orderBy: TaskOrder, $storyPoints: IntQuery, $dueOn: DateQuery, $completedAt: DateTimeQuery, $createdAt: DateTimeQuery, $modifiedAt: DateTimeQuery, $reload: Boolean) {
  project(id: $id) {
    id
    tasks(first: $first, after: $after, skip: $skip, complete: $complete, hasPoints: $hasPoints, hasDueDate: $hasDueDate, orderBy: $orderBy, storyPoints: $storyPoints, dueOn: $dueOn, completedAt: $completedAt, createdAt: $createdAt, modifiedAt: $modifiedAt, reload: $reload) {
      ...TaskConnection
    }
  }
}
    ${TaskConnectionFragmentDoc}`;

/**
 * __useProjectTasksQuery__
 *
 * To run a query within a React component, call `useProjectTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectTasksQuery({
 *   variables: {
 *      id: // value for 'id'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      skip: // value for 'skip'
 *      complete: // value for 'complete'
 *      hasPoints: // value for 'hasPoints'
 *      hasDueDate: // value for 'hasDueDate'
 *      orderBy: // value for 'orderBy'
 *      storyPoints: // value for 'storyPoints'
 *      dueOn: // value for 'dueOn'
 *      completedAt: // value for 'completedAt'
 *      createdAt: // value for 'createdAt'
 *      modifiedAt: // value for 'modifiedAt'
 *      reload: // value for 'reload'
 *   },
 * });
 */
export function useProjectTasksQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ProjectTasksQuery, ProjectTasksQueryVariables>) {
        return ApolloReactHooks.useQuery<ProjectTasksQuery, ProjectTasksQueryVariables>(ProjectTasksDocument, baseOptions);
      }
export function useProjectTasksLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProjectTasksQuery, ProjectTasksQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ProjectTasksQuery, ProjectTasksQueryVariables>(ProjectTasksDocument, baseOptions);
        }
export type ProjectTasksQueryHookResult = ReturnType<typeof useProjectTasksQuery>;
export type ProjectTasksLazyQueryHookResult = ReturnType<typeof useProjectTasksLazyQuery>;
export type ProjectTasksQueryResult = ApolloReactCommon.QueryResult<ProjectTasksQuery, ProjectTasksQueryVariables>;
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