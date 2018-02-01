const IPFS = require('ipfs');
const OrbitDb = require('orbit-db');

function handleError(e) {
  console.error(e.stack);
}

const main = () => {
  console.log('Starting IPFS...');

  // Create IPFS instance
  const ipfs = new IPFS({
    repo: '/orbitdb/examples/browser/new/ipfs/0.27.3',
    start: true,
    EXPERIMENTAL: {
      pubsub: true,
    },
    config: {
      Addresses: {
        Swarm: [
          // Use IPFS dev signal server
          // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
          '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
          // Use local signal server
          // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
        ],
      },
    },
  });

  ipfs.on('error', e => handleError(e));
  ipfs.on('ready', async () => {
    console.log('IPFS Started');

    console.log('IPFS id: ', await ipfs.id());
    const orbitdb = new OrbitDb(ipfs);
    console.log(orbitdb);
    console.log('Creating/loading database...');
    const db = await orbitdb.docstore('mydb', { indexBy: 'name' });
    await db.load();

    console.log('DB address: ', `/orbitdb/${db.address.root}/${db.address.path}`);
    await db.put({ _id: 'QmAwesomeIpfsHash', name: 'shamb0t', followers: 500 });
    await db.put({
      _id: 'QmAwesomeIpfsHash2',
      name: 'shamb0t2',
      followers: 5000,
    });
    db.query(e => console.log(e));
    // eslint-disable-next-line no-unused-vars
    console.log(db.query(e => true));
  });
};

export default main;
