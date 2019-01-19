import React from 'react'
import PropTypes from 'prop-types'

function Marker(props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '12px',
        height: '12px',
        backgroundColor: '#fff',
        border: '1px solid #000',
        borderRadius: '100%',
        userSelect: 'none',
        transform: 'translate(-50 %, -50 %)',
        cursor: '${ props => (props.onClick ? pointer : default) }'
      }}
      {...props.onClick ? { onClick: props.onClick } : {}}
      alt={props.text}
    >
    </div>
  )
}

Marker.defaultProps = {
  onClick: null,
}

Marker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
}

export default Marker;

