import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';

import { sourceUrlToBookmark } from './source-url-to-bookmark';

export interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>;
}
export interface Sinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
}
export interface Reducer {
  (prev: State): State;
}
export interface State {
  sourceUrl: string;
  resultString: string;
}
export interface Actions {
  sourceUrlChange$: Stream<string>;
}

export function App(sources: Sources): Sinks {
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$);
  const vdom$ = view(sources.onion.state$);

  return {
    DOM: vdom$,
    onion: reducer$,
  };
}

function intent(DOM: DOMSource): Actions {
  const sourceUrlChange$ = DOM.select('.source-url')
    .events('change')
    .map(ev => (ev.target as HTMLInputElement).value);

  return {
    sourceUrlChange$,
  };
}

function model(actions: Actions): Stream<Reducer> {
  const initReducer$ = xs.of<Reducer>((prev: State) => {
    return prev || {
      sourceUrl: '',
      resultString: '',
    };
  });

  const addReducer$ = actions.sourceUrlChange$
    .map<Reducer>(sourceUrl => prev => {
      return {
        ...prev,
        sourceUrl,
        resultString: sourceUrlToBookmark(sourceUrl),
      };
    });

  return xs.merge(initReducer$, addReducer$);
}

function view(state$: Stream<State>): Stream<VNode> {
  return state$.map(({ sourceUrl, resultString }) =>
    <div>
      <div>
        <h4>Insert script url:</h4>
        <input className="source-url" value={ sourceUrl } />
      </div>
      <div>
        <h4>Result string:</h4>
        <textarea>{ resultString }</textarea>
      </div>
      <div>
        Use <a href="https://rawgit.com/" target="_blank">https://rawgit.com/</a>
      </div>
    </div>
  );
}
