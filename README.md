# Userfront toolkit demo

This app demonstrates how to use the Userfront Toolkit to allow signup, login, password reset, and logout.

## To run this site locally

1. Clone the repo and install dependencies

```
git clone https://github.com/userfront/toolkit-demo.git
cd toolkit-demo
npm install
```

2. Replace the project ID at the top of `server.js` with your own project ID. This can be found in the URL when you're logged into Userfront.

![Userfront project ID](https://res.cloudinary.com/component/image/upload/v1583347563/guide/project_id_ilsrsa.png)

```js
// server.js
const projectId = "demo1234";
```

3. Start the server

```
npm start
```

The application will be available at http://localhost:3333

---

You can also run in watch/development mode with `npm run dev`
