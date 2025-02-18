const getLocalRefreshToken = () => {
    const refresh_token = JSON.parse(localStorage.getItem("refresh_token"));
    return refresh_token;
  };
  
  const getLocalAccessToken = () => {
    const access_token = JSON.parse(localStorage.getItem("access_token"));
    return access_token;
  };
  
  const updateLocalRefreshToken = (token) => {
    localStorage.setItem("refresh_token", JSON.stringify(token));
  };

  const updateLocalAccessToken = (token) => {
    localStorage.setItem("access_token", JSON.stringify(token));
  };
  const removeTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };
  const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalRefreshToken,
    updateLocalAccessToken,
    removeTokens,
  };
  
  export default TokenService;