import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Switch from 'react-toggle-switch'
import './switch.css'

class ToggleSwitch extends Component {
  render() {
    return (
      <Switch
        on={this.props.enabled}
        onClick={this.props.onClick}
        className={this.props.className}
      />
    )
  }
}

ToggleSwitch.propTypes = {
  className: PropTypes.string,
  enabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

export default ToggleSwitch
