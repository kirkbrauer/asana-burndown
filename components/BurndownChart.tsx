import React, { FunctionComponent, useRef, useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Chart, LineSeries, ScatterSeries, ValueAxis, ArgumentAxis, Title, Legend } from '@devexpress/dx-react-chart-material-ui';
import { BurndownPoint } from '../graphql';
import { useWindowWidth } from '@react-hook/window-size/throttled';

type BurndownChartProps = {
  loading: boolean,
  path: BurndownPoint[],
  name?: string
};

type BurndownChartPoint = {
  date?: string,
  current?: number,
  actualDate?: Date,
  expected: number,
  completed: number
};

const useStyles = makeStyles(theme =>
  createStyles({
    loadingContainer: {
      display: 'flex',
      color: theme.palette.text.primary
    },
    loadingContent: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      margin: 'auto',
      marginTop: theme.spacing(1)
    },
    loadingText: {
      marginTop: theme.spacing(2)
    },
    paperContent: {
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3)
    },
    projectDescription: {
      marginTop: theme.spacing(1)
    },
    legendRootComponentContainer: {
      display: 'flex', 
      flexDirection: 'row', 
      width: '100%', 
      marginTop: theme.spacing(2)
    },
    legendRoodComponentContent: {
      margin: 'auto',
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column'
      },
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        width: 400
      },
    }
  })
);

const BurndownChart: FunctionComponent<BurndownChartProps> = ({ loading, path: burndownPath, name }) => {
  const classes = useStyles({});
  const windowWidth = useWindowWidth();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<BurndownChartPoint[]>([]);
  const [valuesPerDate, setValuesPerDate] = useState(5);
  useEffect(() => {
    if (chartContainerRef.current) {
      // Calculate the maximum number of datess that will fit
      const maxDates = Math.floor(chartContainerRef.current.clientWidth / 20);
      // Get the number of values per date
      const valuesPerDate = Math.ceil(burndownPath.length / maxDates);
      // Set the values per date state variable
      setValuesPerDate(valuesPerDate);
      // Convert the path
      let path = burndownPath as BurndownChartPoint[];
      // Add the today line
      for (let i = 0; i < path.length; i += 1) {
        if (new Date(path[i].date).getTime() <= Date.now() && new Date(path[i + 1].date).getTime() >= Date.now()) {
          path.splice(i, 0, { current: 0, date: path[i].date, actualDate: path[i].actualDate, expected: undefined, completed: undefined });
          path.splice(i, 0, { current: path[0].expected, date: path[i].date, actualDate: path[i].actualDate, expected: undefined, completed: undefined });
          break;
        }
      }
      // Remove null completed points and condense datess
      path = path.map(point => ({ 
        completed: point.completed !== null ? point.completed : undefined,
        expected: point.expected,
        date: point.date.substr(5, 6)
      }));
      // Add the today mark
      setPath(path);
    }
  }, [loading, burndownPath, windowWidth]);
  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <div className={classes.loadingContent}>
          <CircularProgress color="inherit" />
          <Typography className={classes.loadingText}>Generating Burndown</Typography>
        </div>
      </div>
    );
  }
  const LegendRootComponent = ({ children }) => (
    <div className={classes.legendRootComponentContainer}>
      <div className={classes.legendRoodComponentContent}>
        {children}
      </div>
    </div>
  );
  // Keep track of how many dates are rendered
  let count = 0;
  return (
    <div ref={chartContainerRef}>
      <Chart data={path}>
        <Title text={name}/>
        {/*<Legend position="bottom" rootComponent={LegendRootComponent} />*/}
        <ArgumentAxis showGrid labelComponent={(props: ArgumentAxis.LabelProps) => {
          // Increment the count
          count += 1;
          // Only render multiples of the number of values per point
          if (count % valuesPerDate === 0) {
            return <ArgumentAxis.Label {...props}/>;
          }
          return null;
        }} />
        <ValueAxis showGrid />
        <LineSeries name="Expected Path" valueField="expected" argumentField="date" color="blue"/>
        <ScatterSeries valueField="expected" argumentField="date" color="blue" />
        <LineSeries name="Current Path" valueField="completed" argumentField="date" color="red"/>
        <ScatterSeries valueField="completed" argumentField="date" color="red" />
        <LineSeries name="Today" valueField="current" argumentField="date" color="green"/>
      </Chart>
    </div>
  );
};

export default BurndownChart;
