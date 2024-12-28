const getIndex = (req,res) => {
    res.send({
        title:"ClassRoom Manager",
        content:'welcome',
    })
    res.end();
}

const getDash = (req,res, next) => {
    if (req.user) {
        console.log(req.user);
        console.log(req.session)
        res.send({
            title:"Welcome to the app",
            user: req.user,
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