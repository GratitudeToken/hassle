export const queryParams = () => {
    const urlString = window.location.search;
    const urlSearch = new URLSearchParams(urlString);

    let q = {}
    let s = urlSearch.get('search')
    let u = urlSearch.get('user')

    s ? q.s = s : null

    if (u && u != undefined && u != 'undefined' && u != null && u != 'null' && u != 'false' && u != 'true') {
        q.u = u
    }

    return q
}
