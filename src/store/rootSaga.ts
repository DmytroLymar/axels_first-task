import { all, fork } from 'redux-saga/effects';
import { authSaga } from './modules/auth/saga';
import { productsSaga } from './modules/products/saga';

export function* rootSaga() {
    yield all([fork(authSaga), fork(productsSaga)]);
}
