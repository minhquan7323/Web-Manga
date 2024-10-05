import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

function SignInPage() {
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
                                <input type="email" className="form-control" id="signInEmail" placeholder="name@example.com" />
                                <label htmlFor="signInEmail">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="signInPassword" placeholder="Password"
                                />
                                <label htmlFor="signInPassword">Password</label>
                            </div>
                            <p className="text-muted">Forget password?</p>
                            <p className="text-muted">
                                Don't have an account?
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signUpModal">
                                    Sign Up
                                </button>
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="button" className="btn btn-primary">
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade user-backdrop" id="signUpModal" data-bs-backdrop="false" data-bs-keyboard="true" tabIndex="-1" aria-labelledby="signUpModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="signUpModalLabel">Sign Up</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="signUpEmail" placeholder="name@example.com" />
                                <label htmlFor="signUpEmail">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="signUpPassword" placeholder="Password" />
                                <label htmlFor="signUpPassword">Password</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" />
                                <label htmlFor="confirmPassword">Confirm Password</label>
                            </div>
                            <button type="button" className="btn btn-primary signin-button" data-bs-toggle="modal" data-bs-target="#signInModal">
                                Sign In
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="button" className="btn btn-primary">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignInPage;
