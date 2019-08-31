// console.log('test')
export const actions = {
    async testaction(context, loginInfo) {
        const response = await this.$axios.get('http://zipcloud.ibsnet.co.jp/api/search', {params: { zipcode: '3300053'}})
        // context.commit('setUser', response.data)
        console.log(response.data)
    },
}