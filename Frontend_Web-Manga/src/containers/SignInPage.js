import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import * as UserService from '../services/UserService.js'
import { useState } from 'react';
import { useMutationHooks } from '../hooks/useMutationHook.js';
import Loading from '../components/Loading/Loading.js'
import { NavLink } from 'react-router-dom';

function SignInPage() {
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
            <div class="container signin-up">
                <div class="row justify-content-center">
                    <div class="card form-signin-up col-11 col-xs-12 col-sm-10 col-md-8 col-lg-6">
                        <div class="card-body">
                            <div className="header">
                                <h1 className="fs-5">Sign In</h1>
                            </div>
                            <div className="body">
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control" id="email" placeholder="name@example.com" value={email} onChange={(e) => handleOnChangeEmail(e.target.value)} required />
                                    <label htmlFor="email">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => handleOnChangePassword(e.target.value)} required />
                                    <label htmlFor="password">Password</label>
                                </div>
                                {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                                <p className="text-muted">Forget password?</p>
                                <p className="text-muted">
                                    Don't have an account?
                                    <NavLink to='/signup' className='label-signinup'>
                                        Sign Up
                                    </NavLink>
                                </p>
                            </div>
                            <div className="footer">
                                <Loading isLoading={isLoading}>
                                    <button type="button" className="btn btn-primary" onClick={handleSignIn}>
                                        Sign In
                                    </button>
                                </Loading>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignInPage;
