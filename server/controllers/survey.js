let Survey = require('../model/survey');

exports.AddSurvey = (req, res, next) => {
    const errors = [];

    type = req.query.type;
    console.log(`Type is ${type}`)
    const { title, option1, option2, option3, expires } = req.body;

    if (!title || !expires) {
        errors.push({ message: 'Please fill all the fields' });
    }

    if ((!option1 || !option2 || !option3) && type == 'MCQ') {
        errors.push({ message: 'MCQ survey must contain 3 options' });
    }

    if (!(/^\d{4}-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(expires))) {
        errors.push({ message: 'Invalid date format. It should be in yyyy-mm-dd' });
    }

    if (errors.length > 0) {
        res.render('pages/create_survey', { title: 'EasySurveys - Create Surveys', errors, type });
        return;
    }

    let newSurvey = Survey(
        {
            "title": title,
            "type": type,
            "choices": [option1, option2, option3],
            "creator": req.user.email,
            "created": new Date(),
            "expires": new Date(expires),
        }
    );

    newSurvey
        .save(newSurvey)
        .then(data => {
            req.flash('success_msg', 'Survey Created Sucessfully');
            res.redirect('/surveys');
        })
        .catch(e => {
            console.log("message:" + e)
            req.flash('error_msg', e);
            res.redirect('/surveys');
        })
}


exports.GetSurvey = (req, res, next) => {
    const email = req.query.email;
    const id = req.query.id;
    if (id) {
        Survey.find({ _id: id })
            .then(survey => {
                if (survey) {
                    let expiresAfter = Math.round(Math.abs((survey[0].expires - new Date()) / 86400000));
                    survey.push({ expiresAfter: expiresAfter });
                    res.status(200).send(survey);

                } else {
                    res.status(404).send({ message: `No active surveys` });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ message: err });
            })
    } else if (email) {
        Survey.find({ email: email })
            .then(survey => {
                if (survey) {
                    res.status(200).send(survey);

                } else {
                    res.status(404).send({ message: `No active surveys` });

                }
            })
            .catch(err => {
                res.status(500).send({ message: 'some internal error occured' });
            })
    } else {
        Survey.find({})
            .then(survey => {
                res.send(survey);
            })
            .catch(err => {
                res.status(500).send({ message: 'internal error occured' });
            })
    }
}

exports.AddResponse = (req, res) => {
    console.log(req.body);
    if (!req.body) {
        return res.status(400).send({ message: 'Response Cannot be Empty' });
    }

    const id = req.params.id;
    console.log(id);
    Survey.updateOne({ _id: id }, { $push: { responses: req.body.response }, $inc: { totalResponses: 1 } })
        .then(survey => {
            if (!survey) {
                res.status(404).send({ message: `Survey Doesn't exist` });
            } else {
                req.flash('sucess_msg', 'Response Sent Sucessfully');
                res.redirect('/guest')
            }
        })
        .catch(err => {
            res.status(500).send({ message: `${err}` });
        })
}

exports.Edit = (req, res) => {

    const errors = [];

    type = req.query.type;

    if (!req.body) {
        errors.push({ message: 'Data to be updated cannot be empty' });
    }
    const { title, option1, option2, option3, expires } = req.body;

    if (!title || !expires) {
        errors.push({ message: 'Please fill all the fields' });
    }
    if ((!option1 || !option2 || !option3) && type == 'MCQ') {
        errors.push({ message: 'MCQ survey must contain 3 options' });
    }
    if (!(/^\d{4}-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(expires))) {
        errors.push({ message: 'Invalid date format. It should be in yyyy-mm-dd' });
    }
    if (errors.length > 0) {
        res.render('pages/create_survey', { title: 'EasySurveys - Create Surveys', errors, type });
        return;
    }
    const id = req.params.id;
    Survey.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(survey => {
            if (!survey) {
                res.status(404).send({ message: `Survey couldn't be found` });
            } else {
                req.flash('success_msg', 'Survey Updated Sucessfully');
                res.redirect('/surveys');
            }
        })
        .catch(err => {
            req.flash('error_msg', e);
            res.redirect('/surveys');
        })
}

exports.Delete = (req, res) => {
    const id = req.params.id
    Survey.findByIdAndDelete(id)
        .then(survey => {
            if (!survey) {
                res.status(404).send({ message: `Survey Couldnt be found` });
            } else {
                res.status(200).send({ message: `Survey Deleted Sucessfully` });

            }
        })
        .catch(err => {
            res.send({ message: `${err}` });
        });
}