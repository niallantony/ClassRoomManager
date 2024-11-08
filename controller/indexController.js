const getIndex = (req,res) => {
    res.render('layout', {
        title:"Niall's App",
        content:'welcome'
    })
}

const get404 = (req, res) => {
    res.render('layout', {
        title:'404',
        content: 'partials/404'
    })
}

module.exports = {
    getIndex,
    get404,
}