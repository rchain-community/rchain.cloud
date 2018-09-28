import React, { Component } from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import theme from '../../theme/theme.css'
import styles from './console.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Console extends Component {
  render() {
    return (
      <div className={[styles.consoleContainer, theme.consoleContainer].join(' ')}>
        <div className={[styles.consoleHeader, theme.consoleHeader].join(' ')}>
          <div className={styles.consoleHeaderTitleContainer}>
            <FontAwesomeIcon className={styles.consoleHeaderIcon} icon='terminal' size='xs' />
            <span className={styles.consoleHeaderTitle}>Output</span>
          </div>
        </div>
        <div className={[styles.consoleContent, theme.consoleText].join(' ')}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio voluptate dolorem obcaecati iure! Veniam rerum voluptas accusantium necessitatibus quidem eligendi illo nostrum deleniti debitis magni nam cum, minus repellendus aperiam quae nesciunt sequi ex incidunt eaque, aspernatur iure? Libero, reprehenderit. Nostrum, eius porro velit animi cum, quis voluptas distinctio suscipit voluptatem ex pariatur recusandae culpa atque ab sapiente? Suscipit praesentium temporibus iusto dignissimos animi delectus perspiciatis maiores ea debitis molestias fuga molestiae unde sed, quasi inventore doloremque cum deleniti illum ex pariatur sunt esse hic optio quos? Eius veniam possimus similique repudiandae. Omnis quaerat impedit recusandae facilis sapiente dolore consequatur dolor optio illum laudantium voluptates reprehenderit fugit, neque quisquam labore. Magnam aperiam corrupti excepturi ad eum esse velit illum vitae!
        </div>
      </div>
    )
  }
}

export default Console
