import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';

import NoteApp from './components/NoteApp';


const mountNode = document.getElementById('root');

function fetchQuery(
  operation,
  variables,
) {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}

const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query appQuery {
        viewer {
          ...NoteApp_viewer
        }
      }
    `}
    variables={{}}
    render={({error, props}) => {
      if (props) {
        return <NoteApp notes={props.viewer.notes} viewer={props.viewer} />;
      } else {
        return <div>Loading</div>;
      }
    }}
  />,
  mountNode
);
