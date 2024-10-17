import { useLocation } from "react-router-dom";

function Footer() {
    const adminPath = useLocation().pathname.startsWith('/system/admin');

    return (
        <>
            {!adminPath ? (
                <footer>
                    <div className="bg footer">
                        <div className="footer-inner">
                            <h1>footer</h1>
                            <h1>footer</h1>
                            <h1>footer</h1>
                            <h1>footer</h1>
                        </div>
                    </div>
                </footer>
            ) : null}
        </>
    );
}

export default Footer;
