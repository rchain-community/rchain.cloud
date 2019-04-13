import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import { toggleSettingsModal } from '../../actions'
import styles from './settings_modal.css'
import theme from '../../theme/theme.css'

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0, 0.3)',
    zIndex: 1000
  },
  content: {
    backgroundColor: 'rgba(34, 39, 51, 0.8)',
    zIndex: 1100,
    border: '1px solid rgba(173, 0, 48, 0.5)',
    position: 'fixed',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: 500,
    height: 500,
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

class SettingsModal extends Component {
  componentWillMount() {
    Modal.setAppElement('#root')
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.settings.modal.open}
          onRequestClose={this.props.toggleSettingsModal}
          style={customStyles}
          contentLabel='Settings modal'
        >
          <div className={[styles.modalContainer, theme.primaryText].join(' ')}>
            <span className={styles.settingsModalTitle}> About rchain.cloud</span>
            <span> Here are some resources to get you started on rholang: </span>
            <span> https:\/\/developer.rchain.coop </span>
            <span> rchain.cloud currently uses rnode v0.7.1. </span>
            <span> Have fun. </span>
          </div>
        </Modal>
      </div>
    )
  }
}

SettingsModal.propTypes = {
  settings: PropTypes.object,
  toggleSettingsModal: PropTypes.func
}

function mapStateToProps(state) {
  return {
    settings: state.settings
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleSettingsModal: toggleSettingsModal
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal)
