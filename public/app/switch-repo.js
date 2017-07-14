import React from 'react';
import ReactDOM from 'react-dom';

export default class SwitchRepo extends React.Component {
  _switchRepo(evt) {
    console.log(evt);
    evt.preventDefault();
    const form = evt.target;
    const repo = form.children[0].value;
    fetch('/switchRepo', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({repo: repo})
    }).then(response => {
      return response.json();
    }).then(data => {
      console.log(data);
     });
  }

  render() {
    return (<form onSubmit={this._switchRepo}>
      <input name="branch" />
      <input type="submit" value="Switch" />
    </form>);
  }
}
