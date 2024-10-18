import TableComponent from "../Table";

function AdminUser() {
    return (
        <>

            <div className='admin-system-content-right bg'>
                <div className="admin-title">
                    <div>User management</div>
                </div>
            </div>

            <div className='admin-system-content-right bg'>
                <div className="admin-product-add-user">
                    <button type="button" className="btn btn-outline-success">Add user</button>
                </div>
                <TableComponent />
            </div>
        </>
    );
}

export default AdminUser;
