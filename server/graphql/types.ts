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


export type BurndownTasksArgs = {
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
  CreatedAt = 'CREATED_AT',
  ModifiedAt = 'MODIFIED_AT'
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


export type MutationSaveBurndownArgs = {
  burndown: BurndownInput
};


export type MutationUpdateTaskArgs = {
  id: Scalars['ID'],
  data: UpdateTaskInput
};

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PageInfo = {
   __typename?: 'PageInfo',
  startCursor?: Maybe<Scalars['String']>,
  endCursor?: Maybe<Scalars['String']>,
  hasNextPage: Scalars['Boolean'],
  hasPreviousPage: Scalars['Boolean'],
};

export enum PhotoSize {
  Size_21X21 = 'SIZE_21X21',
  Size_27X27 = 'SIZE_27X27',
  Size_36X36 = 'SIZE_36X36',
  Size_60X60 = 'SIZE_60X60',
  Size_128X128 = 'SIZE_128X128'
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


export type ProjectTasksArgs = {
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


export type ProjectBurndownsArgs = {
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


export type QueryWorkspaceArgs = {
  id: Scalars['ID']
};


export type QueryProjectArgs = {
  id: Scalars['ID']
};


export type QueryTaskArgs = {
  id: Scalars['ID']
};


export type QueryBurndownArgs = {
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
  TaskId = 'TASK_ID',
  StoryPoints = 'STORY_POINTS',
  CompletedAt = 'COMPLETED_AT',
  DueOn = 'DUE_ON',
  CreatedAt = 'CREATED_AT',
  ModifiedAt = 'MODIFIED_AT'
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


export type UserPhotoArgs = {
  size: PhotoSize
};


export type UserWorkspacesArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>
};


export type UserBurndownsArgs = {
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


export type WorkspaceProjectsArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  archived?: Maybe<Scalars['Boolean']>
};

export type WorkspaceConnection = {
   __typename?: 'WorkspaceConnection',
  nodes?: Maybe<Array<Maybe<Workspace>>>,
  pageInfo?: Maybe<AsanaPageInfo>,
};
