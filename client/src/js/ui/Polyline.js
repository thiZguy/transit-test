// eslint-disable-next-line no-unused-vars
import React, { PureComponent } from 'react';

export default class Polyline extends PureComponent {

  componentWillUpdate() {
    this.line.setMap(null)
  }

  componentWillUnmount() {
    this.line.setMap(null)
  }

  getPaths() {
    const { origin, destination } = this.props

    return [
      { lat: Number(origin.lat), lng: Number(origin.long) },
      { lat: Number(destination.lat), lng: Number(destination.long) }
    ];
  }

  render() {
    const { maps, map } = this.props;
    if(!maps){
      return null;
    }

    const Polyline = maps.Polyline

    const renderedPolyline = this.renderPolyline()
    const paths = { path: this.getPaths() }

    this.line = new Polyline(Object.assign({}, renderedPolyline, paths))

    this.line.setMap(map)

    return null
  }

  renderPolyline() {
    return {
      geodesic: true,
      strokeColor: this.props.color || 'blue',
      strokeOpacity: 1,
      strokeWeight: 4
    };
  }

}


// TESTING
// eslint-disable-next-line no-unused-vars
class Normal extends Polyline {

  renderPolyline() {
    return {
      geodesic: true,
      strokeColor: this.props.color || '#ffffff',
      strokeOpacity: 1,
      strokeWeight: 4
    }
  }
}