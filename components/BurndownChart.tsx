import React, { FunctionComponent, useRef, useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import { Chart, LineSeries, ScatterSeries, ValueAxis, ArgumentAxis, Title, Legend } from '@devexpress/dx-react-chart-material-ui';
import { useWindowWidth } from '@react-hook/window-size/throttled';

type BurndownPoint = {
  date: Date,
  expected: number,
  completed: number
};

type BurndownChartPoint = BurndownPoint & {
  current?: number;
  label?: string;
};

type BurndownChartProps = {
  loading: boolean,
  path: BurndownPoint[],
  name?: string
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
  const [valuesPerDate, setValuesPerDate] = useState(8);
  const theme = useTheme();
  useEffect(() => {
    if (chartContainerRef.current) {
      // Calculate the maximum number of datess that will fit
      const maxDates = Math.floor(chartContainerRef.current.clientWidth / 40);
      // Get the number of values per date
      const valuesPerDate = Math.ceil(burndownPath.length / maxDates);
      // Set the values per date state variable
      setValuesPerDate(valuesPerDate);
      // Convert the path
      let path = burndownPath as BurndownChartPoint[];
      // Add the today line
      for (let i = 0; i < path.length; i += 1) {
        if (path[i + 1]) {
          if ((path[i].date as Date).getTime() <= Date.now() && (path[i + 1].date as Date).getTime() >= Date.now()) {
            path.splice(i, 0, { current: 0, date: path[i].date, expected: undefined, completed: undefined });
            path.splice(i, 0, { current: Math.max(path[0].completed, path[0].expected), date: path[i].date, expected: undefined, completed: undefined });
            break;
          }
        } else {
          path.splice(i, 0, { current: 0, date: path[i].date, expected: undefined, completed: undefined });
          path.splice(i, 0, { current: Math.max(path[0].completed, path[0].expected), date: path[i].date, expected: undefined, completed: undefined });
          break;
        }
      }
      // Remove null completed points and condense datess
      path = path.map(point => ({ 
        ...point,
        label: point.date.toISOString().substr(5, 5)
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
  // Keep track of how many dates are rendered
  let count = 0;
  const labelStyle = { fill: theme.palette.text.primary, fontWeight: 500, fontFamily: 'Arial', fontSize: 16 };
  return (
    <div style={{ display: 'flex', fontFamily: 'Arial' }}>
      <div style={{ width: 48, display: 'flex', flexDirection: 'column' }}>
        <div style={{ writingMode: 'vertical-lr', margin: 'auto', transform: 'rotate(180deg)', fontSize: 22 }}>Story Points</div>
      </div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <div ref={chartContainerRef} style={{ flex: 1 }}>
          <Chart data={path}>
            <Title text={name}/>
            {/*<Legend position="bottom" rootComponent={LegendRootComponent} />*/}
            <ArgumentAxis showGrid labelComponent={(props: ArgumentAxis.LabelProps) => {
              // Increment the count
              count += 1;
              // Only render multiples of the number of values per point
              if (count % valuesPerDate === 0) {
                return <ArgumentAxis.Label style={labelStyle} {...props}/>;
              }
              return null;
            }} />
            <ValueAxis showGrid labelComponent={props => <ValueAxis.Label style={labelStyle} {...props} />} />
            <LineSeries name="Expected Path" valueField="expected" argumentField="label" color="blue"/>
            <ScatterSeries valueField="expected" argumentField="label" color="blue" />
            <LineSeries name="Current Path" valueField="completed" argumentField="label" color="red"/>
            <ScatterSeries valueField="completed" argumentField="label" color="red" />
            <LineSeries name="Today" valueField="current" argumentField="label" color="green"/>
          </Chart>
        </div>
        <p style={{ margin: 'auto', marginTop: 8, fontSize: 22 }}>Date</p>
      </div>
    </div>
  );
};

export default BurndownChart;
