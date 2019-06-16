import React, { Component } from 'react';
import { cloneDeep, isEmpty, debounce } from 'lodash';
import { Line as LineChart } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import { Flex, LineChartWrapper, Text, SliderLayoutPart, PointsSlider, StockSearch } from './styledComponents';
import { fetchUrl, catchFetchErrors } from './utils';
import * as constants from './constants';

class StockPrices extends Component {

  constructor(props) {
    super(props);
    this._chartRef = React.createRef();
    this._debouncedStockSearch = debounce(this._onStockSearch, 1000);
    this.state = {
      loading: true,
      errorMessage: '',
      stocksData: {},
      chartData: {},
      chartOptions: {},
      numberOfDataPoints: 0,
      stockSearchReaults: []
    };
  }

  componentDidMount() {
    this._fetchStock(constants.DEFAULT_STOCK);
  }

  render() {
    return (
      <Flex>
        {
          this.state.errorMessage
          ? <div>{this.state.errorMessage}</div>
          : this.state.loading 
          ? <div>Loading...</div> 
          : <div>
              <LineChartWrapper>
                <LineChart 
                  ref={this._chartRef} 
                  data={this.state.chartData} 
                  options={this.state.chartOptions} 
                />
              </LineChartWrapper>
              <div>
                <SliderLayoutPart>
                  <Text>Displaying {this.state.numberOfDataPoints} data points. Use the slider to change that:</Text>
                </SliderLayoutPart>
                <SliderLayoutPart>
                  <PointsSlider min={1} max={constants.MAX_DATAPOINTS} defaultValue={constants.MAX_DATAPOINTS} onAfterChange={this._onPointsSliderChanged} />
                </SliderLayoutPart>
              </div>
              <Text>Click the chart to add a threshold and mark the data points that exceed it.</Text>
              <StockSearch 
                dataSource={this.state.stockSearchReaults} 
                onChange={this._debouncedStockSearch} 
                onSelect={this._onStockSelect}
                placeholder={`${constants.DEFAULT_STOCK}`} />
            </div>
        }
      </Flex>
    );
  }

  _fetchStock = stock => {
    fetchUrl(`${constants.FETCH_URL}${stock}`)
    .then(stocksData => {
      const chartData = this._getChartData(stocksData[constants.TIMESERIES_KEY], constants.MAX_DATAPOINTS);
      const chartOptions = cloneDeep(constants.CHART_OPTIONS);
      chartOptions.onClick = this._onChartClick;
      this.setState({
        loading: false,
        stocksData,
        chartData,
        chartOptions,
        numberOfDataPoints: constants.MAX_DATAPOINTS
      });
    })
    .catch(catchFetchErrors);
  };

  _onStockSearch = stockName => {
    if (stockName.length) {
      fetchUrl(`${constants.SEARCH_URL}${stockName}`)
      .then(searchResults => {
        if (searchResults) {
          const stockSearchReaults = searchResults.bestMatches.reduce((resultsArr, currentResult) => {
            resultsArr.push(`${currentResult[constants.SEARCH_SYMBOL_KEY]} - ${currentResult[constants.SEARCH_NAME_KEY]}`);
            return resultsArr;
          }, []);
          this.setState({
            stockSearchReaults
          });
        }
      })
      .catch(catchFetchErrors);
    }
  };

  _onStockSelect = selectedStock => {
    this._fetchStock(selectedStock.split(' -')[0]);
  };

  _onPointsSliderChanged = newValue => {
    const chartData = this._getChartData(this.state.stocksData[constants.TIMESERIES_KEY], newValue);
    this.setState({
      numberOfDataPoints: newValue,
      chartData
    });
  };

  _onChartClick = chartClickEvent => {
    const { chartInstance } = this._chartRef.current;
    const clickedValue = chartInstance.scales[constants.Y_SCALE_ID].getValueForPixel(chartClickEvent.offsetY);
    this._updateThresholdAndDataPoints(clickedValue);
  };

  _updateThresholdAndDataPoints = thresholdValue => {
    const { chartInstance } = this._chartRef.current;
    const annotationElements = chartInstance.annotation.elements;
    if (isEmpty(annotationElements)) {
      const annotation = cloneDeep(constants.ANNOTATION);
      annotation.annotations[0].value = thresholdValue;
      chartInstance.options.annotation = annotation;
    } else {
      chartInstance.annotation.elements[constants.THRESHOLD_ANNOTATION_ID].options.value = thresholdValue;
    }
    chartInstance.data.datasets.forEach(dataSet => {
    dataSet.pointBackgroundColor = function(ctx) {
        const index = ctx.dataIndex;
        const value = ctx.dataset.data[index];
        return value > thresholdValue ? constants.POINT_COLORS.MARKED : constants.POINT_COLORS.DEFAULT;
      }
    });
    chartInstance.update();
  }

  _getChartData = (stockTimeSeries, numberOfDataPoints) => {
    const labels = [];
    const closeDataset = [];
    const timePoints = Object.keys(stockTimeSeries).sort();
    for (let i = timePoints.length - numberOfDataPoints; i < timePoints.length; i++) {
      const timePoint = timePoints[i];
      labels.push(timePoint);
      closeDataset.push(parseFloat(stockTimeSeries[timePoint][constants.TIMEPOINT_VALUE_KEY]));
    }
    return {
      labels,
      datasets: [
        {
          label: constants.DATASET_LABEL,
          pointBackgroundColor: constants.POINT_COLORS.DEFAULT,
          data: closeDataset
        }
      ]
    };
  }
}

export default StockPrices;
