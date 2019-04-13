import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import { toggleAboutModal } from '../../actions'
import styles from './about_modal.css'
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

class AboutModal extends Component {
  componentWillMount() {
    Modal.setAppElement('#root')
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.opened}
          onRequestClose={this.props.toggleAboutModal}
          style={customStyles}
          contentLabel='About modal'
        >
          <div className={[styles.modalContainer, theme.primaryText].join(' ')}>
            <span className={styles.settingsModalTitle}> About </span>
            <span> Find some infos to start at developer.rchain.cloud </span>
            <span> rchain.cloud currently works with rnode v0.7.1 </span>
            <span> Have fun.</span>
          </div>
        </Modal>
      </div>
    )
  }
}

AboutModal.propTypes = {
  opened: PropTypes.bool,
  toggleAboutModal: PropTypes.func
}

function mapStateToProps(state) {
  return {
    opened: state.settings.aboutModalOpen
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleAboutModal: toggleAboutModal
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutModal)
