import React from 'react';
import ReactDOM from 'react-dom';
import StockPrices from './StockPrices/StockPrices';
import 'antd/dist/antd.css';
import './index.css';
import { defaults } from 'react-chartjs-2';

defaults.global.defaultFontFamily = "'Lato', sans-serif";

ReactDOM.render(<StockPrices />, document.getElementById('root'));
