module.exports = function (req, res, next) {

	if (req.session.log)
	{
		res.locals.log = req.session.log;
	}

	req.log = function (user) {
		// if (req.session.log == undefined)
		// {
			req.session.log = user;
			console.log(req.session);
		// }
	}
	next();
}