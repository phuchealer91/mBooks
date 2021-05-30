const admin = require('../firebase')
const User = require('../models/user.model')
module.exports.isAuth = async (req, res, next) => {
  // console.log('req', req.headers)
  // console.log('header', req.headers.authorization)
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authorization)
    req.user = firebaseUser
    next()
  } catch (error) {
    console.log('loi gi the', error)
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports.isAdmin = async (req, res, next) => {
  const { email } = req.user

  const adminUser = await User.findOne({ email }).exec()

  if (adminUser.role !== 'admin') {
    res.status(403).json({
      error: 'Admin resource. Access denied.',
    })
  } else {
    next()
  }
}
