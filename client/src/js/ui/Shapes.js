import React, { PureComponent } from 'react'
import Polyline from './Polyline';

export default class Shapes extends PureComponent {
  render() {
    const { shape, map, maps , shapeColor} = this.props;
    return (
      shape.map((element, i) => {
        const origin = {
          lat: element.shape_pt_lat,
          long: element.shape_pt_lon
        };
        const dest = {
          lat: shape[i + 1] ? shape[i + 1].shape_pt_lat : origin.lat,
          long: shape[i + 1] ? shape[i + 1].shape_pt_lon : origin.long
        };
        return (
          <Polyline
            key={i}
            map={map}
            maps={maps}
            origin={origin}
            destination={dest}
            color={shapeColor}
          />
        );
      })
    )
  }
}
