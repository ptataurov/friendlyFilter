export default {
  login(appId) {
    return new Promise((resolve, reject) => {
      VK.init({
        apiId: appId
      });

      VK.Auth.login(response => {
        if (response.session) {
          resolve(response);
        } else {
          reject(new Error('Не удалось авторизоваться'));
        }
      }, 2)
    });
  },
  callAPI(method, params) {
    params.v = params.v || '5.76';

    return new Promise((resolve, reject) => {
      VK.api(method, params, response => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.response);
        }
      })
    });
  },
  async getFriends(params = {}) {
    const { items: friends } = await this.callAPI('friends.get', params);

    return friends;
  }
};