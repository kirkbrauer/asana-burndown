import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { NextPage } from 'next';
import Content from '../../../../../components/Content';
import { useProjectTasks, useUpdateProjectTask } from '../../../../../lib/hooks';
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import FilterListIcon from '@material-ui/icons/FilterList';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';
import { KeyboardDateTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import { DataTypeProvider, PagingState, CustomPaging, SortingState, TableColumnWidthInfo, Sorting, FilteringState, Filter, EditingState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel, TableColumnVisibility, TableColumnResizing, Toolbar, ColumnChooser, TableFilterRow, TableEditColumn, TableEditRow } from '@devexpress/dx-react-grid-material-ui';
import { TaskField, OrderDirection, DateTimeQuery, IntQuery, DateQuery, Task } from '../../../../../graphql';

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
    toolbarButtons: {
      position: 'absolute',
      top: theme.spacing(4),
      left: theme.spacing(2),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
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

const DateEditor = ({ value, onValueChange, disabled }) => {
  return (
    <KeyboardDatePicker
      disabled={disabled}
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

const BooleanEditor = ({ value, onValueChange, disabled }) => {
  return (
    <Select
      value={value || 'none'}
      disabled={disabled}
      onChange={e => onValueChange(e.target.value)}
      style={{ width: '100%' }}
    >
      <MenuItem value="none">All</MenuItem>
      <MenuItem value="true">Yes</MenuItem>
      <MenuItem value="false">No</MenuItem>
    </Select>
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

const DEFAULT_CUSTOM_FILTERS: Filter[] = [
  { columnName: 'storyPoints', operation: 'equal', value: '' },
  { columnName: 'dueOn', operation: 'equal', value: null },
  { columnName: 'due', operation: 'equal', value: null },
  { columnName: 'completedAt', operation: 'equal', value: null },
  { columnName: 'createdAt', operation: 'equal', value: null },
  { columnName: 'created', operation: 'equal', value: null },
  { columnName: 'modifiedAt', operation: 'equal', value: null },
  { columnName: 'modified', operation: 'equal', value: null },
  { columnName: 'complete', operation: 'equal', value: null },
  { columnName: 'hasDueDate', operation: 'equal', value: 'none' },
  { columnName: 'hasPoints', operation: 'equal', value: 'none' },
];

const DEFAULT_HIDDEN_COLUMN_NAMES = ['id', 'taskId', 'complete', 'due', 'created', 'createdAt', 'modified', 'modifiedAt', 'hasDueDate', 'hasPoints'];

const FILTER_PRESETS = [
  { 
    id: 'complete',
    enabled: false,
    name: 'Complete',
    filters: { complete: true },
    hiddenColumns: ['id', 'taskId', 'due', 'created', 'createdAt', 'modified', 'modifiedAt', 'hasDueDate', 'hasPoints']
  },
  { 
    id: 'incomplete',
    enabled: false,
    name: 'Incomplete',
    filters: { complete: false },
    hiddenColumns: ['id', 'taskId', 'completedAt', 'created', 'createdAt', 'modified', 'modifiedAt', 'hasDueDate', 'hasPoints']
  },
  { id: 'overdue',
    enabled: false,
    name: 'Overdue',
    filters: {
      dueOn: { lt: new Date(Date.now()).toISOString().substr(0, 10) },
      complete: false
    },
    hiddenColumns: ['id', 'taskId', 'completedAt', 'complete', 'created', 'createdAt', 'modified', 'modifiedAt', 'hasDueDate', 'hasPoints']
  },
  { 
    id: 'upcoming',
    enabled: false,
    name: 'Upcoming',
    filters: {
      dueOn: {
        gte: new Date(Date.now()).toISOString().substr(0, 10),
        lte: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)).toISOString().substr(0, 10)
      },
      complete: false
    },
    hiddenColumns: ['id', 'taskId', 'created', 'createdAt', 'modified', 'modifiedAt', 'hasDueDate', 'hasPoints']
  },
  {
    id: 'missingDueDate',
    enabled: false,
    name: 'Missing Due Date',
    filters: { hasDueDate: false },
    hiddenColumns: ['id', 'taskId', 'created', 'complete', 'due', 'dueOn', 'createdAt', 'modified', 'modifiedAt', 'hasPoints']
  },
  {
    id: 'missingStoryPoints',
    enabled: false,
    name: 'Missing Story Points',
    filters: { hasPoints: false },
    hiddenColumns: ['id', 'taskId', 'created', 'complete', 'due', 'createdAt', 'modified', 'modifiedAt', 'hasDueDate']
  }
];

const COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: 'id', width: 'auto' },
  { columnName: 'taskId', width: 'auto' },
  { columnName: 'name', width: '40%' },
  { columnName: 'storyPoints', width: 'auto' },
  { columnName: 'completedAt', width: 'auto' },
  { columnName: 'complete', width: 'auto' },
  { columnName: 'dueOn', width: 'auto' },
  { columnName: 'due', width: 'auto' },
  { columnName: 'createdAt', width: 'auto' },
  { columnName: 'created', width: 'auto' },
  { columnName: 'modifiedAt', width: 'auto' },
  { columnName: 'modified', width: 'auto' },
  { columnName: 'hasDueDate', width: 'auto' },
  { columnName: 'hasPoints', width: 'auto' }
];

const ProjectTasksPage: NextPage = () => {
  const classes = useStyles({});
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSizes] = useState([10, 20, 30, 50, 0]);
  const [pageSize, setPageSize] = useState(20);
  const [hiddenColumnNames, setHiddenColumnNames] = useState(DEFAULT_HIDDEN_COLUMN_NAMES);
  const [columnWidths, setColumnWidths] = useState(COLUMN_WIDTHS);
  const [sorting, setSorting] = useState<Sorting[]>([{ columnName: 'createdAt', direction: 'asc' }]);
  const [customFilters, setCustomFilters] = useState(DEFAULT_CUSTOM_FILTERS);
  const [filterPresets, setFilterPresets] = useState(FILTER_PRESETS);
  const [storyPoints, setStoryPoints] = useState<IntQuery>(undefined);
  const [dueOn, setDueOn] = useState<DateQuery>(undefined);
  const [completedAt, setCompletedAt] = useState<DateTimeQuery>(undefined);
  const [createdAt, setCreatedAt] = useState<DateTimeQuery>(undefined);
  const [modifiedAt, setModifiedAt] = useState<DateTimeQuery>(undefined);
  const [hasDueDate, setHasDueDate] = useState<boolean>(undefined);
  const [hasPoints, setHasPoints] = useState<boolean>(undefined);
  const [complete, setComplete] = useState<boolean>(undefined);
  const { tasks, loading: loadingTasks, tasksTotalCount, refetch, refetching } = useProjectTasks(router.query.projectId as string, {
    storyPoints,
    dueOn,
    completedAt,
    createdAt,
    modifiedAt,
    hasDueDate,
    hasPoints,
    complete,
    first: pageSize,
    skip: currentPage * pageSize,
    orderBy: { field: taskColumnToEnum(sorting[0].columnName), direction: sorting[0].direction === 'asc' ? OrderDirection.ASC : OrderDirection.DESC }
  });
  const updateTask = useUpdateProjectTask(router.query.projectId as string, {
    storyPoints,
    dueOn,
    completedAt,
    createdAt,
    modifiedAt,
    hasDueDate,
    hasPoints,
    complete,
    first: pageSize,
    skip: currentPage * pageSize,
    orderBy: { field: taskColumnToEnum(sorting[0].columnName), direction: sorting[0].direction === 'asc' ? OrderDirection.ASC : OrderDirection.DESC }
  });

  const setFilterPreset = (id: string) => {
    // Find the filter preset
    const preset = filterPresets.find(preset => preset.id === id);
    // Make sure the preset was found
    if (preset) {
      // Toggle the preset
      const enabled = !preset.enabled;
      // Enable the correct filters
      if (enabled) {
        // Set the query filters
        setComplete(preset.filters.complete);
        setDueOn(preset.filters.dueOn);
        setHasDueDate(preset.filters.hasDueDate);
        setHasPoints(preset.filters.hasPoints);
        // Set the filter interface
        setCustomFilters([
          { columnName: 'storyPoints', operation: 'equal', value: '' },
          { columnName: 'dueOn', operation:  preset.filters.dueOn ? 'equal' : 'greaterThan', value: preset.filters.dueOn !== undefined ? preset.filters.dueOn.gte : null },
          { columnName: 'due', operation: 'equal', value: null },
          { columnName: 'completedAt', operation: 'equal', value: null },
          { columnName: 'createdAt', operation: 'equal', value: null },
          { columnName: 'created', operation: 'equal', value: null },
          { columnName: 'modifiedAt', operation: 'equal', value: null },
          { columnName: 'modified', operation: 'equal', value: null },
          { columnName: 'complete', operation: 'equal', value: preset.filters.complete !== undefined ? preset.filters.complete ? 'true' : 'false' : null },
          { columnName: 'hasDueDate', operation: 'equal', value: preset.filters.hasDueDate !== undefined ? preset.filters.hasDueDate ? 'true' : 'false' : null },
          { columnName: 'hasPoints', operation: 'equal', value: preset.filters.hasPoints !== undefined ? preset.filters.hasPoints ? 'true' : 'false' : null }
        ]);
        // Set the hidden columns
        setHiddenColumnNames(preset.hiddenColumns || DEFAULT_HIDDEN_COLUMN_NAMES);
      } else {
        setComplete(undefined);
        setDueOn(undefined);
        setHasDueDate(undefined);
        setHasPoints(undefined);
        setCustomFilters(DEFAULT_CUSTOM_FILTERS);
        setHiddenColumnNames(DEFAULT_HIDDEN_COLUMN_NAMES);
      }
      const presets = [];
      for (const p of filterPresets) {
        if (p.id === preset.id) {
          presets.push({
            ...p,
            enabled
          });
        } else {
          // Disable all other presets
          presets.push({
            ...p,
            enabled: false
          });
        }
      }
      // Set the filter presets
      setFilterPresets(presets);
    }
  };

  // On component mount
  useEffect(() => {
    // Get the URL params from the window search
    const urlParams = new URLSearchParams(window.location.search);
    // Set the filter preset based on the filter query variable
    if (urlParams.has('filter')) {
      setFilterPreset(urlParams.get('filter') as string);
      // Clear the URL param
      router.replace(router.route, `/w/${router.query.workspaceId}/p/${router.query.projectId}/tasks`, { shallow: true });
    }
  }, []);

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
            { name: 'complete', title: 'Complete' },
            { name: 'dueOn', title: 'Due On' },
            { name: 'due', title: 'Due' },
            { name: 'createdAt', title: 'Created At' },
            { name: 'created', title: 'Created' },
            { name: 'modifiedAt', title: 'Modified At' },
            { name: 'modified', title: 'Modified' },
            { name: 'hasDueDate', title: 'Has Due Date' },
            { name: 'hasPoints', title: 'Has Points' },
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
              { columnName: 'complete', sortingEnabled: false },
              { columnName: 'dueOn', sortingEnabled: true },
              { columnName: 'due', sortingEnabled: true },
              { columnName: 'createdAt', sortingEnabled: true },
              { columnName: 'created', sortingEnabled: true },
              { columnName: 'modifiedAt', sortingEnabled: true },
              { columnName: 'modified', sortingEnabled: true },
              { columnName: 'hasDueDate', sortingEnabled: false },
              { columnName: 'hasPoints', sortingEnabled: false }
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
            for={['created', 'modified']}
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
          <DataTypeProvider
            for={['complete', 'hasPoints']}
            editorComponent={BooleanEditor}
            formatterComponent={({ value }) => <div style={{ display: 'flex' }}><Chip style={{ margin: 'auto' }}  label={value ? 'Yes' : 'No'} /></div>}
          />
          <DataTypeProvider
            for={['hasDueDate']}
            editorComponent={BooleanEditor}
            formatterComponent={({ row }) => <div style={{ display: 'flex' }}><Chip style={{ margin: 'auto' }}  label={row.dueOn !== null ? 'Yes' : 'No'} /></div>}
          />
          <FilteringState
            filters={customFilters}
            onFiltersChange={(filters) => {
              // Disable all filter presets
              const presets = [];
              for (const preset of filterPresets) {
                presets.push({ ...preset, enabled: false });
              }
              setFilterPresets(presets);
              // Set the custom filters
              setCustomFilters(filters);
              // Reset all filters
              setStoryPoints(undefined);
              setDueOn(undefined);
              setCompletedAt(undefined);
              setCreatedAt(undefined);
              setModifiedAt(undefined);
              setHasDueDate(undefined);
              setHasPoints(undefined);
              setComplete(undefined);
              // Enable/disable the correct filters
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
                  case 'hasDueDate': {
                    if (filter.value !== null) {
                      if (filter.value === 'true') {
                        setHasDueDate(true);
                      } else if (filter.value === 'false') {
                        setHasDueDate(false);
                      }
                    }
                    break;
                  }
                  case 'hasPoints': {
                    if (filter.value !== null) {
                      if (filter.value === 'true') {
                        setHasPoints(true);
                      } else if (filter.value === 'false') {
                        setHasPoints(false);
                      }
                    }
                    break;
                  }
                  case 'complete': {
                    if (filter.value !== null) {
                      if (filter.value === 'true') {
                        setComplete(true);
                      } else if (filter.value === 'false') {
                        setComplete(false);
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
              { columnName: 'complete', filteringEnabled: false },
              { columnName: 'dueOn', filteringEnabled: true },
              { columnName: 'due', filteringEnabled: true },
              { columnName: 'createdAt', filteringEnabled: true },
              { columnName: 'created', filteringEnabled: true },
              { columnName: 'modifiedAt', filteringEnabled: true },
              { columnName: 'modified', filteringEnabled: true },
              { columnName: 'hasDueDate', filteringEnabled: true },
              { columnName: 'hasPoints', filteringEnabled: true }
            ]}
          />
          <EditingState
            onCommitChanges={(changes) => {
              // Get the updated task
              const index = Object.keys(changes.changed)[0];
              const task: Task = tasks[index];
              // Update the task in the database
              updateTask(task.taskId, {
                completedAt: changes.changed[index].completedAt ? new Date(changes.changed[index].completedAt).toISOString() : null,
                complete: changes.changed[index].completedAt ? true : false
              }, task);
            }}
            columnExtensions={[
              { columnName: 'id', editingEnabled: false },
              { columnName: 'taskId', editingEnabled: false },
              { columnName: 'name', editingEnabled: false },
              { columnName: 'storyPoints', editingEnabled: false },
              { columnName: 'completedAt', editingEnabled: true },
              { columnName: 'complete', editingEnabled: false },
              { columnName: 'dueOn', editingEnabled: false },
              { columnName: 'due', editingEnabled: false },
              { columnName: 'createdAt', editingEnabled: false },
              { columnName: 'created', editingEnabled: false },
              { columnName: 'modifiedAt', editingEnabled: false },
              { columnName: 'modified', editingEnabled: false },
              { columnName: 'hasDueDate', editingEnabled: false },
              { columnName: 'hasPoints', editingEnabled: false }
            ]}
          />
          <TableEditRow />
          <TableEditColumn showEditCommand />
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
        <div className={classes.toolbarButtons}>
          <Typography style={{ marginLeft: 16 }} variant="h6">
            {filterPresets.filter(preset => preset.enabled).map(preset => preset.name).join(', ') || 'All Tasks'}
          </Typography>
          <Tooltip title="Filter Tasks">
            <IconButton 
              style={{ marginLeft: 8 }}
              aria-controls="filter-menu"
              aria-haspopup="true"
              onClick={e => setAnchorEl(e.currentTarget)}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            keepMounted
            MenuListProps={{
              dense: true
            }}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {filterPresets.map(preset => (
              <MenuItem key={preset.id} onClick={() => setFilterPreset(preset.id)}>
                <Checkbox
                  disableRipple
                  checked={preset.enabled}
                  onClick={e => e.preventDefault()}
                  style={{ padding: 0, marginRight: 8 }}
                />
                {preset.name}
              </MenuItem>
            ))}
          </Menu>
          <Tooltip title="Reload Asana Data">
            <IconButton  onClick={refetch}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
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

export default ProjectTasksPage;
