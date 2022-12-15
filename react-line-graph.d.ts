type Data = {
    x: number;
    y: number;
};

declare module "react-line-graph" {
  import React from 'react';

  interface LineGraphProps {
      data: Data[];
      smoothing?: number;
      width?: string;
      height?: string;
      hover?: boolean;
      fillBelow?: string;
      accent?: string;
      strokeWidth?: string;
      onHover?: () => {};
      compression?: number;
  }

    declare const LineGraph: (props: LineGraphProps) => React.SFC<LineGraphProps>
    export default LineGraph
}
