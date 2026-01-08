import { all, fork } from 'redux-saga/effects';
import { authSaga } from './ducks/auth.duck';
import { productsSaga } from './ducks/products.duck';

export function* rootSaga() {
    yield all([fork(authSaga), fork(productsSaga)]);
}
