export default async ({ store, redirect }) => {
    if (!store.getters['auth/check']) {
        store.dispatch('auth/check')
    }
}