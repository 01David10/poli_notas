import jwt from 'jsonwebtoken'

const tokenSecret = process.env.TOKEN_SECRET

function createAccessToken (payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      tokenSecret,
      {
        expiresIn: '1d'
      },
      (err, token) => {
        if (err) reject(err)
        resolve(token)
      }
    )
  })
}

const authRequired = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'No Token, Authorization denied' })
  }

  jwt.verify(token, tokenSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid Token' })
    }

    req.user = user
    next()
  })
}

const authForAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin only' })
  }
  next()
}

export { createAccessToken, authRequired, authForAdmin }
