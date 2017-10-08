import React from "react";

import Styles from "./Demo.less";

export default class Demo extends React.Component {
  render() {
    return (
      <div className={Styles.Demo}>
        Am I Red?
      </div>
    )
  }
}