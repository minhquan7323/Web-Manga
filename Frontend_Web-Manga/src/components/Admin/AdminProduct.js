import TableComponent from "../Table";

function AdminProduct() {
    return (
        <>

            <div className='admin-system-content-right bg'>
                <div className="admin-title">
                    <div>Product management</div>
                </div>
            </div>

            <div className='admin-system-content-right bg'>
                <div className="admin-product-add-product">
                    <button type="button" class="btn btn-outline-success">Add product</button>
                </div>
                <TableComponent />
            </div>
        </>
    );
}

export default AdminProduct;
