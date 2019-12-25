import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { NextPage } from 'next';
import Content from '../../../../../components/Content';
import { useProjectTasks } from '../../../../../lib/hooks';
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tooltip from '@material-ui/core/Tooltip';
import Moment from 'react-moment';
import { KeyboardDateTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import { DataTypeProvider, PagingState, CustomPaging, SortingState, TableColumnWidthInfo, Sorting, FilteringState, Filter } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel, TableColumnVisibility, TableColumnResizing, Toolbar, ColumnChooser, TableFilterRow } from '@devexpress/dx-react-grid-material-ui';
import { TaskField, OrderDirection, DateTimeQuery, IntQuery, DateQuery } from '../../../../../graphql';

const useStyles = makeStyles(theme =>
  createStyles({
    paperContent: {
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3),
      position: 'relative'
    },
    projectDescription: {
      marginTop: theme.spacing(1)
    },
    defaultPoints: {
      color: theme.palette.secondary.dark
    },
    loadingSpinnerContainer: {
      display: 'flex'
    },
    loadingSpinner: {
      margin: 'auto',
      color: theme.palette.text.primary,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    tasksLoadingSpinnerBackground: {
      position: 'absolute',
      top: theme.spacing(3),
      left: theme.spacing(3),
      right: theme.spacing(3),
      bottom: theme.spacing(3),
      width: `calc(100% - ${theme.spacing(3) * 2}px)`,
      height: `calc(100% - ${theme.spacing(3) * 2}px)`,
      backgroundColor: theme.palette.background.paper,
      opacity: 0.5
    },
    tasksLoadingSpinnerContainer: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      display: 'flex',
      width: '100%'
    },
    headerContent: {
      padding: theme.spacing(4)
    },
    reloadButton: {
      position: 'absolute',
      top: theme.spacing(4),
      left: theme.spacing(6)
    }
  })
);

const DateTimeEditor = ({ value, onValueChange }) => {
  return (
    <KeyboardDateTimePicker
      variant="inline"
      format="MM/dd/yy hh:mm a"
      margin="dense"
      style={{ width: '100%', marginTop: 4 }}
      value={value}
      onChange={(date, value) => {
        onValueChange(value);
      }}
      KeyboardButtonProps={{
        'aria-label': 'change date/time',
      }}
    />
  );
};

const DateEditor = ({ value, onValueChange }) => {
  return (
    <KeyboardDatePicker
      variant="inline"
      format="MM/dd/yy"
      margin="dense"
      style={{ width: '100%', marginTop: 4 }}
      value={value}
      onChange={(date, value) => {
        onValueChange(value);
      }}
      KeyboardButtonProps={{
        'aria-label': 'change date/time',
      }}
    />
  );
};

const taskColumnToEnum = (column: string) => {
  switch (column) {
    case 'taskId': return TaskField.TASK_ID;
    case 'storyPoints': return TaskField.STORY_POINTS;
    case 'completedAt': return TaskField.COMPLETED_AT;
    case 'dueOn': return TaskField.DUE_ON;
    case 'createdAt': return TaskField.CREATED_AT;
    case 'modifiedAt': return TaskField.MODIFIED_AT;
  }
};

const ProjectTasks: NextPage = () => {
  const classes = useStyles({});
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSizes] = useState([10, 20, 30, 50, 0]);
  const [pageSize, setPageSize] = useState(20);
  const [hiddenColumnNames, setHiddenColumnNames] = useState(['id', 'taskId', 'completedAt', 'due', 'created', 'createdAt', 'modified', 'modifiedAt']);
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>([
    { columnName: 'id', width: 'auto' },
    { columnName: 'taskId', width: 'auto' },
    { columnName: 'name', width: '50%' },
    { columnName: 'storyPoints', width: 'auto' },
    { columnName: 'completedAt', width: 'auto' },
    { columnName: 'completed', width: 'auto' },
    { columnName: 'dueOn', width: 'auto' },
    { columnName: 'due', width: 'auto' },
    { columnName: 'createdAt', width: 'auto' },
    { columnName: 'created', width: 'auto' },
    { columnName: 'modifiedAt', width: 'auto' },
    { columnName: 'modified', width: 'auto' },
  ]);
  const [sorting, setSorting] = useState<Sorting[]>([{ columnName: 'createdAt', direction: 'asc' }]);
  const [filters, setFilters] = useState<Filter[]>([
    { columnName: 'storyPoints', operation: 'equal', value: '' },
    { columnName: 'dueOn', operation: 'equal', value: null },
    { columnName: 'due', operation: 'equal', value: null },
    { columnName: 'completedAt', operation: 'equal', value: null },
    { columnName: 'completed', operation: 'equal', value: null },
    { columnName: 'createdAt', operation: 'equal', value: null },
    { columnName: 'created', operation: 'equal', value: null },
    { columnName: 'modifiedAt', operation: 'equal', value: null },
    { columnName: 'modified', operation: 'equal', value: null },
  ]);
  const [storyPoints, setStoryPoints] = useState<IntQuery>(undefined);
  const [dueOn, setDueOn] = useState<DateQuery>(undefined);
  const [completedAt, setCompletedAt] = useState<DateTimeQuery>(undefined);
  const [createdAt, setCreatedAt] = useState<DateTimeQuery>(undefined);
  const [modifiedAt, setModifiedAt] = useState<DateTimeQuery>(undefined);
  const { tasks, loading: loadingTasks, tasksTotalCount, refetch, refetching } = useProjectTasks(router.query.projectId as string, {
    storyPoints,
    dueOn,
    completedAt,
    createdAt,
    modifiedAt,
    first: pageSize,
    skip: currentPage * pageSize,
    orderBy: { field: taskColumnToEnum(sorting[0].columnName), direction: sorting[0].direction === 'asc' ? OrderDirection.ASC : OrderDirection.DESC }
  });
  return (
    <Content disableToolbar>
      <Paper className={classes.paperContent}>
        <Grid
          rows={tasks}
          columns={[
            { name: 'id', title: 'ID' },
            { name: 'taskId', title: 'Asana ID' },
            { name: 'name', title: 'Name' },
            { name: 'storyPoints', title: 'Points' },
            { name: 'completedAt', title: 'Completed At' },
            { name: 'completed', title: 'Completed' },
            { name: 'dueOn', title: 'Due On' },
            { name: 'due', title: 'Due' },
            { name: 'createdAt', title: 'Created At' },
            { name: 'created', title: 'Created' },
            { name: 'modifiedAt', title: 'Modified At' },
            { name: 'modified', title: 'Modified' },
          ]}
        >
          <Table messages={{ noData: '' }} />
          <TableColumnResizing
            resizingMode="nextColumn"
            columnWidths={columnWidths}
            onColumnWidthsChange={setColumnWidths}
          />
          <SortingState
            sorting={sorting}
            onSortingChange={setSorting}
            columnExtensions={[
              { columnName: 'id', sortingEnabled: false },
              { columnName: 'taskId', sortingEnabled: false },
              { columnName: 'name', sortingEnabled: false },
              { columnName: 'storyPoints', sortingEnabled: true },
              { columnName: 'completedAt', sortingEnabled: true },
              { columnName: 'completed', sortingEnabled: true },
              { columnName: 'dueOn', sortingEnabled: true },
              { columnName: 'due', sortingEnabled: true },
              { columnName: 'createdAt', sortingEnabled: true },
              { columnName: 'created', sortingEnabled: true },
              { columnName: 'modifiedAt', sortingEnabled: true },
              { columnName: 'modified', sortingEnabled: true },
            ]}
          />
          <PagingState
            pageSize={pageSize}
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
          <DataTypeProvider
            for={['storyPoints']}
            availableFilterOperations={[
              'equal',
              'notEqual',
              'greaterThan',
              'greaterThanOrEqual',
              'lessThan',
              'lessThanOrEqual',
            ]}
            formatterComponent={({ value, row }) => row.hasPoints ? value : <div className={classes.defaultPoints}>{value}</div>}
          />
          <DataTypeProvider
            for={['completedAt', 'createdAt', 'modifiedAt']}
            availableFilterOperations={[
              'equal',
              'notEqual',
              'greaterThan',
              'greaterThanOrEqual',
              'lessThan',
              'lessThanOrEqual',
            ]}
            editorComponent={DateTimeEditor}
            formatterComponent={({ value }) => value ? <Moment date={value} format="MM/DD/YY hh:mm A" /> : <div>-</div>}
          />
          <DataTypeProvider
            for={['completed', 'created', 'modified']}
            availableFilterOperations={[
              'equal',
              'notEqual',
              'greaterThan',
              'greaterThanOrEqual',
              'lessThan',
              'lessThanOrEqual',
            ]}
            editorComponent={DateTimeEditor}
            formatterComponent={({ row, column }) => row[`${column.name}At`] ? <Moment date={row[`${column.name}At`]} fromNow /> : <div>-</div>}
          />
          <DataTypeProvider
            for={['dueOn']}
            availableFilterOperations={[
              'equal',
              'notEqual',
              'greaterThan',
              'greaterThanOrEqual',
              'lessThan',
              'lessThanOrEqual',
            ]}
            editorComponent={DateEditor}
            formatterComponent={({ value }) => value ? <Moment date={value} format="MM/DD/YY" /> : <div>-</div>}
          />
          <DataTypeProvider
            for={['due']}
            availableFilterOperations={[
              'equal',
              'notEqual',
              'greaterThan',
              'greaterThanOrEqual',
              'lessThan',
              'lessThanOrEqual',
            ]}
            editorComponent={DateEditor}
            formatterComponent={({ row, column }) => row[`${column.name}On`] ? <Moment date={row[`${column.name}On`]} fromNow /> : <div>-</div>}
          />
          <FilteringState
            filters={filters}
            onFiltersChange={(filters) => {
              setFilters(filters);
              setStoryPoints(undefined);
              setDueOn(undefined);
              setCompletedAt(undefined);
              setCreatedAt(undefined);
              setModifiedAt(undefined);
              for (const filter of filters) {
                switch (filter.columnName) {
                  case 'storyPoints': {
                    switch (filter.operation) {
                      case 'equal': {
                        setStoryPoints({ eq: parseInt(filter.value, 10) });
                        break;
                      }
                      case 'notEqual': {
                        setStoryPoints({ ne: parseInt(filter.value, 10) });
                        break;
                      }
                      case 'greaterThan': {
                        setStoryPoints({ gt: parseInt(filter.value, 10) });
                        break;
                      }
                      case 'greaterThanOrEqual': {
                        setStoryPoints({ gte: parseInt(filter.value, 10) });
                        break;
                      }
                      case 'lessThan': {
                        setStoryPoints({ lt: parseInt(filter.value, 10) });
                        break;
                      }
                      case 'lessThanOrEqual': {
                        setStoryPoints({ lte: parseInt(filter.value, 10) });
                        break;
                      }
                    }
                    break;
                  }
                  case 'due':
                  case 'dueOn': {
                    let date;
                    if (filter.value) {
                      // Attempt to convert the date
                      try {
                        date = new Date(filter.value).toISOString().substr(0, 10);
                      } catch {}
                    }
                    // Only update the query if the date is valid
                    if (date) {
                      switch (filter.operation) {
                        case 'equal': {
                          setDueOn({ eq: date });
                          break;
                        }
                        case 'notEqual': {
                          setDueOn({ ne: date });
                          break;
                        }
                        case 'greaterThan': {
                          setDueOn({ gt: date });
                          break;
                        }
                        case 'greaterThanOrEqual': {
                          setDueOn({ gte: date });
                          break;
                        }
                        case 'lessThan': {
                          setDueOn({ lt: date });
                          break;
                        }
                        case 'lessThanOrEqual': {
                          setDueOn({ lte: new Date(filter.value) });
                          break;
                        }
                      }
                    }
                    break;
                  }
                  case 'completed':
                  case 'completedAt': {
                    let date;
                    if (filter.value) {
                      // Attempt to convert the date
                      try {
                        date = new Date(filter.value);
                      } catch {}
                    }
                    if (date) {
                      switch (filter.operation) {
                        case 'equal': {
                          setCompletedAt({ eq: date });
                          break;
                        }
                        case 'notEqual': {
                          setCompletedAt({ ne: date });
                          break;
                        }
                        case 'greaterThan': {
                          setCompletedAt({ gt: date });
                          break;
                        }
                        case 'greaterThanOrEqual': {
                          setCompletedAt({ gte: date });
                          break;
                        }
                        case 'lessThan': {
                          setCompletedAt({ lt: date });
                          break;
                        }
                        case 'lessThanOrEqual': {
                          setCompletedAt({ lte: date });
                          break;
                        }
                      }
                    }
                    break;
                  }
                  case 'created':
                  case 'createdAt': {
                    let date;
                    if (filter.value) {
                      // Attempt to convert the date
                      try {
                        date = new Date(filter.value);
                      } catch {}
                    }
                    if (date) {
                      switch (filter.operation) {
                        case 'equal': {
                          setCreatedAt({ eq: date });
                          break;
                        }
                        case 'notEqual': {
                          setCreatedAt({ ne: date });
                          break;
                        }
                        case 'greaterThan': {
                          setCreatedAt({ gt: date });
                          break;
                        }
                        case 'greaterThanOrEqual': {
                          setCreatedAt({ gte: date });
                          break;
                        }
                        case 'lessThan': {
                          setCreatedAt({ lt: date });
                          break;
                        }
                        case 'lessThanOrEqual': {
                          setCreatedAt({ lte: date });
                          break;
                        }
                      }
                    }
                    break;
                  }
                  case 'modified':
                  case 'modifiedAt': {
                    let date;
                    if (filter.value) {
                      // Attempt to convert the date
                      try {
                        date = new Date(filter.value);
                      } catch {}
                    }
                    if (date) {
                      switch (filter.operation) {
                        case 'equal': {
                          setModifiedAt({ eq: date });
                          break;
                        }
                        case 'notEqual': {
                          setModifiedAt({ ne: date });
                          break;
                        }
                        case 'greaterThan': {
                          setModifiedAt({ gt: date });
                          break;
                        }
                        case 'greaterThanOrEqual': {
                          setModifiedAt({ gte: date });
                          break;
                        }
                        case 'lessThan': {
                          setModifiedAt({ lt: date });
                          break;
                        }
                        case 'lessThanOrEqual': {
                          setModifiedAt({ lte: date });
                          break;
                        }
                      }
                    } 
                    break;
                  }
                }
              }
            }}
            columnExtensions={[
              { columnName: 'id', filteringEnabled: false },
              { columnName: 'taskId', filteringEnabled: false },
              { columnName: 'name', filteringEnabled: false },
              { columnName: 'storyPoints', filteringEnabled: true },
              { columnName: 'completedAt', filteringEnabled: true },
              { columnName: 'completed', filteringEnabled: true },
              { columnName: 'dueOn', filteringEnabled: true },
              { columnName: 'due', filteringEnabled: true },
              { columnName: 'createdAt', filteringEnabled: true },
              { columnName: 'created', filteringEnabled: true },
              { columnName: 'modifiedAt', filteringEnabled: true },
              { columnName: 'modified', filteringEnabled: true }
            ]}
          />
          <CustomPaging totalCount={tasksTotalCount} />
          <TableHeaderRow showSortingControls />
          <TableFilterRow showFilterSelector />
          <TableColumnVisibility
            hiddenColumnNames={hiddenColumnNames}
            onHiddenColumnNamesChange={setHiddenColumnNames}
          />
          <Toolbar />
          <ColumnChooser />
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
        <Tooltip title="Reload Asana Data">
          <IconButton className={classes.reloadButton} onClick={refetch}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {(loadingTasks || refetching) && (
          <>
            <div className={classes.tasksLoadingSpinnerBackground} />
            <div className={classes.tasksLoadingSpinnerContainer}>
              <CircularProgress className={classes.loadingSpinner} />
            </div>
          </>
        )}
      </Paper>
    </Content>
  );
};

export default ProjectTasks;
