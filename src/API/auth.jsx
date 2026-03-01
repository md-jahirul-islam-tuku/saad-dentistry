export const setAuthToken = user => {
  const currentUser = {
    email: user.email
  }
  fetch('https://saad-dentistry-server.vercel.app/jwt', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(currentUser)
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      localStorage.setItem('saad-token', data.token);
    });
}