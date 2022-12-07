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
        res.render('pages/create_survey', { errors, type });
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
    Survey.find({})
        .then(survey => {
            res.send(survey);
        })
        .catch(err => {
            res.status(500).send({ messange: 'internal error occured' });
        })
}