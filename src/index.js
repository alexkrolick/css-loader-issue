import React from "react";
import ReactDOM from "react-dom";



class App extends React.Component {
  state = {
    component: null
  };

  load = () => {
    import('./Demo/Demo.js').then(d => {
      this.setState({
        component: d.default
      })
    });
  }

  render() {
    if(this.state.component) {
      const Comp = this.state.component;
      return <Comp />
    }
    return (
      <div>
        <button onClick={this.load}>load Demo</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("react-app"));

if(module.hot) {
  module.hot.accept();
}
