**DEV INSTRUCTIONS**
(1) Get your API key from https://cloud.walletconnect.com/, its free. You can sign in with your web3 wallet or with an email. Then create a test app to get your key.
(2) Copy the .env.local.example file to .env.local
(3) Copy the key from (1) and set it to VITE_WALLETCONNECT_CLOUD_ID={WALLETCONNECT_KEY}
(4) Run `yarn` and `yarn dev`, the dapp should now be running on localhost:5173

**CONTRIBUTION GUIDELINES**
- Create a branch, then once you're ready to merge make a pull request.
- Make sure your code is readable.
- If you use AI generated codes, make sure to clean it up before making a pr.
- Use small commits that are focused on specific components, hooks, or other features.
- Use descriptive commit messages that make it easy to understand what your commits do.
- Use eslint and prettier (included in the package.json)
- Dont flatten commits.
