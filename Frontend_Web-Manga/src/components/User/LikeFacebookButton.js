const LikeFacebookButton = ({ dataHref, width = '300' }) => {
    return (
        <div
            className="fb-like"
            data-href={dataHref}
            data-width={width}
            data-layout="standard"
            data-action="like"
            data-size="small"
            data-share="true"
            style={{
                margin: '10px 0 0 0'
            }}
        />
    )
}

export default LikeFacebookButton;
