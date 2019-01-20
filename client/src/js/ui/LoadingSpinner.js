import React, { Component } from 'react'
import LoadingImage from '../../assets/loading.gif'

export default class LoadingSpinner extends Component {
  render() {
    return (
      <div style={{ display: 'block' }}>
        <img src={LoadingImage} alt={'Loading ...'} />
      </div>
    );
  }
}
