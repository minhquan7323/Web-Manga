const LikeFacebookButton = (props) => {
    const { dataHref } = props
    return (
        <div className="fb-like" data-href={dataHref} data-width="" data-layout="" data-action="" data-size="" data-share="true" style={{ margin: '10px 0' }}>
        </div>
    )
}

export default LikeFacebookButton