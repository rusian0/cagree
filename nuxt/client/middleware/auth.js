import { Auth } from 'aws-amplify'

export default async ({ store, redirect }) => {
  let signedIn = false
  await Auth.currentUserInfo()
    .then(data => (signedIn = Boolean(data)))
    .then(() => signedIn || redirect('/auth/login'))
}
