function Toolbar({ onSortChange }) {
    return (
        <div className="toolbar col-lg-3 col-md-6 col-sm-6 col-xs-6 col-12">
            <select id="sortPrice" className="form-select" defaultValue="" onChange={(e) => onSortChange(e.target.value)}>
                <option value="">Sort by price</option>
                <option value="dec">High to low</option>
                <option value="asc">Low to high</option>
            </select>
        </div>
    )
}
export default Toolbar