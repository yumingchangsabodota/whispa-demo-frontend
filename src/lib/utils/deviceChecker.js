function IsMobile(){
    let isMobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
    (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform))) {
        isMobile = true;
        return isMobile
    }
    return isMobile
}

export default IsMobile