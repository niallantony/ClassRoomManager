const getIndex = (req,res) => {
    res.render('index', {
        title:"Niall's App"
    })
}

module.exports = {
    getIndex
}