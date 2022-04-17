## Titter - Web3 Social chat

🛠 Built with [Next.js](https://nextjs.org/), [Arweave](https://www.arweave.org/), [Bundlr](https://bundlr.network/), [Ceramic](https://ceramic.network/), GraphQL, & [Polygon](https://polygon.technology/)

![Titter](headerimage.jpg)

### How it works

This is a working prototype of a basic web3-native social application. Features include:

- Permanent post storage (Arweave)
- Editable, self-sovereign user profiles (Ceramic [self.id](https://self.id/))
- [GraphQL queries](https://gql-guide.vercel.app/) 
- Filtering at protocol level (not on client)
- Fund and check balance of Bundlr
- [Pagination](https://gql-guide.vercel.app/#pagination) can also be implemented fairly easily with a few extra lines of code at protocol level

Caveats:

1. Right now [there is an issue](https://github.com/Bundlr-Network/js-client/issues/35) with Bundlr + Arweave in that the gateway can miss Bundlr txs and think that it never hit Arweave (when it does). Hopefully this gets fixed soon.

2. The extent to which you can query is limited by what is offered at the protocol level. The Graph [Arweave integration](https://thegraph.com/blog/graph-arweave) will unlock a lot more flexibility and power at some point in the near future.

## Deploying the app

To deploy this project, follow these steps:

1. Clone the project & change into the new directory

```sh
git clone git@github.com:dabit3/titter.git

cd titter
```

2. Install dependencies

```sh
yarn

# or

npm install
```

3. Run the app

```sh
npm run dev
```