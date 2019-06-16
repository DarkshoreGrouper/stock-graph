export const DEFAULT_STOCK = 'NVDA';
export const FETCH_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=5min&apikey=BUDYXWLWHCMVR5UC&symbol=';
export const SEARCH_URL = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&apikey=BUDYXWLWHCMVR5UC&keywords='
export const FETCH_TIMEOUT = 10000;
export const ERRORS = {
    GENERAL: 'Unable to load the chart',
    TIMEOUT: 'This is taking too long. Please try again later...'
}

export const MAX_DATAPOINTS = 40;

export const SEARCH_SYMBOL_KEY = '1. symbol';
export const SEARCH_NAME_KEY = '2. name';

export const TIMEPOINT_VALUE_KEY = '4. close';
export const TIMESERIES_KEY = 'Time Series (5min)';

export const DATASET_LABEL = 'Stock close value';

export const POINT_COLORS = {
    DEFAULT: 'blue',
    MARKED: 'red'
};

export const THRESHOLD_ANNOTATION_ID = 'threshold';
export const Y_SCALE_ID = 'y-axis-0';

export const ANNOTATION = {
  annotations: [{
     type: 'line',
     id: THRESHOLD_ANNOTATION_ID,
     mode: 'horizontal',
     scaleID: Y_SCALE_ID,
     value: 0, 
     borderWidth: 2,
     borderColor: 'black',
     borderDash: [4, 4]
  }]
};

export const CHART_OPTIONS = {
  bezierCurve: false,
  pointHitDetectionRadius: 5,
  scales: {
    xAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Date'
      }
    }, ],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Stock Value'
      }
    }]
  }
};