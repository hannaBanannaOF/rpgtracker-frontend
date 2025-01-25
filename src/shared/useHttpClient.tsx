export function useHttpClient() {
  const kcRedirect = "http://localhost:8080/realms/HBsites/protocol/openid-connect/auth?client_id=rpgtracker&response_type=code&redirect_uri=http://localhost:8081/oauth/callback&scope=openid";
  const baseUrl = 'http://localhost:8081'

  const get = async (uri: string) => {
    return await fetch(`${baseUrl}${uri}`, {credentials: 'include'})
      .then(response => {
        if (response.status == 401) {
          window.location.replace(kcRedirect)
        }
        if (!response.ok) {
          return Promise.reject(response)
        }
        if (response.status == 204) {
          return Promise.resolve();
        }
        return response.json()
      })
      .then(json => {
        if (json != null) {
          return json
        }
        return Promise.resolve();
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  const put = async (uri: string, data?: any) => {
    return await fetch(`${baseUrl}${uri}`, {
      credentials: 'include',  
      method: "PUT", 
      headers: data != null ? {
        'Content-Type': 'application/json;charset=UTF-8'
      } : undefined,
      body: data != null ? JSON.stringify(data) : undefined
    })
      .then(response => {
        if (response.status == 401) {
          window.location.replace(kcRedirect)
        }
        if (!response.ok) {
          return Promise.reject(response)
        }
        if (response.status == 204) {
          return Promise.resolve();
        }
        return response.json()
      })
      .then(json => {
        if (json != null) {
          return json
        }
        return Promise.resolve();
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  const post = async (uri: string, data?: any) => {
    return await fetch(`${baseUrl}${uri}`, {
      credentials: 'include',  
      method: "POST", 
      headers: data != null ? {
        'Content-Type': 'application/json;charset=UTF-8'
      } : undefined,
      body: data != null ? JSON.stringify(data) : undefined
    })
      .then(response => {
        if (response.status == 401) {
          window.location.replace(kcRedirect)
        }
        if (!response.ok) {
          return Promise.reject(response)
        }
        if (response.status == 204) {
          return Promise.resolve();
        }
        return response.json()
      })
      .then(json => {
        if (json != null) {
          return json
        }
        return Promise.resolve();
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  const del = async (uri: string) => {
    return await fetch(`${baseUrl}${uri}`, {credentials: 'include', method: "DELETE"})
      .then(response => {
        if (response.status == 401) {
          window.location.replace(kcRedirect)
        }
        if (!response.ok) {
          return Promise.reject(response)
        }
        if (response.status == 204) {
          return Promise.resolve();
        }
        return response.json()
      })
      .then(json => {
        if (json != null) {
          return json
        }
        return Promise.resolve();
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  return {
    get: get,
    put: put,
    post: post,
    delete: del
  }
}