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

type BurndownChartPoint = BurndownPoint & {
  current?: number;
  actualDate?: Date;
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

const condenseData = (burndownPath: BurndownChartPoint[], maxDates: number): BurndownChartPoint[] => {
  let path = burndownPath;
  if (burndownPath.length / maxDates > 1) {
    path = [];
    const valuesPerPoint = Math.ceil(burndownPath.length / maxDates);
    for (let i = 0; i < maxDates; i += 1) {
      if (burndownPath[i * valuesPerPoint]) {
        const date = burndownPath[i * valuesPerPoint].date;
        let completed = 0;
        let expected = 0;
        for (let j = 0; j < valuesPerPoint; j += 1) {
          if (burndownPath[(i * valuesPerPoint) + j]) {
            if (burndownPath[(i * valuesPerPoint) + j].completed) {
              completed += burndownPath[(i * valuesPerPoint) + j].completed;
            }
            expected += burndownPath[(i * valuesPerPoint) + j].expected;
          }
        }
        path.push({
          date,
          expected,
          completed: burndownPath[i * valuesPerPoint].completed ? completed : undefined
        });
      }
    }
  }
  return path.map(point => ({ completed: point.completed, expected: point.expected, date: point.date.substr(5, 6), actualDate: new Date(point.date) }));
};

const BurndownChart: FunctionComponent<BurndownChartProps> = ({ loading, path: burndownPath, name }) => {
  const classes = useStyles({});
  const windowWidth = useWindowWidth();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<BurndownPoint[]>([]);
  useEffect(() => {
    if (chartContainerRef.current) {
      const maxDates = Math.floor(chartContainerRef.current.clientWidth / 45);
      // Condense the data
      const path = condenseData(burndownPath, maxDates);
      for (let i = 0; i < path.length; i += 1) {
        if (path[i].actualDate.getTime() <= Date.now() && path[i + 1].actualDate.getTime() >= Date.now()) {
          path.splice(i, 0, { current: 0, date: path[i].date, actualDate: path[i].actualDate, expected: undefined, completed: undefined });
          path.splice(i, 0, { current: path[0].expected, date: path[i].date, actualDate: path[i].actualDate, expected: undefined, completed: undefined });
          break;
        }
      }
      console.log(path);
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
  return (
    <div ref={chartContainerRef}>
      <Chart data={path}>
        <Title text={name}/>
        {/*<Legend position="bottom" rootComponent={LegendRootComponent} />*/}
        <ArgumentAxis showGrid />
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
