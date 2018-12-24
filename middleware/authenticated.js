export default function ({req, redirect}) {
  // const userAgent = process.server ? req.headers['user-agent'] : navigator.userAgent
  if(req) {
    const {authUser = {}} = req.session;
    if(authUser.group === 100 || !authUser.group) {
      redirect('/setting')
    }
  }
}
