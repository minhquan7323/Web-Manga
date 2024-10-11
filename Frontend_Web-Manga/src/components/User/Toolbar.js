function Toolbar() {
    return (
        <div className="toolbar col-lg-4 col-md-6 col-sm-6 col-xs-6 col-12">
            <select className="form-select" defaultValue='1'>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
        </div>
    )
}
export default Toolbar;