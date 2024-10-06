import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import * as UserService from '../services/UserService.js'
import { useState } from 'react';
import { useMutationHooks } from '../hooks/useMutationHook.js';
import Loading from '../components/Loading/Loading.js'
function SignInPage() {
    // sign in
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const mutation = useMutationHooks(
        data => UserService.signInUser(data)
    )

    const { data } = mutation
    const isLoading = mutation.isPending

    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePassword = (value) => {
        setPassword(value)
    }
    const handleSignIn = () => {
        mutation.mutate({
            email,
            password
        })
    }

    return (
        <>
            <button type="button" className="btn btn-primary signin-button" data-bs-toggle="modal" data-bs-target="#signInModal">
                Sign In
            </button>
            <div className="modal fade user-backdrop" id="signInModal" data-bs-backdrop="false" data-bs-keyboard="true" tabIndex="-1" aria-labelledby="signInModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="signInModalLabel">Sign In</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="email" placeholder="name@example.com" value={email} onChange={(e) => handleOnChangeEmail(e.target.value)} />
                                <label htmlFor="email">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => handleOnChangePassword(e.target.value)} />
                                <label htmlFor="password">Password</label>
                            </div>
                            {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                            <p className="text-muted">Forget password?</p>
                            <p className="text-muted">
                                Don't have an account?
                                <span href="#" className='label-signinup' data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#signUpModal" >
                                    Sign Up
                                </span>
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <Loading isLoading={isLoading}>
                                <button type="button" className="btn btn-primary" onClick={handleSignIn}>
                                    Sign In
                                </button>
                            </Loading>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignInPage;
