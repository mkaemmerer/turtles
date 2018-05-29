import React from 'react';
import { V2 } from 'utils/vectors';
import Measured from 'components/generic/measured';


//Component
const ManageState = (Canvas) => {
  class MeasuredCanvas extends React.Component {
    constructor() {
      super();
      this.state = {
        canvasCenter: V2(400, 300)
      };
    }

    onResize = ({width, height}) => {
      this.setState({ canvasCenter: V2(width/2, height/2) });
    }

    render() {
      const { canvasCenter } = this.state;
      return (
        <Measured onResize={this.onResize}>
          {(ref) => (
            <Canvas
              {...this.props}
              canvasCenter={canvasCenter}
              canvasRef={ref}
            />
          )}
        </Measured>
      );
    }
  }
  return MeasuredCanvas;
}

export default ManageState;
