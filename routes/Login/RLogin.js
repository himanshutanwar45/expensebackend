const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const Login = require('../../model/Login/MLogin')
const os = require('os');
const bcrypt = require('bcryptjs')
const fetchuser = require('../../middleware/fetchuser')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

//Route 1 :::::::::POST ::::::::::::: Create User ::::::::::::::::::::::::::: /api/auth/createuser

router.post('/createuser', [
    body('firstName', 'Enter First Name').isLength({ min: 1 }),
    body('lastName', 'Enter Last Name').isLength({ min: 1 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 8 }),
    body('mobile', 'Enter 10 digit number').isLength({ min: 10, max:10 })

], async (req, res) => {

    const result = validationResult(req);
    let success = false;
    if (!result.isEmpty()) {
        return res.status(400).json({ success, error: result.errors[0].msg });
    }
    try {
        const { firstName, lastName, email, password, mobile, conPass } = req.body;

        let user = await Login.findOne({ email: email });

        if (user) {
            return res.status(200).json({ success, error: 'Email Already Exist !!!!' })
        }

        let findMobile = await Login.findOne({ mobile: mobile });

        if (findMobile) {
            return res.status(200).json({ success, error: 'Mobile Already Exist !!!!' })
        }

        const salt = await bcrypt.genSalt(10)
        let secPass = await bcrypt.hash(password, salt)
        let secConPass = await bcrypt.hash(conPass, salt)

        if (secPass !== secConPass) {
            return res.status(200).json({ success, error: 'Password is not same !!!!' })
        }

        const networkInterfaces = os.networkInterfaces();
        const staticIpAddresses = Object.keys(networkInterfaces)
            .reduce((ips, interfaceName) => {
                const interfaceInfo = networkInterfaces[interfaceName];
                const staticIpv4Addresses = interfaceInfo.filter(
                    info => info.family === 'IPv4' && !info.internal
                );
                return ips.concat(staticIpv4Addresses.map(info => info.address));
            }, []);

        const ipString = staticIpAddresses.join(', ');

        const userAgent = req.headers['user-agent'];

        user = await Login.insertMany({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: secPass,
            mobile: mobile,
            ipAddress: ipString,
            browserLogin: userAgent,
        })

        res.json({ success: true, error: "Operation Successfully" })

    } catch (error) {
        return res.status(500).json({ success, error: `Internal Error Occured ${error.message}` })
    }
});


//Route 2 :::::::::POST ::::::::::::Login User ::::::::::::::::::::::::::::: /api/auth/loginuser
router.post('/loginuser', [
    body('email', 'Enter Email').isEmail(),
    body('password', 'Enter Password').isLength({ min: 1 })
], async (req, res) => {
    let success = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(200).json({ success, error: result.errors[0].msg });
    }

    try {

        const networkInterfaces = os.networkInterfaces();
        const staticIpAddresses = Object.keys(networkInterfaces)
            .reduce((ips, interfaceName) => {
                const interfaceInfo = networkInterfaces[interfaceName];
                const staticIpv4Addresses = interfaceInfo.filter(
                    info => info.family === 'IPv4' && !info.internal
                );
                return ips.concat(staticIpv4Addresses.map(info => info.address));
            }, []);

        const ipString = staticIpAddresses.join(', ');

        const userAgent = req.headers['user-agent'];

        const { email, password } = req.body;
        let user = await Login.findOne({ email: email })

        let firstName = user.firstName;
        let lastName = user.lastName;
        let fullName = firstName +' '+  lastName;
        let mobile =  user.mobile;


        if (!user) {
            return res.status(200).json({ success, error: "Email Not Found" })
        }
        else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(200).json({ success, error: "Password Not Match" })
            }
            else {
                const data = {
                    user: {
                        id: user.id,
                        fullName:fullName,
                        email:email,
                        mobile:mobile
                    }
                }

                await Login.updateOne(
                    { email },
                    {
                        $set: {
                            ipAddress: ipString,
                            browserLogin: userAgent,
                            lastLoginDate: Date.now(),
                        }
                    }
                );               

                const authToken = jwt.sign(data,JWT_SECRET);
                res.json({success:true, error:authToken})
            }

        }
    } catch (error) {
        return res.status(500).json({ success, error: `Internal Error Occured ${error.message}` })
    }
});

module.exports = router;