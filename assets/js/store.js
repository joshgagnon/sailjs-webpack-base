import { createStore, applyMiddleware, compose } from 'redux';
import appReducer from './reducers';
import createHistory from 'history/lib/createBrowserHistory';
import { reduxReactRouter } from 'redux-router';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { stopSubmit } from 'redux-form/lib/actions';
import { callAPIMiddleware } from './middleware';

let data;

try{
    data = JSON.parse(document.getElementById("data").textContent);
}catch(e){
    //do nothing
}


const loggerMiddleware = createLogger();

const createStoreWithMiddleware = compose(
applyMiddleware(
  thunkMiddleware,
  loggerMiddleware,
  callAPIMiddleware),
   reduxReactRouter({ createHistory })
)(createStore);


export default function configureStore(initialState=data) {
  return createStoreWithMiddleware(appReducer, initialState);
}