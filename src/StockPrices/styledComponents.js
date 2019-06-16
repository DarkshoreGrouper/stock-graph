import styled from 'styled-components';
import { Slider, AutoComplete } from 'antd'; 

export const Flex = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px;
`;

export const LineChartWrapper = styled.div`
  width: 1200px;
  margin-bottom: 50px;
`;

export const Text = styled.div`
  font-size: 20px;
  line-height: 40px;
`;

export const SliderLayoutPart = styled.div`
  display: inline-block;
  margin-right: 30px;
  vertical-align: bottom;
`;

export const PointsSlider = styled(Slider)`
  width: 300px;
`;

export const StockSearch = styled(AutoComplete)`
  width: 300px;
`;