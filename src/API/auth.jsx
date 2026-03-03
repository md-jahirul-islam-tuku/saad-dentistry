export const setAuthToken = (user) => {
  const currentUser = {
    email: user.email,
  };
  fetch(`${process.env.REACT_APP_API_BASE_URL}/jwt`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(currentUser),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      localStorage.setItem("saad-token", data.token);
    });
};
