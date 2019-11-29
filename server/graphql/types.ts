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
  nextPage?: Maybe<Scalars['String']>,
  hasNextPage: Scalars['Boolean'],
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
  workspace: Workspace,
};


export type ProjectTasksArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>
};

export type ProjectConnection = {
   __typename?: 'ProjectConnection',
  nodes?: Maybe<Array<Maybe<Project>>>,
  pageInfo?: Maybe<PageInfo>,
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


export type QueryWorkspaceArgs = {
  id: Scalars['ID']
};


export type QueryProjectArgs = {
  id: Scalars['ID']
};


export type QueryTaskArgs = {
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
  pageInfo?: Maybe<PageInfo>,
};


export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  email: Scalars['EmailAddress'],
  name: Scalars['String'],
  photo?: Maybe<Scalars['URL']>,
  workspaces: WorkspaceConnection,
};


export type UserPhotoArgs = {
  size: PhotoSize
};


export type UserWorkspacesArgs = {
  first?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>
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
  pageInfo?: Maybe<PageInfo>,
};
