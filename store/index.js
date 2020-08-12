import JWTDecode from 'jwt-decode'
import cookieparser from 'cookieparser'

export const actions = {
  nuxtServerInit({ dispatch }, { req }) {
    if (process.server && process.static) return
    if (!req.headers.cookie) return

    const parsed = cookieparser.parse(req.headers.cookie)
    const accessTokenCookie = parsed.access_token

    if (!accessTokenCookie) return

    const decoded = JWTDecode(accessTokenCookie)
    console.log('nuxtServerInit', decoded)

    if (decoded) {
      dispatch('auth/setUser', {
        uid: decoded.user_id,
        displayName: decoded.name,
        photoURL: decoded.picture
      })
    }
  }
}
