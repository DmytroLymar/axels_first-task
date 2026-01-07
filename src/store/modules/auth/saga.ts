import { delay, put, takeLatest } from 'redux-saga/effects';
import { authActions } from './duck';

function* loginWorker(action: ReturnType<typeof authActions.loginRequest>) {
    try {
        yield delay(400);

        const { email } = action.payload;

        yield put(
            authActions.loginSuccess({
                id: 'u1',
                name: 'Demo User',
                email
            })
        );
    } catch {
        yield put(authActions.loginFailure('Login failed'));
    }
}

export function* authSaga() {
    yield takeLatest(authActions.loginRequest.type, loginWorker);
}
