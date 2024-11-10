const getIndex = (req,res) => {
    res.render('layout', {
        title:"Niall's App",
        content:'welcome',
    })
    res.end();
}

const getDash = (req,res, next) => {
    if (req.user) {
        console.log(req.user);
        console.log(req.session)
        res.render('dashboard', {
            title:"Dashboard",
            content:'splash',
            user:req.user,
        })
    } else {
        console.log("No session found...") 
        next();
    }
}

module.exports = {
    getIndex,
    getDash,
}